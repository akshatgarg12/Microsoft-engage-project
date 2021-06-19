import { useEffect, useState } from "react";
import { SERVER_URL, API_PATH } from "../constants";

export interface useHttpsProps {
    path:string,
    method:'GET' | 'POST' | 'DELETE' | 'PATCH',
    body ?: any,
    headers ?: object
}
 
const useHttps = ({path, method, body, headers}:useHttpsProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [response, setResponse] = useState<any>(null)
    const [error, setError] = useState<any>(null)
    useEffect(()=>{
        const request = async () => {
            const url = SERVER_URL + API_PATH + path
            try{
                console.log("initiating request: " , {path, method, body})
                setLoading(true)
                const call = await fetch(url , {
                    method,
                    body : JSON.stringify(body) || undefined,
                    headers:{
                        'Content-type':'application/json',
                        ...headers
                    },
                    credentials: 'include'
                });
                const response = await call.json()
                if(call.status === 200){
                    setResponse(response)
                    setError(null)
                }else{
                    setResponse(null)
                    setError(response?.log || 'some error occured, try again later!')
                }
            }catch(e){
                console.error(e)
                setError(e.message)
            }finally{
                setLoading(false)
            }   
        }
        request()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return {loading, response, error}
}
 
export default useHttps;