import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '.'

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    isLoading: false,
    wait: false,
  },
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      if (state.wait) return
      state.isLoading = action.payload
    },
    setWait: (state, action: PayloadAction<boolean>) => {
      state.wait = action.payload
    },
  },
})

export const { setIsLoading, setWait } = loadingSlice.actions

export const startLoadingAndWait = (): AppThunk => (dispatch) => {
  dispatch(setIsLoading(true))
  dispatch(setWait(true))
}

export const stopLoading = (): AppThunk => (dispatch) => {
  dispatch(setWait(false))
  dispatch(setIsLoading(false))
}

export default loadingSlice.reducer
