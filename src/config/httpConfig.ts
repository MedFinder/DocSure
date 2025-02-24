//@ts-nocheck
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import store from "./storeConfig";
import { RouteEnums } from "../constants/route";
import { baseURL } from "@/constants/global";
type MyHeaders = {
  [key: string]: string;
  "Access-Control-Allow-Origin": string;
  "Access-Control-Allow-Methods": string;
  "Content-Type": string;
  DeviceId: string;
};

export const CoreHttp = axios.create({
  baseURL,
});

CoreHttp.interceptors.request.use((config) => {
  const jwtToken = store.getState().global.authUser.data.token;

  const deviceId = uuidv4();

  function getHeaders() {
    const headers: MyHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, HEAD, PATCH",
      "Content-Type": "application/json",
      DeviceId: `${deviceId}`,
    };

    if (jwtToken) {
      headers["Authorization"] = `Bearer ${jwtToken}`;
    }

    return headers;
  }
  config.headers = getHeaders();
  return config;
});
CoreHttp.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = RouteEnums.HOME;
    }
    return Promise.reject(error);
  }
);
