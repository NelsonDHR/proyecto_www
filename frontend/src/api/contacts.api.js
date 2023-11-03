import axios from 'axios'

const config = {
    headers: {
      'Authorization': `token ${localStorage.getItem('token')}`
    }
  }

export const getAllContacts = () =>{
    return axios.get('https://splitcount.fly.dev/splitcount/contacts/', config)
}

export const addContact = (contact) =>{
    return axios.post('https://splitcount.fly.dev/splitcount/contacts/', contact, config)
}

export const deleteContact = (contact) => {
  return axios.delete('https://splitcount.fly.dev/splitcount/contacts/', { 
    data: contact,
    headers: config.headers,
  });
}