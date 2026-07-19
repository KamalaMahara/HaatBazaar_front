import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/types/types";
import axios from "axios";
import type { AppDispatch } from "./store";
import { API } from "../http";

interface ILoginUser {
  email: string;
  password: string;
}

interface IUser {
  username: string;
  email: string;
  password?: string;
  token: string | null;
  role?: string | null;
}

interface IAuthState {
  user: IUser;
  status: Status;
}

const token = localStorage.getItem("tokenHoYo");
const role = localStorage.getItem("roleHoYo");
const username = localStorage.getItem("usernameHoYo");

const initialState: IAuthState = {
  user: {
    username: username || "",
    email: "",
    token: token || null,
    role: role || null,
  },
  status: token ? Status.SUCCESS : Status.LOADING,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUser(state: IAuthState, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
    setStatus(state: IAuthState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    resetStatus(state: IAuthState) {
      state.status = Status.LOADING;
    },
    setToken(state: IAuthState, action: PayloadAction<string>) {
      state.user.token = action.payload;
    },
  },
});

export const { setUser, setStatus, resetStatus, setToken } = authSlice.actions;
export default authSlice.reducer;

// Async thunk action to register a user
export function registerUser(data: IUser) {
  return async function registerUserThunk(dispatch: AppDispatch) {
    try {
      const response = await API.post("register", data);
      console.log(response);
      if (response.status === 201) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setUser(data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Backend error:", error.response?.data);
      }
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function loginUser(data: ILoginUser) {
  return async function loginUserThunk(dispatch: AppDispatch) {
    try {
      const response = await API.post("login", data);
      console.log(response);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        if (response.data.token) {
          localStorage.setItem("tokenHoYo", response.data.token);
          localStorage.setItem("roleHoYo", response.data.role);
          localStorage.setItem("usernameHoYo", response.data.username || "");
          dispatch(setUser({
            username: response.data.username || "",
            email: data.email,
            token: response.data.token,
            role: response.data.role || "customer",
          }));
        } else {
          dispatch(setStatus(Status.ERROR));
        }
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function logout() {
  return async function logoutThunk(dispatch: AppDispatch) {
    try {
      await API.post("logout");
    } catch (e) {
      console.error("Logout endpoint request failed", e);
    }
    localStorage.removeItem("tokenHoYo");
    localStorage.removeItem("roleHoYo");
    localStorage.removeItem("usernameHoYo");
    dispatch(setUser({
      username: "",
      email: "",
      token: null,
      role: null,
    }));
    dispatch(setStatus(Status.LOADING));
  };
}

export function forgotPassword(data: { email: string | null }) {
  return async function forgotPasswordThunk(dispatch: AppDispatch) {
    try {
      const response = await API.post("forgot-password", data);
      console.log(response);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}
