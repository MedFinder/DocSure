import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import axios, { Axios, AxiosRequestConfig, AxiosStatic } from "axios";
import { CoreHttp } from "./httpConfig";
import { StoreQueryTagEnum } from "@/constants/store-constants";

export const CoreApi = createApi({
  reducerPath: "core",
  baseQuery: axiosBaseQuery(
    { url: "/api" },
    CoreHttp as unknown as AxiosStatic
  ) as BaseQueryFn,
  endpoints: (builder) => ({}),
});

[CoreApi].forEach((api) => {
  api.enhanceEndpoints({ addTagTypes: Object.values(StoreQueryTagEnum) });
});

/**
 *
 * @param {import("axios").AxiosRequestConfig} baseConfig
 */
export function axiosBaseQuery(
  baseConfig: AxiosRequestConfig<any> = {},
  http = axios
) {
  return request;

  /**
   *
   * @param {import("axios").AxiosRequestConfig} config
   */
  async function request(config: any = {}) {
    const url = config.url
      ? (baseConfig.url || "") + config.url
      : baseConfig.url;
    const data = config.body || config.data || baseConfig.data;
    try {
      const response = await http.request({
        ...baseConfig,
        ...config,
        url,
        data,
      });

      return {
        data: response.data,
      };
    } catch (error: any) {
      return {
        error: error.response
          ? {
              friendlyMessage:
                error.response.data?.errors?.[0]?.friendlyMessage ||
                error.response.data?.friendlyMessage,
              message:
                error.response.data?.errors?.[0]?.friendlyMessage ||
                error.response.data?.friendlyMessage,
              status: error.response.status,
              data: error.response.data,
            }
          : {
              friendlyMessage: "Something went wrong",
              data: { friendlyMessage: "Something went wrong" },
            },
        meta: {
          request: error?.response?.request,
          response: error?.response,
        },
      };
    }
  }
}
