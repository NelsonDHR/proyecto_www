import axios from "axios";

const url = "http://127.0.0.1:8000/splitcount/api/activities/";

const config = {
  headers: {
    Authorization: `token ${localStorage.getItem("token")}`,
  },
};

export const getAllActivities = () => {
  return axios.get(url, config);
};

export const createActivity = (activity) => {
  return axios.post(url, activity, config);
};

export const putActivity = (id_activity, activity) => {
  const urlId = `http://127.0.0.1:8000/splitcount/api/activities/${id_activity}/`;
  return axios.put(
    urlId,
    activity,
    config
  );
};
