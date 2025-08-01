// src/store/authSlice.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { saveToken, clearToken } from "../utils/storage";

export interface AuthState {
  nickname: string;
  matchidAddress: string;
  matchidDid: string;
  matchidToken: string;
  isAuthenticated: boolean;

  // NEW FIELDS
  username?: string;
  userLevel?: number;
  identities?: Record<string, string>;
  isKYC?: boolean;
  isPoH?: boolean;
  score?: number;
}

const initialState: AuthState = {
  nickname: "",
  matchidAddress: "",
  matchidDid: "",
  matchidToken: "",
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthState>) {
      const {
        nickname,
        matchidAddress,
        matchidDid,
        matchidToken,
        isAuthenticated,
        username,
        userLevel,
        identities,
        isKYC,
        isPoH,
        score,
      } = action.payload;

      state.nickname = nickname;
      state.matchidAddress = matchidAddress;
      state.matchidDid = matchidDid;
      state.matchidToken = matchidToken;
      state.isAuthenticated = isAuthenticated;

      // New additions
      state.username = username;
      state.userLevel = userLevel;
      state.identities = identities;
      state.isKYC = isKYC;
      state.isPoH = isPoH;
      state.score = score;

      saveToken(matchidToken);
    },
    logout(state) {
      Object.assign(state, initialState);
      localStorage.removeItem("match-auth");
      clearToken();
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export const authInitialState = authSlice.getInitialState(); // ✅ Export initial state
export default authSlice.reducer;
