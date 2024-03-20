import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
  },
});

export const { setIsLoading } = loaderSlice.actions;
export default loaderSlice.reducer;
