import { Route, useHistory } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
 
const ProtectedRoute = ({component, path, ...rest}:any) : JSX.Element | null => {
    const {user} = useAuth()
    const history = useHistory()
    if(!user){
        alert('Login to get access to this page!')
        history.replace('/auth')
        return null
    }
    return (
        <Route component={component} path = {path} {...rest} />
    );
}
 
export default ProtectedRoute;