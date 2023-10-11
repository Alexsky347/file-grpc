import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from './message';
import { FileService } from '../../service/api/file.service';
import { FileState } from '../../model/interface/file';

export const findAll = createAsyncThunk(
  'file/findAll',
  async (params: { limit: number; page: number; search: string }, thunkAPI) => {
    try {
      const { limit, page, search } = params;
      const response = await FileService.getFiles(limit, page, search, 'ASC');
      if (response.status === 200) {
        const { files, total } = response.data;
        const totalCeiled = Math.ceil(total / limit);
        return { files, total: totalCeiled };
      } else {
        const errorMessage = response.data?.message || 'An error occurred.';
        throw new Error(errorMessage);
      }
    } catch (error: Error | any) {
      const message =
        (error?.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState: FileState = {
  isLoading: false,
  data: [],
  total: 0,
};
const dataSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(findAll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(findAll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.files;
        state.total = action.payload.total;
      })
      .addCase(findAll.rejected, (state) => {
        state.isLoading = false;
        state.data = null;
      });
  },
});

export default dataSlice.reducer;
