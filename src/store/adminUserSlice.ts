// store/adminUserSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/types/types";
import type { AppDispatch } from "./store";
import { APIWITHTOKEN } from "../http";

interface Iuser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface IInitialState {
  users: Iuser[];
  status: Status;
}

const initialState: IInitialState = {
  users: [],
  status: Status.LOADING,
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setUsers(state, action: PayloadAction<Iuser[]>) {
      state.users = action.payload;
    },
  },
});

export const { setStatus, setUsers } = userSlice.actions;
export default userSlice.reducer;


export function fetchUsers() {
  return async function fetchUsersThunk(dispatch: AppDispatch) {
    try {
      const response = await APIWITHTOKEN.get("/users");

      if (response.status === 200) {
        dispatch(setUsers(response.data.users));
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      console.log(error);
    }
  };
}


export function deleteUsers(id: string) {
  return async function deleteUsersThunk(dispatch: AppDispatch) {
    try {
      const response = await APIWITHTOKEN.delete("/users/" + id);

      if (response.status === 200) {
        dispatch(fetchUsers());
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      console.log(error);
    }
  };
}