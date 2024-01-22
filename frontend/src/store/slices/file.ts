import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { setMessage } from './message';
import { FileService } from '../../service/api/file.service';
import { FileState, MyFile } from '../../model/interface/file';
import { setIsLoggedIn } from './auth';
import { ToastLevel } from '../../model/type/level';

const dispatchActions = (
  thunkAPI: any,
  message: string,
  isLoggedIn: boolean,
  level: ToastLevel
) => {
  thunkAPI.dispatch(setMessage({ message, level }));
  thunkAPI.dispatch(setIsLoggedIn({ isLoggedIn }));
};

export const findAll = createAsyncThunk(
  'file/findAll',
  async (
    params: { limit: number; page: number; search: string; orderBy: string },
    thunkAPI
  ) => {
    try {
      const { limit, page, search, orderBy } = params;
      const sortBy = orderBy.split('-')[0];
      const sortMode = orderBy.split('-')[1];
      const response = await FileService.getFiles(
        limit,
        page,
        search,
        sortBy,
        sortMode
      );
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
      dispatchActions(thunkAPI, message, false, 'error');
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteFile = createAsyncThunk(
  'file/deleteFile',
  async (metaData: MyFile, thunkAPI) => {
    if (metaData?.name) {
      const response = await FileService.deleteFile(metaData.name);
      if (response.status === 200) {
        thunkAPI.dispatch(
          setMessage({ message: 'File deleted successfully !' })
        );
        return { hasDeleted: true };
      } else {
        const message =
          response.data?.message ||
          response?.statusText ||
          'An error occurred.';
        dispatchActions(thunkAPI, message, false, 'error');
        return thunkAPI.rejectWithValue(message);
      }
    } else {
      const noFileFound = 'No file founded !';
      thunkAPI.dispatch(setMessage({ message: noFileFound, level: 'warning' }));
      return thunkAPI.rejectWithValue(noFileFound);
    }
  }
);

export const renameFile = createAsyncThunk(
  'file/renameFile',
  async (params: { metaData: MyFile; newFileName: string }, thunkAPI) => {
    const { metaData, newFileName } = params;
    if (metaData?.name) {
      if (metaData?.name === newFileName) {
        const sameFileName = 'Same file name';
        thunkAPI.dispatch(
          setMessage({ message: sameFileName, level: 'warning' })
        );
        return thunkAPI.rejectWithValue(sameFileName);
      } else {
        const response = await FileService.renameFile(
          metaData?.name,
          newFileName as string
        );
        if (response.status === 200) {
          thunkAPI.dispatch(
            setMessage({ message: 'File renamed successfully !' })
          );
          return thunkAPI.fulfillWithValue('File renamed successfully !');
        } else {
          const message =
            response.data?.message ||
            response?.statusText ||
            'An error occurred.';
          dispatchActions(thunkAPI, message, false, 'error');
          return thunkAPI.rejectWithValue(message);
        }
      }
    } else {
      thunkAPI.dispatch(
        setMessage({ message: 'No file founded !', level: 'warning' })
      );
      return thunkAPI.rejectWithValue('No file founded !');
    }
  }
);

export const zipFile = createAsyncThunk(
  'file/zipFile',
  async (params: { name: string }, thunkAPI) => {
    const { name } = params;
    if (name) {
      const response: any = await FileService.zipFile(name as string);
      if (response.data) {
        thunkAPI.dispatch(
          setMessage({ message: 'File zipped successfully !' })
        );
        return thunkAPI.fulfillWithValue('File zipped successfully !');
      } else {
        const message =
          response.data?.message ||
          response?.statusText ||
          'An error occurred on zipped action.';
        dispatchActions(thunkAPI, message, false, 'error');
        return thunkAPI.rejectWithValue(message);
      }
    }
  }
);

const initialState: FileState = {
  isLoading: false,
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
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.hasDeleted = true;
      })
      .addCase(deleteFile.rejected, (state) => {
        state.hasDeleted = false;
      })
      .addCase(renameFile.fulfilled, (state, action) => {
        state.hasRenamed = true;
      })
      .addCase(renameFile.rejected, (state) => {
        state.hasRenamed = false;
      });
  },
});

export default dataSlice.reducer;
