import { CoreApi } from "@/config/storeQueryconfig";

export const BASE_URL = "/authentication";

export const AuthenticationApi = CoreApi.injectEndpoints({
  endpoints: (builder) => ({
    requestTwoFactor: builder.mutation({
      query: (config) => ({
        url: `${BASE_URL}/login-email`,
        method: "POST",
        ...config,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (config) => ({
        url: `${BASE_URL}/verify-otp`,
        method: "POST",
        ...config,
      }),
    }),
    resendOtp: builder.mutation({
      query: (config) => ({
        url: `${BASE_URL}/resend-otp`,
        method: "POST",
        ...config,
      }),
    }),
  }),
});

export default AuthenticationApi;
