// Api/errorHandler.ts
import { toast } from "sonner";

interface ApiErrorResponse {
  message?: string;
  detail?: string | { msg: string }[];
}

export interface IErrorType {
  response?: {
    data?: ApiErrorResponse;
  };
  message?: string;
}

export function handleApiError(error: IErrorType) {
  const data = error?.response?.data;
  const errorMessage =
    data?.message ||
    (Array.isArray(data?.detail)
      ? data.detail.map((err) => err.msg).join(", ")
      : typeof data?.detail === "string"
        ? data.detail
        : undefined) ||
    error?.message ||
    "Something went wrong!";

  toast.error(errorMessage, {
    duration: 3000,
  });
}
