import axios from "axios";

const apiClient = axios.create({
  baseURL: 'https://api.rawg.io/api/',
  params: {
    key: <please-insert-your-own-rawg-api-key-here>
  }
});

export default apiClient;