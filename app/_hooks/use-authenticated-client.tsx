"use client";

import { client } from "@/lib/axios";
import { useAuth } from "@clerk/nextjs";

export default function useAuthenticatedClient() {
  const { getToken } = useAuth();

  client.interceptors.request.use(async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  return client;
}
