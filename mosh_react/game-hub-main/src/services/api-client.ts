import axios, { AxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: "https://api.rawg.io/api",
  params: {
    key: <please-insert-your-own-rawg-api-key-here>,
  },
});

// export default apiClient;

export interface FetchResponse<T> {
  count: number;
  results: T[];
  next: string | null;
  previous: string | null;
}

class ApiService<T> {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  getAll(config?: AxiosRequestConfig) {
    return apiClient.get<FetchResponse<T>>(this.path, config)
      .then((res) => res.data);
  }

  getOne() {
    return apiClient.get<T>(this.path)
      .then((res) => res.data);
  }
}

const createApiService = <T>(path: string) => new ApiService<T>(path);
export default createApiService;

