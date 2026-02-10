import axios from 'axios';

export const getErrorMsg = (error: any): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Request failed";
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return "An unexpected error occurred";
};

export const getValidationError = (error: any): string | null => {
  if (axios.isAxiosError(error)) {
    const errorData = error.response?.data;
    if (errorData?.errors && Array.isArray(errorData.errors)) {
      return errorData.errors.map((e: any) => e.message).join(", ");
    }
  }
  return null;
};
