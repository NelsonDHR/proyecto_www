import axios from "axios";

// const url = import.meta.env.VITE_BACKEND_URL_LOCAL + "/splitcount/payment/";
const url = import.meta.env.VITE_BACKEND_URL_PROD + "/splitcount/payment/";

const getConfig = () => ({
    headers: {
      Authorization: `token ${localStorage.getItem("token")}`,
    },
  });

export const pay = (paymentInfo) => {
    return axios.post(url, paymentInfo, getConfig());
  };