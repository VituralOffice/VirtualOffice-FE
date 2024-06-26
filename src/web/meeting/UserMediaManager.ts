import Peer, { MediaConnection } from 'peerjs'
import store from '../../stores'
import Game from '../../scenes/Game'
import { setMyCameraStream, addCameraStream, removeCameraStream } from '../../stores/MeetingStore'
import { PEER_CONNECT_OPTIONS } from '../../constant'
import Network from '../../services/Network'

export default class UserMediaManager {
  private myPeer: Peer
  private isReady: boolean = false
  myStream?: MediaStream

  constructor(private userId: string) {
    const sanatizedId = this.makeId(userId)
    this.myPeer = new Peer(sanatizedId, PEER_CONNECT_OPTIONS)
    this.myPeer.on('error', (err) => {
      console.log('UserMediaManager err.type', err.type)
      console.error('UserMediaManager', err)
    })

    this.myPeer.on('call', (call) => {
      console.log(`receive call from ${call.peer}`)
      const sessionId = call.metadata.sessionId
      if (this.isReady) {
        call.answer()
        call.on('stream', (userVideoStream) => {
          console.log(`UserMediaManager::on stream ${call.peer}`)
          store.dispatch(
            addCameraStream({
              id: call.peer,
              sessionId: sessionId,
              call,
              stream: userVideoStream,
            })
          )
        })
      } else {
        // queue the call until ready
        this.queuedCalls.push(call)
      }
    })
    console.log('UserMediaManager: sanatizedId: ' + sanatizedId)
  }

  onOpen() {
    if (this.myPeer.disconnected) {
      this.myPeer.reconnect()
    }
  }

  onClose() {
    this.stopCameraShare()
    this.myPeer.disconnect()
  }

  // PeerJS throws invalid_id error if it contains some characters such as that colyseus generates.
  // https://peerjs.com/docs.html#peer-id
  // Also for screen sharing ID add a `-ss` at the end.
  private makeId(id: string) {
    return `${id.replace(/[^0-9a-z]/gi, 'G')}-um`
  }

  async startCameraShare(video: boolean, microphone: boolean, meetingId: string): Promise<boolean> {
    if (!video && !microphone) return false
    const result = await navigator.mediaDevices
      ?.getUserMedia({
        video: video,
        audio: microphone,
      })
      .then((stream) => {
        this.myStream = stream
        store.dispatch(setMyCameraStream(stream))

        this.isReady = true
        this.processQueuedCalls()

        // Call all existing users.
        const meetingItem = Game.getInstance()?.meetingMap.get(meetingId)
        if (meetingItem) {
          for (const userId of meetingItem.currentUsers) {
            console.log('connected users: ' + userId)
            this.onUserJoined(userId)
          }
        }
        return true
      })
      .catch((e) => {
        return false
      })
    return result
  }

  // TODO(daxchen): Fix this trash hack, if we call store.dispatch here when calling
  // from onClose, it causes redux reducer cycle, this may be fixable by using thunk
  // or something.
  stopCameraShare() {
    this.myStream?.getTracks().forEach((track) => track.stop())
    this.myStream = undefined
  }

  onUserJoined(userId: string) {
    if (!this.myStream || userId == this.userId) return
    console.log(`UserMediaManager::onUserJoined userId: ${this.userId}, peerId: ${userId}`)

    const sanatizedId = this.makeId(userId)
    console.log(`UserMediaManager::onuserJoined call ${sanatizedId}`)
    const callOptions = {
      metadata: {
        sessionId: Network.getInstance()?.mySessionId,
      },
    }
    this.myPeer.call(sanatizedId, this.myStream, callOptions)
  }

  onUserLeft(userId: string) {
    if (userId === this.userId) return

    const sanatizedId = this.makeId(userId)
    store.dispatch(removeCameraStream(sanatizedId))
  }

  private processQueuedCalls() {
    this.queuedCalls.forEach((call) => {
      call.answer()
      const sessionId = call.metadata.sessionId
      call.on('stream', (userVideoStream) => {
        console.log(`UserMediaManager::on stream ${call.peer}`)
        store.dispatch(
          addCameraStream({
            id: call.peer,
            sessionId: sessionId,
            call,
            stream: userVideoStream,
          })
        )
      })
    })
    this.queuedCalls = []
  }

  private queuedCalls: MediaConnection[] = []
}
