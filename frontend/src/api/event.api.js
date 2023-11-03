import axios from "axios";

const url = "http://127.0.0.1:8000/splitcount/api/event/";

const config = {
  headers: {
    Authorization: `token ${localStorage.getItem("token")}`,
  },
};

export const getAllEvents = () => {
  return axios.get(url, config);
};

export const createEvent = (event) => {
  console.log(config);
  return axios.post(url, event, config);
};

export const putEvent = (id_event, event) => {
  const urlId = `http://127.0.0.1:8000/splitcount/api/event/${id_event}/`;
  return axios.put(urlId, event, config);
};
