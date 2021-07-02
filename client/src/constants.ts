export const __prod__ = process.env.NODE_ENV === 'production'
const PROD_URL = 'https://microsoft-engage.herokuapp.com'
const DEV_URL = 'http://localhost:8080'
export const SERVER_URL = __prod__ ? PROD_URL : DEV_URL
export const SOCKET_PATH = '/sockets'
export const API_PATH = '/api'


export const validateEmail = (email:string) =>  {
    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}