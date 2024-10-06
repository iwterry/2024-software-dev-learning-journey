import apiClient from "./apiClient";

class GenericApiService<T> {
  relativePath: string;

  constructor(relativePath: string) {
    this.relativePath = relativePath;
  }

  getData() {
    return apiClient
      .get<T[]>(this.relativePath);
  }

  postData(data: T) {
    return apiClient
      .post<T>(this.relativePath, data);
  }
}

export default <T> (relativePath: string) => new GenericApiService<T>(relativePath);