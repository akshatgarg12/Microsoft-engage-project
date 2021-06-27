export const __prod__ = process.env.NODE_ENV === 'production'
const PROD_URL = 'https://microsoft-engage.herokuapp.com'
const DEV_URL = 'http://localhost:8080'
export const SERVER_URL = __prod__ ? PROD_URL : DEV_URL;
export const SOCKET_PATH = '/sockets'
export const API_PATH = '/api'
