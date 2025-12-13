import { configureStore } from '@reduxjs/toolkit';
import nguoiDungReducer from './nguoiDungSlice';
import khoaHocReducer from './khoaHocSlice';

export const store = configureStore({
  reducer: {
    nguoiDung: nguoiDungReducer,
    khoaHoc: khoaHocReducer,
  },
});