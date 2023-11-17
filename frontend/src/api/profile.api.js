import axios from "axios";

// const url = import.meta.env.VITE_BACKEND_URL_LOCAL + "/splitcount/user/";
const url = import.meta.env.VITE_BACKEND_URL_PROD + "/splitcount/user/";

const getConfig = () => ({
  headers: {
    Authorization: `token ${localStorage.getItem("token")}`,
  },
});

export const getUser = () => {
  return axios.get(url, getConfig());
};

export const updateUser = (user) => {
  return axios.put(url, user, getConfig());
};

export const deleteUser = () => {
  return axios.put(url, { is_active: false }, getConfig());
};