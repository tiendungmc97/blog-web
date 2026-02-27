interface Meta {
  code: ApiStatusCode;
  message: string;
}
export interface PaginatedData<T> {
  totalRecords: number;
  pageNo: number;
  pageSize: number;
  data: T[];
}
export interface ApiPagedParams {
  pageNo?: number;
  pageSize?: number;
}
export interface ApiResponse<T> {
  meta: Meta[];
  data: T;
}

export interface ApiPagedResponse<T> {
  meta: Meta[];
  data: PaginatedData<T>;
}

export interface CustomApiError {
  messages: string[];
  status: number;
  data?: any;
  codes: ApiStatusCode[];
}

export enum ApiStatusCode {
  // --- Standard HTTP-like responses ---
  SUCCESS = 200,
  CREATED = 201,
  ACCEPTED = 202,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  KYC_NOT_COMPLETED = 420,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,


}

export const ApiStatusMessages: Record<ApiStatusCode, string> = {
  [ApiStatusCode.SUCCESS]: "Success",
  [ApiStatusCode.CREATED]: "Created successfully",
  [ApiStatusCode.ACCEPTED]: "Accepted",
  [ApiStatusCode.BAD_REQUEST]: "Bad request",
  [ApiStatusCode.UNAUTHORIZED]: "Unauthorized",
  [ApiStatusCode.PAYMENT_REQUIRED]: "Payment required",
  [ApiStatusCode.FORBIDDEN]: "Forbidden",
  [ApiStatusCode.NOT_FOUND]: "Not found",
  [ApiStatusCode.KYC_NOT_COMPLETED]: "KYC not completed",
  [ApiStatusCode.INTERNAL_SERVER_ERROR]: "Internal server error",
  [ApiStatusCode.BAD_GATEWAY]: "Bad gateway",
  [ApiStatusCode.SERVICE_UNAVAILABLE]: "Service unavailable",
  [ApiStatusCode.GATEWAY_TIMEOUT]: "Gateway timeout",


};
