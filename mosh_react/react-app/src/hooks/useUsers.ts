import { useEffect, useState } from "react";
import userService, { User } from "../services/userService";
import { AxiosError, CanceledError } from '../services/apiClient';

const useUsers = () => {
  const [ users, setUsers ] = useState<User[]>([]);
  const [ error, setError ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);
  

  useEffect(() => {
    setIsLoading(true);

    const { request, cancelRequest } = userService.getAllUsers();

    request
      .then((res) => setUsers(res.data))
      .catch((axiosError: AxiosError) => axiosError instanceof CanceledError ? null : setError(axiosError.message))
      .finally(() => setIsLoading(false));

    return cancelRequest;

  }, []);

  return {
    users,
    error,
    isLoading,
    setUsers,
    setError,
    setIsLoading
  }
};

export default useUsers;