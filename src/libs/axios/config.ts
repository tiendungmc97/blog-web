import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ApiStatusCode } from "./types";
// Base API configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
} as const;

export const apiClient: AxiosInstance = axios.create(API_CONFIG);

// Request interceptor for adding auth tokens, logging, etc.
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = "your_access_token_here"; // Replace with actual token retrieval logic
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (process.env.NEXT_PUBLIC_APP_ENV === "development") {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }
    return config;
  },
  (error: any) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for handling responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NEXT_PUBLIC_APP_ENV === "development") {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    if (error?.response?.status === ApiStatusCode.UNAUTHORIZED) {
      window.location.href = "/login";
    }
    const apiError = await formatApiError(error);
    // Log error in development
    if (process.env.NEXT_PUBLIC_APP_ENV === "development") {
      console.log(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        ...apiError,
      });
    }
    return Promise.reject(apiError);
  },
);

async function formatApiError(error: AxiosError) {
  const status = error.response?.status || 400;
  const data = error.response?.data as any;
  let messages: string[] = [];
  let codes: ApiStatusCode[] = [];

  const url = typeof window !== "undefined" ? window.location.pathname : "";
  const languageMatch = url.match(/\/([a-z]{2})(?:\/|$)/i);
  const language = languageMatch ? languageMatch[1] : "en";
  const messagesTranslate = await import(`../../../messages/${language}.json`);

  if (data?.meta?.length) {
    messages = data.meta.map((item: any) => {
      return messagesTranslate?.ApiErrors[item.code as ApiStatusCode] ?? item.code;
    });
    codes = data.meta.map((item: any) => item.code);
  }

  if (data?.meta?.code) {
    messages.push(messagesTranslate?.ApiErrors[data.meta.code as ApiStatusCode] ?? data.meta.code);
    codes.push(data.meta.code);
  }

  return {
    messages: messages,
    codes,
    status,
    data,
  };
}

// Create specialized API clients for different services
export const createServiceClient = (baseURL?: string, config?: AxiosRequestConfig): AxiosInstance => {
  return axios.create({
    ...API_CONFIG,
    ...config,
    baseURL: baseURL || API_CONFIG.baseURL,
  });
};

// Export configured clients for different services
export const userApiClient = createServiceClient();
export const postApiClient = createServiceClient();
export const commentApiClient = createServiceClient();
export const analyticsApiClient = createServiceClient(process.env.NEXT_PUBLIC_ANALYTICS_API_URL);
