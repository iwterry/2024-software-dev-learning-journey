import { AxiosError, CanceledError } from "axios";
import { useEffect, useState } from "react";
import apiClient from "../services/api-client";

interface FetchDataResponse<T> {
  count: number;
  results: T[]
}

export default function useData<T>(path: string, queryParams?: {[key: string]: string}, dependencies?: any[]) {
  const [ data, setData ] = useState<T[]>([]);
  const [ error, setError ] = useState('');
  
  useEffect(() => {
    const abortController =  new AbortController();
    apiClient.get<FetchDataResponse<T>>(path, { signal: abortController.signal, params: queryParams })
      .then((res) => {
        setData(res.data.results);
      })
      .catch((err: AxiosError) => !(err instanceof CanceledError) && setError(err.message));
      
      return () => abortController.abort();
  }, dependencies ? [ ...dependencies ] : []);

  return {
    data,
    error
  };
}
