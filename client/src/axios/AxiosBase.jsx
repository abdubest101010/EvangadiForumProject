import axios from "axios"
const axiosBase = axios.create({
    baseURL: 'http://localhost:52896/api',
    
  });
  export default axiosBase