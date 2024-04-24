import { PopupContainer, PopupContentHeader, PopupContentSelectableItem, PopupContentSession } from "./utils";
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useEffect, useState } from "react";

export const MicOptionsPopups = () => {
    const [selectMicIndex, setSelectMicIndex] = useState(0);
    const [selectSpeakerIndex, setSelectSpeakerIndex] = useState(0);
    const [audioDeviceNames, setAudioDeviceNames] = useState<string[]>([]);
    const [speakerDeviceNames, setSpeakerDeviceNames] = useState<string[]>([]);


    useEffect(() => {
        navigator.mediaDevices.enumerateDevices()
          .then(devices => {
            console.log(devices)
            const audios = devices.filter(device => device.kind === 'audioinput');
            const speakers = devices.filter(device => device.kind === 'audiooutput');
    
            setAudioDeviceNames(audios.map(device => device.label));
            setSpeakerDeviceNames(speakers.map(device => device.label));
    
            console.log(audioDeviceNames)
            console.log(speakerDeviceNames)
          })
          .catch(error => {
            console.error('Error enumerating devices:', error);
          });
      }, [])

    return (
        <PopupContainer>
            <PopupContentSession>
                <PopupContentHeader icon={<MicRoundedIcon />} title="Select microphone" />
                {
                    audioDeviceNames.map((value, index) => (
                        <PopupContentSelectableItem key={index} title={value} icon={<CheckCircleRoundedIcon />} selected={index == selectMicIndex} onSelect={() => setSelectMicIndex(index)} />
                    ))
                }
            </PopupContentSession>
            <PopupContentSession>
                <PopupContentHeader icon={<MicRoundedIcon />} title="Select speaker" />
                {
                    speakerDeviceNames.map((value, index) => (
                        <PopupContentSelectableItem key={index} title={value} icon={<CheckCircleRoundedIcon />} selected={index == selectSpeakerIndex} onSelect={() => setSelectSpeakerIndex(index)} />
                    ))
                }
            </PopupContentSession>
        </PopupContainer>
    )
}