import { configureStore } from '@reduxjs/toolkit';
import nguoiDungReducer from './nguoiDungSlice';

export const store = configureStore({
  reducer: {
    nguoiDung: nguoiDungReducer,
  },
});