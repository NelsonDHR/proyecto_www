import axios from "axios";

const url = "http://localhost:8000/splitcount/user/";

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
