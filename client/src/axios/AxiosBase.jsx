import axios from "axios";
const axiosBase = axios.create({
  baseURL: 'http://localhost:52896/api'
  // baseURL: "https://evangadiforumbackend-8vl4.onrender.com/api",
});
export default axiosBase;
