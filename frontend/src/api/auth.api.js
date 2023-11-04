import axios from "axios";

// const url = import.meta.env.VITE_BACKEND_URL_LOCAL + "/splitcount/";
const url = import.meta.env.VITE_BACKEND_URL_PROD + "/splitcount/";

const getConfig = () => ({
  headers: {
    Authorization: `token ${localStorage.getItem("token")}`,
  },
});

export const signUp = (signUpAttempt) => {
  console.log(url)
  return axios.post(`${url}sign-up/`, signUpAttempt);
};

export const logIn = (logInAttempt) => {
  return axios.post(`${url}log-in/`, logInAttempt);
};

export const logOut = () => {
  return axios.get(`${url}log-out/`, getConfig());
};