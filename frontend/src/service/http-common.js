import axios from "axios";

export default axios.create({
  baseURL: process.env.BACKEND_URL || 'http://ledainalexis.com:8080/api'
});