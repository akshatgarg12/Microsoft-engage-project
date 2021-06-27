import { useEffect } from "react";
import socket from '../../config/socket'
import { useToasts } from 'react-toast-notifications'

export interface NotificationListenerProps {
    
}
 

const NotificationListener = ({children}:any):JSX.Element => {
    const {addToast} = useToasts()

    useEffect(()=>{
        socket.on('notification', (info) => {
            addToast(info,{apperance : 'success'})
            console.log('Notification : ', info)
        })
    }, [addToast])

    return (
        <>
            {children}
        </>
    );
}
 
export default NotificationListener;