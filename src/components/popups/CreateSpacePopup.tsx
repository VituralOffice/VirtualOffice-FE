import styled from 'styled-components'
import { PopupProps } from '../../interfaces/Interfaces'
import { useEffect, useState } from 'react'
import { CreateRoom } from '../../apis/RoomApis'
import { ChooseMap } from '../forms/ChooseMap'
import { CreateRoomForm } from '../forms/CreateRoomForm'
import Bootstrap from '../../scenes/Bootstrap'
import { useNavigate } from 'react-router-dom'
import { FormPopup } from './FormPopup'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { UNKNOWN_ERROR } from '../../constant'
import { IMap } from '../../interfaces/map'
import ApiService from '../../apis/ApiService'
import { ISubscription } from '../../interfaces/plan'
import store from '../../stores'
import { setStyledMap } from '../../stores/MapStore'
import { useAppSelector } from '../../hook'
export interface StyleMap {
  style: string
  maps: IMap[]
}
export const CreateSpacePopup: React.FC<PopupProps> = ({ onClosePopup }) => {
  const navigate = useNavigate()
  const totalSteps = 2
  const styledMap = useAppSelector((state) => state.map.styledMaps)
  const titles = ['Choose your office template', 'Create a new office space for your team']
  // const [subscriptions, setSubscriptions] = useState<ISubscription[]>([])
  const subscription = useAppSelector((state) => state.user.subscription)
  const [spaceName, setSpaceName] = useState('')
  const [securitySelectedOption, setSecuritySelectedOption] = useState(0)
  const spaceOptions = ['Anyone with the office URL can enter', 'Only invited members can enter']
  const [mapId, setMapId] = useState('')
  const [mapSize, setMapSize] = useState(10)
  const [formComplete, setFormComplete] = useState(false)
  // const fetchSubscription = async () => {
  //   try {
  //     const res = await ApiService.getInstance().get(`/subscriptions?status=active`)
  //     setSubscriptions(res.result)
  //   } catch (error) {}
  // }
  const fetchListMap = async () => {
    try {
      const res = await ApiService.getInstance().get(`/maps?groupBy=style`)
      if (res.message === `Success`) {
        store.dispatch(setStyledMap(res.result))
      }
    } catch (error) {}
  }
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
    try {
      if (!checkSpaceName() || !checkSecurityOption() || !checkMapId() || !checkMapSize()) return
      const response = await CreateRoom({
        map: mapId,
        name: spaceName,
        private: securitySelectedOption == 1,
        plan: subscription.plan._id,
      })
      console.log('Room created: ', response)
      navigate(`/room/${response.result._id}`)
    } catch (error) {
      if (error instanceof AxiosError) toast(error.response?.data?.message)
      else toast(UNKNOWN_ERROR)
      onClosePopup()
    }
  }

  const PopupContents = [
    <ChooseMap mapSize={mapSize} setMapId={setMapId} setMapSize={setMapSize} />,
    <CreateRoomForm
      spaceName={spaceName}
      setSpaceName={setSpaceName}
      setSecuritySelectedOption={setSecuritySelectedOption}
      spaceOptions={spaceOptions}
    />,
  ]
  useEffect(() => {
    fetchListMap()
    // fetchSubscription()
  }, [])
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
