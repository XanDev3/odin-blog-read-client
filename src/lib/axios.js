import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:3001/api/' //for local development, backend is running on port 3001
});