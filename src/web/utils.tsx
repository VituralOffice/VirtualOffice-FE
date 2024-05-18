import { useDispatch } from 'react-redux'
import WebRTC from './WebRTC';
import { setCameraON, setMicrophoneON } from '../stores/UserStore';

export const useToggleMicrophone = () => {
    const dispatch = useDispatch();

    const toggleMicrophone = (on: boolean) => {
        if (WebRTC?.getInstance() == null) {
            dispatch(setMicrophoneON(false));
            return;
        }
        let success = WebRTC?.getInstance()?.turnMic(on);
        if (success) {
            dispatch(setMicrophoneON(on));
        } else dispatch(setMicrophoneON(false));
    };

    return toggleMicrophone;
};

export const useToggleCamera = () => {
    const dispatch = useDispatch();

    const toggleCamera = (on: boolean) => {
        if (WebRTC?.getInstance() == null) {
            dispatch(setCameraON(false));
            return;
        }
        let success = WebRTC?.getInstance()?.turnCam(on);
        if (success) {
            dispatch(setCameraON(on));
        } else dispatch(setCameraON(false));
    }

    return toggleCamera;
}