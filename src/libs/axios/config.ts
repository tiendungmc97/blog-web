import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
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
    const accessToken = null; // TODO: replace with real token retrieval (e.g. from cookies)
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
    return response.data;
  },
  async (error: AxiosError) => {
    return Promise.reject(error);
  },
);

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
