//@ts-nocheck
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import globalSlice, {
  getGlobalSliceStorageState,
  globalInitialState,
  stateType,
} from "./storeSliceConfig";
import { logoutAction, refreshAction } from "./storeActionConfig";
import { CoreApi } from "./storeQueryconfig";
import formSliceConfig from "./formSliceConfig";
import { throttle } from "@/utils/function-utils";
import { deepMerge, isObjectEmpty } from "@/utils/object-utils";
import { APP_SESSION } from "@/constants/global";
import { StoreQueryTagEnum } from "@/constants/store-constants";

const store = configureStore({
  reducer: {
    [CoreApi.reducerPath]: CoreApi.reducer,
    [globalSlice.name]: globalSlice.reducer,
    form: formSliceConfig,
  },
  preloadedState: loadState({
    [globalSlice.name]: globalInitialState,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      CoreApi.middleware,
      rtkqOnResetMiddleware(CoreApi)
    ),
});

setupListeners(store.dispatch);

store.subscribe(
  throttle(() => {
    const state = store.getState();
    saveState({
      [globalSlice.name]: getGlobalSliceStorageState(state[globalSlice.name]),
    });
  }, 1000)
);

export default store;

function saveState(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("@state", serializedState);
  } catch (error) {}
}

function loadState(initialState = {}) {
  try {
    const newState = Object.assign({}, initialState);
    const storageState = getLocalStorageState();
    if (storageState && !isObjectEmpty(storageState)) {
      Object.assign(newState, deepMerge(newState, storageState));
    }
    return newState;
  } catch (error) {}
  return undefined;
}

function getLocalStorageState() {
  const serializedState = localStorage.getItem("@state");
  if (serializedState) {
    return JSON.parse(serializedState);
  }
  return null;
}

export function rtkqOnResetMiddleware(...apis) {
  return (store) => (next) => (action) => {
    const result = next(action);
    if (logoutAction.match(action)) {
      for (const api of apis) {
        store.dispatch(api.util.resetApiState());
      }
      localStorage.clear();
      window?.postMessage?.(
        { type: "LOGOUT", appSession: APP_SESSION },
        window.location.origin
      );
    }

    if (refreshAction.match(action)) {
      for (const api of apis) {
        store.dispatch(
          api.util.invalidateTags(Object.values(StoreQueryTagEnum))
        );
      }
    }
    return result;
  };
}
