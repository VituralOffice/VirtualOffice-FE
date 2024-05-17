import styled from 'styled-components'
import { PopupProps } from '../../interfaces/Interfaces'
import { useEffect, useState } from 'react'
import { CreateRoom } from '../../apis/RoomApis'
import { ChooseMap } from '../forms/ChooseMap'
import { CreateRoomPanel } from '../forms/CreateRoom'
import Bootstrap from '../../scenes/Bootstrap'
import { useNavigate } from 'react-router-dom'
import { FormPopup } from './FormPopup'

export const CreateSpacePopup: React.FC<PopupProps> = ({ onClosePopup }) => {
  const navigate = useNavigate()
  const totalSteps = 2
  const titles = ['Choose your office template', 'Create a new office space for your team']

  const [spaceName, setSpaceName] = useState('')
  const [securitySelectedOption, setSecuritySelectedOption] = useState(0)
  const spaceOptions = ['Anyone with the office URL can enter', 'Only invited members can enter']

  const mapIds = [
    '6623f6a93981dda1700fc844',
    '6623f6a93981dda1700fc845',
    '6623f6a93981dda1700fc846',
    '6623f6a93981dda1700fc847',
  ]
  const [mapId, setMapId] = useState(mapIds[0])
  const [mapSize, setMapSize] = useState(10)

  // const [password, setPassword] = useState('');
  // const [passwordShowing, setPasswordShowing] = useState(false);

  const [formComplete, setFormComplete] = useState(false)

  const checkSpaceName = () => {
    if (spaceName && spaceName.length > 0) return true
    return false
  }
  const checkSecurityOption = () => {
    if (securitySelectedOption >= 0 && securitySelectedOption <= spaceOptions.length - 1)
      return true
    return false
  }
  const checkMapId = () => mapId && mapId.length > 0
  const checkMapSize = () => mapSize > 0

  const submitForm = async () => {
    if (!checkSpaceName() || !checkSecurityOption() || !checkMapId() || !checkMapSize()) return

    const response = await CreateRoom({
      map: '6623f6a93981dda1700fc844',
      name: spaceName,
      private: securitySelectedOption == 1,
    })

    console.log('Room created: ', response)
    await Bootstrap.getInstance()?.network.createCustom({
      name: response.result.name,
      id: response.result._id,
      map: response.result.map,
      autoDispose: false,
    } as any)
    navigate(`/room/${response.result._id}`)
  }

  const PopupContents = [
    <ChooseMap
      mapIds={mapIds}
      mapId={mapId}
      setMapId={setMapId}
      mapSize={mapSize}
      setMapSize={setMapSize}
    />,
    <CreateRoomPanel
      spaceName={spaceName}
      setSpaceName={setSpaceName}
      setSecuritySelectedOption={setSecuritySelectedOption}
      spaceOptions={spaceOptions}
    />,
  ]

  useEffect(() => {
    if (checkSpaceName() && checkSecurityOption()) setFormComplete(true)
    else setFormComplete(false)
  }, [spaceName, securitySelectedOption])

  return (
    <FormPopup
      onClose={onClosePopup}
      titles={titles}
      forms={PopupContents}
      totalSteps={totalSteps}
      formCanBeSubmit={formComplete}
      onSubmit={submitForm}
      submitText="Create space"
    />
  )
}
