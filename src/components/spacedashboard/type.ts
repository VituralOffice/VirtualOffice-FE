import { IRoomData } from "../../types/Rooms";

export interface SpaceDashboardComponentParams {
    room?: IRoomData
    refreshRoom: () => Promise<void>
}
