import Peer from 'peerjs'
import store from '../../stores'
import Game from '../../scenes/Game'
import { addDisplayStream, removeDisplayStream, setMyDisplayStream } from '../../stores/MeetingStore'
import { PEER_CONNECT_OPTIONS } from '../../constant'
import Network from '../../services/Network'

export default class ShareScreenManager {
  private myPeer: Peer
  myStream?: MediaStream

  constructor(private userId: string) {
    const sanatizedId = this.makeId(userId)
    console.log("ScreenSharingManager: sanatizedId: " + sanatizedId)
    this.myPeer = new Peer(sanatizedId, PEER_CONNECT_OPTIONS)
    this.myPeer.on('error', (err) => {
      console.log('ShareScreenWebRTC err.type', err.type)
      console.error('ShareScreenWebRTC', err)
    })

    this.myPeer.on('call', (call) => {
      console.log("ScreenShareingManager::receive call")
      const sessionId = call.metadata.sessionId;
      call.answer()
      call.on('stream', (userVideoStream) => {
        console.log(`ScreenShareingManager::on stream ${call.peer}`)
        store.dispatch(addDisplayStream({ id: call.peer, sessionId: sessionId, call, stream: userVideoStream }))
      })
      // we handled on close on our own
    })
  }

  onOpen() {
    if (this.myPeer.disconnected) {
      this.myPeer.reconnect()
    }
  }

  onClose() {
    this.stopScreenShare(false)
    this.myPeer.disconnect()
  }

  // PeerJS throws invalid_id error if it contains some characters such as that colyseus generates.
  // https://peerjs.com/docs.html#peer-id
  // Also for screen sharing ID add a `-ss` at the end.
  private makeId(id: string) {
    return `${id.replace(/[^0-9a-z]/gi, 'G')}-ss`
  }

  async startScreenShare() {
    // @ts-ignore
    let success = await navigator.mediaDevices
      ?.getDisplayMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        // Detect when user clicks "Stop sharing" outside of our UI.
        // https://stackoverflow.com/a/25179198
        const track = stream.getVideoTracks()[0]
        if (track) {
          track.onended = () => {
            this.stopScreenShare()
          }
        }

        this.myStream = stream
        store.dispatch(setMyDisplayStream(stream))

        // Call all existing users.
        const meetingItem = Game.getInstance()?.meetingMap.get(store.getState().meeting.activeMeetingId!)
        if (meetingItem) {
          for (const userId of meetingItem.currentUsers) {
            this.onUserJoined(userId)
          }
        }
        return true
      }).catch((error) => {
        return false
      });
    return success
  }

  // TODO(daxchen): Fix this trash hack, if we call store.dispatch here when calling
  // from onClose, it causes redux reducer cycle, this may be fixable by using thunk
  // or something.
  stopScreenShare(shouldDispatch = true) {
    if (!this.myStream) return;
    this.myStream.getTracks().forEach((track) => track.stop())
    this.myStream = undefined
    if (shouldDispatch) {
      store.dispatch(setMyDisplayStream(null))
      // Manually let all other existing users know screen sharing is stopped
      Network.getInstance()?.onStopScreenShare(store.getState().meeting.activeMeetingId!)
    }
  }

  onUserJoined(userId: string) {
    if (!this.myStream || userId === this.userId) return

    const sanatizedId = this.makeId(userId)
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
    store.dispatch(removeDisplayStream(sanatizedId))
  }
}
