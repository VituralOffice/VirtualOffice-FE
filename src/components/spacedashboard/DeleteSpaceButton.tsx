import { GeneralButton } from '.'
import { SpaceDashboardComponentParams } from './type'
import { ChangeRoomSetting } from '../../apis/RoomApis'
import { isApiSuccess } from '../../apis/util'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { UNKNOWN_ERROR } from '../../constant'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'

export default function DeleteSpaceButton({ room, refreshRoom }: SpaceDashboardComponentParams) {
  const deleteSpace = async () => {
    // if (!room) return
    // try {
    //   if (room!._id) {
    //     const response = await ChangeRoomSetting(room!._id, { active: !room.active })
    //     if (isApiSuccess(response)) {
    //       toast('Shut down space success!')
    //     }
    //   }
    // } catch (error) {
    //   if (error instanceof AxiosError) toast(error.response?.data?.message)
    //   else toast(UNKNOWN_ERROR)
    // }
  }

  return (
    <GeneralButton isActive={true} onClick={deleteSpace}>
      <span>
        <span>
          <DeleteRoundedIcon />
        </span>
      </span>
      Delete Space
    </GeneralButton>
  )
}
