import { configureStore } from '@reduxjs/toolkit'
import app from './appSlice'

const PERSIST_KEY = 'blockforgex.app'       // simpan hanya slice app
const loadState = () => {
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    return raw ? { app: JSON.parse(raw) } : undefined
  } catch { return undefined }
}

const store = configureStore({
  reducer: { app },
  preloadedState: loadState(),
})

store.subscribe(() => {
  try { localStorage.setItem(PERSIST_KEY, JSON.stringify(store.getState().app)) } catch {}
})

export default store
export const selectApp = (state) => state.app
