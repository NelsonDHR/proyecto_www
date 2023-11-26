import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL_LOCAL + "/splitcount/api/activities/";
// const url = import.meta.env.VITE_BACKEND_URL_PROD + "/splitcount/api/activities/";

const getConfig = () => ({
  headers: {
    Authorization: `token ${localStorage.getItem("token")}`,
  },
});

export const getAllActivities = (id_event) => {
  return axios.get(url, {...getConfig(),
  params: {event_id: id_event}});
};

export const getActivity = (id_activity) => {
  return axios.get(`${url}${id_activity}/`, getConfig());
};

export const createActivity = (activity) => {
  return axios.post(url, activity, getConfig());
};

export const putActivity = (id_activity, activityData) => {
  const urlId = `${url}${id_activity}/`;
  return axios.put(urlId, activityData, getConfig());
};

export const inactivateActivity = (id_activity) => {
  const urlId = `${url}${id_activity}/`;
  return axios.delete(urlId, getConfig());
};