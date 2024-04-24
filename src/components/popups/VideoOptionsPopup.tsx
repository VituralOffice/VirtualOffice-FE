import { PopupContainer, PopupContentHeader, PopupContentSelectableItem, PopupContentSession } from "./utils";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useEffect, useState } from "react";
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';

export const VideoOptionsPopups = () => {
    const [selectCameraIndex, setSelectCameraIndex] = useState(0);
    const [cameraDeviceNames, setCameraDeviceNames] = useState<string[]>([]);

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setCameraDeviceNames(videoDevices.map(device => device.label));
                console.log(cameraDeviceNames)
            })
            .catch(error => {
                console.error('Error enumerating devices:', error);
            });
    }, [])

    return (
        <PopupContainer>
            <PopupContentSession>
                <PopupContentHeader icon={<VideocamRoundedIcon />} title="Select camera" />
                {
                    cameraDeviceNames.map((value, index) => (
                        <PopupContentSelectableItem key={index} title={value} icon={<CheckCircleRoundedIcon />} selected={index == selectCameraIndex} onSelect={() => setSelectCameraIndex(index)} />
                    ))
                }
            </PopupContentSession>
        </PopupContainer>
    )
}