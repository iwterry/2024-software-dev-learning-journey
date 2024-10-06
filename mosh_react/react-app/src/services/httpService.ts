import apiClient from './apiClient';

interface Entity {
  id: number; 
}

class HttpService<T extends Entity> {
  relativePath: string;

  constructor(relativePath: string) {
    this.relativePath = relativePath;
  }

  getAll() {
    const controller = new AbortController();

    return {
      request: apiClient.get<T[]>(this.relativePath, { signal: controller.signal }),
      cancelRequest: () => controller.abort()
    };
  }

  delete(id: number) {
    return apiClient.delete(`${this.relativePath}/${id}`);
  }

  create(data: T) {
    return apiClient.post<T>(this.relativePath, data);
  }

  update(data: T) {
    return apiClient.patch<T>(`${this.relativePath}/${data.id}`, data );
  }
}