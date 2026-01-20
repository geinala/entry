import env from "@/common/config/environtment";
import axios from "axios";

export const client = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
