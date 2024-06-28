import axios from "axios";
const axiosBase = axios.create({
  baseURL: 'http://localhost:52896/api'
  // baseURL: "https://evangadiforumbackend-1-921z.onrender.com/api",
});
export default axiosBase;
