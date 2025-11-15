import { client } from "../lib/axios";

export const { delete: DELETE, get: GET, patch: PATCH, post: POST, put: PUT } = client;
