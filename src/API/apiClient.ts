// Api/apiClient.ts
import { toast } from "sonner";
import axiosInstance from "./axiosInstance";
import { handleApiError, type IErrorType } from "./errorHandler";
interface BaseResponse {
  message?: string;
}

interface RequestOptions {
  suppressErrorToast?: boolean;
  suppressSuccessToast?: boolean;
}

// GET request wrapper with error handling
export async function getAPI<T, R = any>(
  url: string,
  data?: T,
  options?: RequestOptions
): Promise<R | undefined> {
  try {
    const response = await axiosInstance.get<R>(url, { params: data });
    return response.data;
  } catch (error) {
    if (!options?.suppressErrorToast) {
      handleApiError(error as unknown as IErrorType);
    }
    return undefined;
  }
}

// POST request wrapper with error handling
export async function postAPI<T, R = any>(
  url: string,
  data?: T,
  options?: RequestOptions
): Promise<R | undefined> {
  try {
    const response = await axiosInstance.post<R>(url, data);
    const message = (response.data as BaseResponse)?.message;
    if (!options?.suppressSuccessToast && typeof message === "string") toast.success(message);
    return response.data;
  } catch (error) {
    if (!options?.suppressErrorToast) {
      handleApiError(error as unknown as IErrorType);
    }
    return undefined;
  }
}

// PUT request wrapper with error handling
export async function putAPI<T, R = any>(
  url: string,
  data?: T
): Promise<R | undefined> {
  try {
    const response = await axiosInstance.put<R>(url, data);
    const message = (response.data as BaseResponse)?.message;
    toast.success(
      typeof message === "string" ? message : "Updated successfully"
    );
    return response.data;
  } catch (error) {
    handleApiError(error as unknown as IErrorType);
    return undefined;
  }
}

// PATCH request wrapper with error handling
export async function patchAPI<T, R = any>(
  url: string,
  data?: T
): Promise<R | undefined> {
  try {
    const response = await axiosInstance.patch<R>(url, data);
    const message = (response.data as BaseResponse)?.message;
    toast.success(
      typeof message === "string" ? message : "Updated successfully"
    );
    return response.data;
  } catch (error) {
    handleApiError(error as unknown as IErrorType);
    return undefined;
  }
}

// DELETE request wrapper with error handling
export async function deleteAPI<T, R = any>(
  url: string,
  data?: T
): Promise<R | undefined> {
  try {
    const response = await axiosInstance.delete<R>(url, { data });
    const message = (response.data as BaseResponse)?.message;
    toast.success(
      typeof message === "string" ? message : "Deleted successfully"
    );
    return response.data;
  } catch (error) {
    handleApiError(error as unknown as IErrorType);
    return undefined;
  }
}
