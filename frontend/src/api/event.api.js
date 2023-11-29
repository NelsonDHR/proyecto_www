import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL_LOCAL + "/splitcount/api/event/";
// const url = import.meta.env.VITE_BACKEND_URL_PROD + "/splitcount/api/event/";

const getConfig = () => ({
  headers: {
    Authorization: `token ${localStorage.getItem("token")}`,
  },
});

export const getAllEvents = () => {
  return axios.get(url, getConfig());
};

export const createEvent = (event) => {
  return axios.post(url, event, getConfig());
};

export const putEvent = (id_event, event) => {
  const urlId = `${url}${id_event}/`;
  return axios.put(urlId, event, getConfig());
};

export const inactivateEvent = (id_event) => {
  const urlId = `${url}${id_event}/`;
  return axios.delete(urlId, getConfig());
}

export const getEventParticipants = (id_event) => {
  const urlId = `${url}${id_event}/participants/`;
  return axios.get(urlId, getConfig());
};

export const getBalances = (id_event) => {
  const urlId = `${url}${id_event}/balances/`;
  return axios.get(urlId, getConfig());
};
