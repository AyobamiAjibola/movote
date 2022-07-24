import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/';

export const useAxios = (axiosParams: any) => {
    const [response, setResponse] = useState<any>(undefined);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchData = async (params: AxiosRequestConfig<any>) => {
      try {
       const result = await axios.request(params);

       if(result.statusText !== "OK"){
           setError("Could not fetch the data")
       }
       setResponse(result.data);
       } catch( error: any ) {
         error && setError("Server error, Please try again");
       } finally {
         setLoading(false);
       }
    };

    useEffect(() => {
        fetchData(axiosParams);
    }, []);

    return { response, error, loading };
};