import axios from 'axios';

/* baseURL: 'https://my-requests-backend.herokuapp.com/' */
/*  baseURL: process.env.REACT_APP_API_URL  */
const api = axios.create({
    baseURL: 'http://localhost:3333',
});

export default api;
