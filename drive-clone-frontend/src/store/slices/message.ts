import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToastLevel } from '../../model/type/level';
import { MessageState } from '../../model/interface/message-state';


const initialState: MessageState = {
  message: '',
  level: 'error',
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<MessageState>) => {
      state.level = action.payload.level ?? 'success';
      state.message = action.payload.message;
    },
    clearMessage: (state) => {
      state.message = '';
    },
  },
});

export const { setMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;
