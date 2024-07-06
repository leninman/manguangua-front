/* eslint-disable  */
import axios  from "axios";
import { useAuthStore } from "@/services/auth";

export const axiosObject = () => {
  const auth = useAuthStore();
  return axios.create({
    baseURL: "https://api-manguangua-dev.premierpluss.com/api/client",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${auth.getToken()}`,
    },
  });
};
