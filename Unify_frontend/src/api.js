import axios from "axios";

export const API_BASE_URL = "http://127.0.0.1:8000";

const API = axios.create({
  baseURL: API_BASE_URL,
});

export function getApiError(error, fallback = "Something went wrong. Please try again.") {
  if (!error?.response) return "Unable to connect to the server. Please check your connection and try again.";

  const { status, data } = error.response;
  if (status === 401) return data?.detail || "Your session has expired. Please log in again.";
  if (status === 403) return data?.detail || "You do not have permission to perform this action.";
  if (status === 404) return data?.detail || "The requested resource was not found.";
  if (status >= 500) return "Server error. Please try again in a moment.";

  if (typeof data === "string" && data.trim()) return data;
  if (data?.detail) return String(data.detail);

  if (data && typeof data === "object") {
    const messages = [];
    Object.entries(data).forEach(([field, value]) => {
      const values = Array.isArray(value) ? value : [value];
      values.forEach((item) => {
        if (item !== null && item !== undefined && String(item).trim()) {
          const label = field === "non_field_errors" ? "" : `${field.replaceAll("_", " ")}: `;
          messages.push(`${label}${item}`);
        }
      });
    });
    if (messages.length) return messages.join(" | ");
  }

  return fallback;
}

export default API;
