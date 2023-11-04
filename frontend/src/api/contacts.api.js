import axios from 'axios'

// const url = "http://localhost:8000/splitcount/contacts/";
const url = import.meta.env.BACKEND_URL + "/splitcount/contacts/";

const getConfig = () => ({
  headers: {
    Authorization: `token ${localStorage.getItem("token")}`,
  },
});

export const getAllContacts = () =>{
    return axios.get(url, getConfig())
}

export const addContact = (contact) =>{
    return axios.post(url, contact, getConfig())
}

export const deleteContact = (contact) => {
  return axios.delete(url, { 
    data: contact,
    headers: getConfig().headers,
  });
}