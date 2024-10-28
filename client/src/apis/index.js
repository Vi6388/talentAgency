import axios from "axios";

const SERVER_URL = process.env.REACT_APP_API_BACKEND_URL;

const jwtInterceoptor = axios.create({});

jwtInterceoptor.interceptors.request.use((config) => {
  let tokensData = JSON.parse(localStorage.getItem("tokens"));
  config.headers.common["Authorization"] = `bearer ${tokensData.access_token}`;
  return config;
});

jwtInterceoptor.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      const authData = JSON.parse(localStorage.getItem("tokens"));
      const payload = {
        access_token: authData.access_token,
        refresh_token: authData.refreshToken,
      };

      let apiResponse = await axios.post(
        `${SERVER_URL}/api/auth/refreshtoken`,
        payload
      );
      localStorage.setItem("tokens", JSON.stringify(apiResponse.data));
      error.config.headers[
        "Authorization"
      ] = `bearer ${apiResponse.data.access_token}`;
      return axios(error.config);
    } else {
      return Promise.reject(error);
    }
  }
);

const login = (data) => axios.post(`${SERVER_URL}/api/auth/login`, data);

export const api = {
  login,
};
