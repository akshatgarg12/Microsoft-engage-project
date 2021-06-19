import { useReducer } from 'react'
import {createContext} from 'react'

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
    const [user, dispatch] = useReducer<any>(AuthReducer, initialState)
    return (
        <AuthContext.Provider value={{
            user, dispatch
        }}>
            {children}
        </AuthContext.Provider>
    );
}
 
export default AuthContextProvider;