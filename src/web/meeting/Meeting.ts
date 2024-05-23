import Network from "../../services/Network";
import store from "../../stores";
import { openMeetingDialog } from "../../stores/MeetingStore";

export class Meeting {
    id?: string
    currentUsers = new Set<string>()

    constructor(meetingId: string) {
        this.id = meetingId;
    }

    addCurrentUser(userId: string) {
        if (!this.currentUsers || this.currentUsers.has(userId)) return
        this.currentUsers.add(userId)
        const meetingState = store.getState().meeting
        if (meetingState.meetingId === this.id) {
            meetingState.shareScreenManager?.onUserJoined(userId)
        }
    }

    removeCurrentUser(userId: string) {
        if (!this.currentUsers || !this.currentUsers.has(userId)) return
        this.currentUsers.delete(userId)
        const meetingState = store.getState().meeting
        if (meetingState.meetingId === this.id) {
            meetingState.shareScreenManager?.onUserLeft(userId)
        }
    }

    openDialog(playerId: string, network: Network) {
        if (!this.id) return
        store.dispatch(openMeetingDialog({ meetingId: this.id, myUserId: playerId }))
        network.connectToMeeting(this.id)
    }
}