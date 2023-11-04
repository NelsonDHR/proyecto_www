import axios from "axios";

// const url = "http://localhost:8000/splitcount/api/activities/";
const url = import.meta.env.BACKEND_URL + "/splitcount/api/activities/";

const getConfig = () => ({
  headers: {
    Authorization: `token ${localStorage.getItem("token")}`,
  },
});

export const getAllActivities = () => {
  return axios.get(url, getConfig());
};

export const createActivity = (activity) => {
  return axios.post(url, activity, getConfig());
};

export const putActivity = (id_activity, activity) => {
  const urlId = `${url}${id_activity}/`;
  return axios.put(urlId, activity, getConfig());
};