import axios from "axios";

export const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444';

export const httpClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});