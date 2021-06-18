import { useReducer, useState } from 'react'
import {createContext} from 'react'
import useHttps from '../hooks/useHttp'

export const AuthContext = createContext<any>(null)

export enum AuthReducerActionType{
    LOGIN = 'LOGIN',
    CURRENT = 'CURRENT',
    LOGOUT = 'LOGOUT'
}

const AuthReducer = (state:any ,action:any) => {
    switch(action.type){
        case AuthReducerActionType.LOGIN:
            localStorage.setItem('user', JSON.stringify(action.payload))
            return action.payload
        case AuthReducerActionType.CURRENT:
            let ls = localStorage.getItem('user')
            if(!ls) {
                return null
            }
            return JSON.parse(ls)
        case AuthReducerActionType.LOGOUT:
            localStorage.removeItem('user')
            return null
        default:
            return state
    }
}
const AuthContextProvider = ({children}:any) => {
    const u = localStorage.getItem('user')
    const initialState =  u ? JSON.parse(u) : null 
    const [trigger, setTrigger] = useState<boolean>(true)
    const {response, loading, error} = useHttps({
        path : '/user',
        method : 'GET',
        trigger,
        setTrigger
    })
    const [user, dispatch] = useReducer<any>(AuthReducer, initialState)
    if(!loading && response){
        localStorage.setItem('user', JSON.stringify(response.user))
    }
    if(error){
        localStorage.removeItem('user')
    }
    return (
        <AuthContext.Provider value={{
            user, dispatch
        }}>
            {children}
        </AuthContext.Provider>
    );
}
 
export default AuthContextProvider;