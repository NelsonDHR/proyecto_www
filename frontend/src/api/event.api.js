import axios from "axios";

const url = "https://splitcount.fly.dev/splitcount/api/event/";

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
  const urlId = `https://splitcount.fly.dev/splitcount/api/event/${id_event}/`;
  return axios.put(urlId, event, config);
};
