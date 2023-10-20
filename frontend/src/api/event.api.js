import axios from 'axios'

export const getAllEvents = () =>{
    return axios.get('http://127.0.0.1:8000/splitcount/api/event/')
}

export const createEvent = (event) =>{
    return axios.post('http://127.0.0.1:8000/splitcount/api/event/',event)
}