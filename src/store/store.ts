// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { authInitialState } from "./authSlice";
import { getToken } from "../utils/storage";

const preloadedToken = getToken();

const preloadedState = preloadedToken
  ? {
      auth: {
        ...authInitialState,
        matchidToken: preloadedToken,
        isAuthenticated: true,
      },
    }
  : undefined;

export const store = configureStore({
  reducer: { auth: authReducer },
  preloadedState,
});
