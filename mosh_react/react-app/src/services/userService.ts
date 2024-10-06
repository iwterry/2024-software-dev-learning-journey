import apiClient from './apiClient';

export interface User {
  id: number;
  name: string;
}

class UserService {

  getAllUsers() {
    const controller = new AbortController();

    return {
      request: apiClient.get<User[]>('users/', { signal: controller.signal }),
      cancelRequest: () => controller.abort()
    };
  }

  deleteUser(idOfUserToDelete: number) {
    return apiClient.delete(`users/${idOfUserToDelete}`);
  }

  createUser(name: string) {
    return apiClient.post<User>('users/', { name });
  }

  updateUser(idOfUserToUpdate: number, name: string) {
    return apiClient.patch<User>(`users/${idOfUserToUpdate}`, { name });
  }
}

export default new UserService();