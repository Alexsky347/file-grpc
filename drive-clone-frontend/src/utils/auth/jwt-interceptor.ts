import axios from "axios";
 
const jwtInterceptor = axios.create({});
 
jwtInterceptor.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      await axios
        .get("http://localhost:4000/refresh-token", {
          withCredentials: true,
        })
        .catch((error_) => {
          throw error_;
        });
      console.log(error.config);
      return axios(error.config);
    } else {
      throw error;
    }
  }
);
export default jwtInterceptor;