import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { setMessage } from './message';
import { FileService } from '../../service/api/file.service';
import { FileState, MyFile } from '../../model/interface/file';
import { setIsLoggedIn } from './auth';
import { ToastLevel } from '../../model/type/level';
import { setIsLoading } from './loader';

const dispatchActions = (
  thunkAPI: any,
  message: string,
  isLoggedIn: boolean,
  level: ToastLevel,
) => {
  thunkAPI.dispatch(setMessage({ message, level }));
  thunkAPI.dispatch(setIsLoggedIn({ isLoggedIn }));
};

export const findAll = createAsyncThunk(
  'file/findAll',
  async (
    parameters: { limit: number; page: number; search: string; orderBy: string },
    thunkAPI,
  ) => {
    thunkAPI.dispatch(setIsLoading({ isLoading: true }));
    try {
      const { limit, page, search, orderBy } = parameters;
      const sortBy = orderBy.split('-')[0];
      const sortMode = orderBy.split('-')[1];
      const response = await FileService.getFiles(limit, page, search, sortBy, sortMode);
      if (response.status === 200) {
        const { files, total } = response.data;
        thunkAPI.dispatch(setIsLoading({ isLoading: false }));
        return { files, total };
      } else {
        const errorMessage = response.data?.message || 'An error occurred.';
        thunkAPI.dispatch(setIsLoading({ isLoading: false }));
        throw new Error(errorMessage);
      }
    } catch (error: Error | any) {
      const message =
        (error?.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      dispatchActions(thunkAPI, message, false, 'error');
      thunkAPI.dispatch(setIsLoading({ isLoading: false }));
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteFile = createAsyncThunk(
  'file/deleteFile',
  async (metaData: MyFile, thunkAPI) => {
    thunkAPI.dispatch(setIsLoading({ isLoading: true }));
    if (metaData?.id) {
      // set state isLoading to true
      const response = await FileService.deleteFile(metaData.id);
      if (response.status === 200) {
        thunkAPI.dispatch(setMessage({ message: 'File deleted successfully !' }));
        thunkAPI.dispatch(setIsLoading({ isLoading: false }));
        return { hasDeleted: true };
      } else {
        const message = response.data?.message || response?.statusText || 'An error occurred.';
        dispatchActions(thunkAPI, message, false, 'error');
        thunkAPI.dispatch(setIsLoading({ isLoading: false }));
        return thunkAPI.rejectWithValue(message);
      }
    } else {
      const noFileFound = 'No file founded !';
      thunkAPI.dispatch(setMessage({ message: noFileFound, level: 'warning' }));
      thunkAPI.dispatch(setIsLoading({ isLoading: false }));
      return thunkAPI.rejectWithValue(noFileFound);
    }
  },
);

export const renameFile = createAsyncThunk(
  'file/renameFile',
  async (parameters: { metaData: MyFile; newFileName: string }, thunkAPI) => {
    thunkAPI.dispatch(setIsLoading({ isLoading: true }));
    const { metaData, newFileName } = parameters;
    if (metaData?.name) {
      if (metaData?.name === newFileName) {
        const sameFileName = 'Same file name';
        thunkAPI.dispatch(setMessage({ message: sameFileName, level: 'warning' }));
        thunkAPI.dispatch(setIsLoading({ isLoading: false }));
        return thunkAPI.rejectWithValue(sameFileName);
      } else {
        const response = await FileService.renameFile(metaData?.name, newFileName as string);
        if (response.status === 200) {
          thunkAPI.dispatch(setMessage({ message: 'File renamed successfully !' }));
          thunkAPI.dispatch(setIsLoading({ isLoading: false }));
          return thunkAPI.fulfillWithValue('File renamed successfully !');
        } else {
          const message = response.data?.message || response?.statusText || 'An error occurred.';
          dispatchActions(thunkAPI, message, false, 'error');
          thunkAPI.dispatch(setIsLoading({ isLoading: false }));
          return thunkAPI.rejectWithValue(message);
        }
      }
    } else {
      thunkAPI.dispatch(setMessage({ message: 'No file founded !', level: 'warning' }));
      thunkAPI.dispatch(setIsLoading({ isLoading: false }));
      return thunkAPI.rejectWithValue('No file founded !');
    }
  },
);

export const zipFile = createAsyncThunk(
  'file/zipFile',
  async (parameters: { name: string }, thunkAPI) => {
    thunkAPI.dispatch(setIsLoading({ isLoading: true }));
    const { name } = parameters;
    if (name) {
      const response: any = await FileService.zipFile(name as string);
      if (response.data) {
        thunkAPI.dispatch(setMessage({ message: 'File zipped successfully !' }));
        thunkAPI.dispatch(setIsLoading({ isLoading: false }));
        return thunkAPI.fulfillWithValue('File zipped successfully !');
      } else {
        const message =
          response.data?.message || response?.statusText || 'An error occurred on zipped action.';
        dispatchActions(thunkAPI, message, false, 'error');
        thunkAPI.dispatch(setIsLoading({ isLoading: false }));
        return thunkAPI.rejectWithValue(message);
      }
    }
  },
);

const initialState: FileState = {
  hasDeleted: false,
  hasRenamed: false,
  data: [],
  total: 0,
};
const dataSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(findAll.fulfilled, (state, action) => {
        state.data = action.payload.files;
        state.total = action.payload.total;
      })
      .addCase(findAll.rejected, (state) => {
        state.data = undefined;
      })
      .addCase(deleteFile.fulfilled, (state) => {
        state.hasDeleted = true;
      })
      .addCase(deleteFile.rejected, (state) => {
        state.hasDeleted = false;
      })
      .addCase(renameFile.fulfilled, (state) => {
        state.hasRenamed = true;
      })
      .addCase(renameFile.rejected, (state) => {
        state.hasRenamed = false;
      });
  },
});

export default dataSlice.reducer;
