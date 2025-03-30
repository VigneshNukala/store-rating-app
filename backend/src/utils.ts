/// Standard API response wrapper
///
/// This type ensures all API responses follow a consistent format:
/// - `status`: Indicates success or failure (`"success"` | `"error"`)
/// - `result`: Holds the actual response data when successful
/// - `error`: Contains error details when the request fails
///
/// # Usage Examples:
///
/// ```typescript
/// const successResponse = success({ userId: 1, name: "Alice" });
/// const errorResponse = error("Something went wrong");
/// ```

export type ApiResponse<T> = {
  status: "success" | "error";
  data?: T;
  error?: string;
};

export function success<T>(data: T): ApiResponse<any> {
  return { status: "success", data };
}

export function error(message: string): ApiResponse<string> {
  return { status: "error", error: message };
}
