import axios from "axios";

export const ecommerceApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080',
});
