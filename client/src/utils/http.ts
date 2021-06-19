import { SERVER_URL, API_PATH } from "../constants"
import { useHttpsProps } from "../hooks/useHttp";

export const callAPI = async ({path, method, body, headers}:useHttpsProps) => {
    const url = SERVER_URL + API_PATH + path
    try{
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
            return response
        }else{
            throw new Error(response?.log || 'some error occured, try again later!')
        }
    }catch(e){
        console.error(e)
        throw e
    }   
}



export const CallAPIReducer = (state:any, action:any) => {
    switch(action.type){
        case 'LOADING':
            return {loading : true, response:null, error: null}
        case 'ERROR':
            return {loading:false, response:null, error:action.payload}
        case 'RESPONSE':
            return {loading:false, response:action.payload, error:null}
        default:
            return state
    }
}