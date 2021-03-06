import { Flex, Loader } from '@fluentui/react-northstar'

export interface LoadingScreenProps {

}

const LoadingScreen = (): JSX.Element => {
  return (
    <Flex style={{ minHeight: '90vh', width:'100%' }} vAlign='center' hAlign='center'>
      <Loader />
    </Flex>
  )
}

export default LoadingScreen
