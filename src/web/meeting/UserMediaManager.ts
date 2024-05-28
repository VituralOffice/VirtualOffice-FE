import Peer from 'peerjs'
import store from '../../stores'
import Game from '../../scenes/Game'
import {
    setMyCameraStream,
    addCameraStream,
    removeCameraStream,
} from '../../stores/MeetingStore'
import { PEER_CONNECT_OPTIONS } from '../../constant'

export default class UserMediaManager {
    private myPeer: Peer
    myStream?: MediaStream

    constructor(private userId: string) {
        const sanatizedId = this.makeId(userId)
        console.log("UserMediaManager: sanatizedId: " + sanatizedId)
        this.myPeer = new Peer(sanatizedId, PEER_CONNECT_OPTIONS)
        this.myPeer.on('error', (err) => {
            console.log('UserMediaManager err.type', err.type)
            console.error('UserMediaManager', err)
        })

        this.myPeer.on('call', (call) => {
            console.log("receive call")
            call.answer()
            call.on('stream', (userVideoStream) => {
                store.dispatch(addCameraStream({ id: call.peer, call, stream: userVideoStream }))
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
        this.stopCameraShare(false)
        this.myPeer.disconnect()
    }

    // PeerJS throws invalid_id error if it contains some characters such as that colyseus generates.
    // https://peerjs.com/docs.html#peer-id
    // Also for screen sharing ID add a `-ss` at the end.
    private makeId(id: string) {
        return `${id.replace(/[^0-9a-z]/gi, 'G')}-um`
    }

    startCameraShare(video: boolean, microphone: boolean) {
        if (!video && !microphone) return;
        // @ts-ignore
        navigator.mediaDevices
            ?.getUserMedia({
                video: video,
                audio: microphone,
            })
            .then((stream) => {
                this.myStream = stream
                store.dispatch(setMyCameraStream(stream))

                // Call all existing users.
                const meetingItem = Game.getInstance()?.meetingMap.get(store.getState().meeting.activeMeetingId!)
                if (meetingItem) {
                    for (const userId of meetingItem.currentUsers) {
                        console.log("connected users: " + userId)
                        this.onUserJoined(userId)
                    }
                }
            })
    }

    // TODO(daxchen): Fix this trash hack, if we call store.dispatch here when calling
    // from onClose, it causes redux reducer cycle, this may be fixable by using thunk
    // or something.
    stopCameraShare(shouldDispatch = true) {
        this.myStream?.getTracks().forEach((track) => track.stop())
        this.myStream = undefined
        if (shouldDispatch) {
            store.dispatch(setMyCameraStream(null))
            // Manually let all other existing users know screen sharing is stopped
            Game.getInstance()?.network.onStopCameraShare(store.getState().meeting.activeMeetingId!)
        }
    }

    onUserJoined(userId: string) {
        if (!this.myStream || userId === this.userId) return
        console.log("meeting camera call " + userId);

        const sanatizedId = this.makeId(userId)
        this.myPeer.call(sanatizedId, this.myStream)
    }

    onUserLeft(userId: string) {
        if (userId === this.userId) return

        const sanatizedId = this.makeId(userId)
        store.dispatch(removeCameraStream(sanatizedId))
    }
}
