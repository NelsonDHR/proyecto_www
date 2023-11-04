import axios from "axios";

// const url = "http://localhost:8000/splitcount/api/event/";
const url = import.meta.env.BACKEND_URL + "/splitcount/api/event/";

const getConfig = () => ({
  headers: {
    Authorization: `token ${localStorage.getItem("token")}`,
  },
});

export const getAllEvents = () => {
  return axios.get(url, getConfig());
};

export const createEvent = (event) => {
  console.log(config);
  return axios.post(url, event, getConfig());
};

export const putEvent = (id_event, event) => {
  const urlId = `${url}${id_event}/`;
  return axios.put(urlId, event, getConfig());
};
