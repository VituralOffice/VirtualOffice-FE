import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IMap } from '../interfaces/map'
export interface StyledMap {
  style: string
  maps: IMap[]
}
export const mapSlice = createSlice({
  name: 'map',
  initialState: {
    styledMaps: [],
  } as { styledMaps: StyledMap[] },
  reducers: {
    setStyledMap: (state, action: PayloadAction<StyledMap[]>) => {
      state.styledMaps = action.payload.sort((a, b) => a.style.localeCompare(b.style))
    },
  },
})
export const { setStyledMap } = mapSlice.actions
export default mapSlice.reducer
