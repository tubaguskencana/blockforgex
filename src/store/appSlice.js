import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  fullName: '',
  email: '',
  jobStatus: 'active',
  consents: [],
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    upsert(state, { payload }) { Object.assign(state, payload) }, 
    reset: () => initialState,
  },
})

export const { upsert, reset } = appSlice.actions
export default appSlice.reducer
