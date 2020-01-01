import axios from 'axios';

const host = window.location.hostname === 'localhost' ? 'localhost:3001' : window.location.host;

const backend = axios.create({ baseURL: `http://${host}` });

export default backend;
