import { appConfig } from "@/config/app";
import axios from "axios";

export const client = axios.create({
  baseURL: appConfig.apiUrl || "http://localhost:3000/api/v1",
});
