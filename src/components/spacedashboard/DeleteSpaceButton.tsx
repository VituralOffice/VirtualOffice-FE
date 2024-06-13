import { GeneralButton } from '.'
import { SpaceDashboardComponentParams } from './type'
import { DeleteRoom } from '../../apis/RoomApis'
import { isApiSuccess } from '../../apis/util'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { UNKNOWN_ERROR } from '../../constant'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { YesNoPopup } from '../popups/YesNoPopup'

export default function DeleteSpaceButton({ room, refreshRoom }: SpaceDashboardComponentParams) {
  const [showPopup, setShowPopup] = useState(false)
  const navigate = useNavigate()
  const deleteSpace = async () => {
    if (!room) return
    try {
      if (room!._id) {
        const response = await DeleteRoom(room!._id)
        if (isApiSuccess(response)) {
          toast('Delete space success!')
          navigate('/app')
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) toast(error.response?.data?.message)
      else toast(UNKNOWN_ERROR)
    }
  }

  return (
    <>
      <GeneralButton isActive={true} onClick={() => setShowPopup(true)}>
        <span>
          <span>
            <DeleteRoundedIcon />
          </span>
        </span>
        Delete Space
      </GeneralButton>
      {showPopup && (
        <YesNoPopup
          title="Warning"
          text="You are going to delete this space. Do you want to continue?"
          submitText="Delete"
          onSubmit={deleteSpace}
          onClosePopup={() => setShowPopup(false)}
        />
      )}
    </>
  )
}
