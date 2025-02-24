import { createSlice } from "@reduxjs/toolkit";
import { logoutAction } from "./storeActionConfig";
import AuthenticationApi from "@/api/AuthenticationApi";

export type stateType = {
  name: string;
  authUser: {
    userId: string | null;
    data: {
      authExchangeKey: string | null;
      tokenType: string | null;
      token: string | null;
      firstName: string | null;
      lastName: string | null;
      hasSecurity: boolean | null;
      hasDomain: boolean | null;
    };
  };
};
export const globalInitialState = {
  name: "",
  authUser: {
    userId: null,
    data: {
      authExchangeKey: null,
      tokenType: null,
      token: null,
      firstName: null,
      lastName: null,
      hasSecurity: null,
      hasDomain: null,
    },
  },
};
const slice = createSlice({
  name: "global",
  initialState: globalInitialState,
  reducers: {
    setAuthUserAction: (state: stateType, { payload }) => {
      state.authUser = payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(logoutAction, () => ({
        ...globalInitialState,
        authUser: {
          userId: null,
          data: {
            authExchangeKey: null,
            tokenType: null,
            token: null,
            firstName: null,
            lastName: null,
            hasSecurity: null,
            hasDomain: null,
          },
        },
      }))
      //request for 2 factor id
      .addMatcher(
        AuthenticationApi.endpoints.requestTwoFactor.matchFulfilled,
        (state: stateType, { payload }) => {
          state.authUser.userId = payload?.crowdCargoUserId;
        }
      )
      //take the full result of actual verify step and add to it
      .addMatcher(
        AuthenticationApi.endpoints.verifyOtp.matchFulfilled,
        (state: stateType, { payload }) => {
          state.authUser.data = payload;
        }
      ),
});
export const { setAuthUserAction } = slice.actions;
export default slice;
export function getGlobalSliceStorageState({ authUser }: stateType) {
  return { authUser };
}
