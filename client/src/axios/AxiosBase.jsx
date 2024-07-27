import axios from "axios";
const axiosBase = axios.create({
  // baseURL: "http://localhost:52896/api",
  baseURL: "https://evangadiforumproject-qtes.onrender.com/",
  // baseURL: "https://evangadiforumproject-nmdr.onrender.com",
  // baseURL: "https://evangadiforumbackend-8vl4.onrender.com/api",
  // baseURL:"https://evangadiforumbackend-1-zkgl.onrender.com/api"
});
export default axiosBase;
