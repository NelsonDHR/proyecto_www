import axios from 'axios'

export const getAllActivities = () =>{
    return axios.get('http://127.0.0.1:8000/splitcount/api/activities/')
}

export const createActivity = (activity) =>{
    return axios.post('http://127.0.0.1:8000/splitcount/api/activities/',activity)
}

export const putActivity = (id_activity, activity) =>{
    return axios.put(`http://127.0.0.1:8000/splitcount/api/activities/${id_activity}/`, activity)
}

