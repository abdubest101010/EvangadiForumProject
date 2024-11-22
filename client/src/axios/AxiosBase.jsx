import axios from "axios";

const axiosBase = axios.create({
  baseURL: "https://evangadiforumproject-3.onrender.com/api", // Default value, replace dynamically later if needed
});

export default axiosBase;
export const baseURL = axiosBase.defaults.baseURL;
