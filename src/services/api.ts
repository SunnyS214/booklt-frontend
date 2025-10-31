import axios from "axios";

const api = axios.create({
baseURL: "https://booklt-server.onrender.com/api", 
});

export default api;
