import axios from 'axios'

const config = {
    headers: {
      'Authorization': `token ${localStorage.getItem('token')}`
    }
  }

export const getAllContacts = () =>{
    return axios.get('http://127.0.0.1:8000/splitcount/contacts/', config)
}

export const addContact = (contact) =>{
    return axios.post('http://127.0.0.1:8000/splitcount/contacts/', contact, config)
}

export const deleteContact = (contact) => {
  return axios.delete('http://127.0.0.1:8000/splitcount/contacts/', { 
    data: contact,
    headers: config.headers,
  });
}