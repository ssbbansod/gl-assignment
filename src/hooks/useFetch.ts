import { useState,useEffect } from "react";

const useFetch = (url:string) => {
    const [data,setData] = useState<any|null>([-75,80]);
    // const [loading,setLoading] = useState<boolean>(false);
    // const [error,setError] = useState<unknown>("");

    useEffect(()=>{
        // setLoading(true)
        const fetchData = async (url:string) => {
            let data: any | null = null;
            try {
                const response = await fetch(url);
                data = await response.json();
                setData(data);
            } catch (error:unknown) {
                // setError(error)
            }
            // finally{
            //     setLoading(false)
            // }
            
        }
        fetchData(url);
    },[url])

    return [data];
}

export default useFetch;
