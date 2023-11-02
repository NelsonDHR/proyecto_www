import axios from 'axios';

const config = {
  headers: {
    'Authorization': `token ${localStorage.getItem('token')}`
  }
}

export const getAllEvents = () => {
  return axios.get('http://127.0.0.1:8000/splitcount/api/event/', config);
}

export const createEvent = (event) => {
  console.log(config)
  return axios.post('http://127.0.0.1:8000/splitcount/api/event/', event, config);
}

export const putEvent = (id_event, event) => {
  return axios.put(`http://127.0.0.1:8000/splitcount/api/event/${id_event}/`, event, config);
}
