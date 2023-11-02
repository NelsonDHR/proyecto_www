import axios from 'axios'

const config = {
    headers: {
      'Authorization': `token ${localStorage.getItem('token')}`
    }
  }

export const getAllActivities = () =>{
    return axios.get('http://127.0.0.1:8000/splitcount/api/activities/', config)
}

export const createActivity = (activity) =>{
    return axios.post('http://127.0.0.1:8000/splitcount/api/activities/',activity, config)
}

export const putActivity = (id_activity, activity) =>{
    return axios.put(`http://127.0.0.1:8000/splitcount/api/activities/${id_activity}/`, activity, config)
}

