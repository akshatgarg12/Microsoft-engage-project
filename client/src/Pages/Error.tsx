import {Flex, Text} from '@fluentui/react-northstar'
export interface ErrorPageProps {
    statusCode : number|string,
    error : string
}
 
const ErrorPage = ({statusCode, error} : ErrorPageProps) : JSX.Element => {
    return (
        <Flex column={true} hAlign="center" vAlign="center" style={{height:'100%', width:'100%', minHeight:'90vh'}}>
            <Text content={statusCode} style={{fontSize:'5rem'}} />
            <Text content={error} style={{fontSize:'3rem'}} />
        </Flex>
    );
}
 
export default ErrorPage;