import { configureStore } from '@reduxjs/toolkit'

import { setupListeners } from '@reduxjs/toolkit/query'
import { questionAPI } from './api'


export const store = configureStore({
  reducer: {
    [questionAPI.reducerPath]: questionAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(questionAPI.middleware),
})


setupListeners(store.dispatch)