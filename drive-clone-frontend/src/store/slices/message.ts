import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MessageState } from '../../model/interface/message-state'
import { displayToast } from '../../utils/toast/toast-service'

const initialState: MessageState = {
  message: '',
  level: 'error',
}

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<MessageState>) => {
      state.level = action.payload.level ?? 'success'
      state.message = action.payload.message
      displayToast(action.payload)
    },
    clearMessage: (state) => {
      state.message = ''
    },
  },
})

export const { setMessage, clearMessage } = messageSlice.actions
export default messageSlice.reducer
