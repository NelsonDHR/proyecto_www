import axios from "axios";

// const url = import.meta.env.VITE_BACKEND_URL_LOCAL + "/splitcount/balance/";
const url = import.meta.env.VITE_BACKEND_URL_PROD + "/splitcount/balance/";

const getConfig = () => ({
    headers: {
      Authorization: `token ${localStorage.getItem("token")}`,
    },
  });

export const getBalances = (id_event) => {
    const urlId = `${url}${id_event}/`;
    return axios.get(urlId, getConfig());
  };