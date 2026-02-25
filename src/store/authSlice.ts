import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/types/types";
import axios from "axios";
import type { AppDispatch } from "./store";
import { API } from "../http";



interface ILoginUser {
  email: string,
  password: string
}



interface IUser {

  username: string,
  email: string,
  password: string
  token: string | null


}

interface IAuthState {
  user: IUser,
  status: Status
}

const initialState: IAuthState = {
  user: {
    username: "",
    email: "",
    password: "",
    token: null

  },
  status: Status.LOADING
}

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUser(state: IAuthState, action: PayloadAction<IUser>) {
      state.user = action.payload
    },
    setStatus(state: IAuthState, action: PayloadAction<Status>) {
      state.status = action.payload
    },
    resetStatus(state: IAuthState,) {
      state.status = Status.LOADING
    },
    setToken(state: IAuthState, action: PayloadAction<string>) {
      state.user.token = action.payload
    }
  }

})

export const { setUser, setStatus, resetStatus, setToken } = authSlice.actions
export default authSlice.reducer


//Async thunk action to register a user
export function registerUser(data: IUser) {
  return async function registerUserThunk(dispatch: AppDispatch) {
    try {
      const response = await API.post("register", data)
      console.log(response)
      if (response.status === 201) {
        dispatch(setStatus(Status.SUCCESS))
        dispatch(setUser(data))
      }
      else {
        dispatch(setStatus(Status.ERROR))
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Backend error:", error.response?.data);
      }

      dispatch(setStatus(Status.ERROR))
    }
  }
}

export function loginUser(data: ILoginUser) {
  return async function loginUserThunk(dispatch: AppDispatch) {
    try {
      const response = await API.post("login", data)
      console.log(response)
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS))
        if (response.data.token) {
          localStorage.setItem("tokenHoYo", response.data.token)
          dispatch(setToken(response.data.token))
        }
        else {
          dispatch(setStatus(Status.ERROR))
        }

      }
      else {
        dispatch(setStatus(Status.ERROR))
      }

    } catch (error) {
      console.log(error)
      dispatch(setStatus(Status.ERROR))
    }
  }
}

export function forgotPassword(data: { email: string | null }) {
  return async function forgotPasswordThunk(dispatch: AppDispatch) {
    try {
      const response = await API.post("forgot-password", data)
      console.log(response)
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS))
      }
      else {
        dispatch(setStatus(Status.ERROR))
      }

    } catch (error) {
      console.log(error)
      dispatch(setStatus(Status.ERROR))
    }
  }
}

