import { useState } from 'react'
import { Flex, Image, Menu } from '@fluentui/react-northstar'
import LoginForm from '../components/AuthForms/LoginForm'
import RegisterForm from '../components/AuthForms/RegisterForm'

export interface AuthPageProps {

}

const items: Array<{key: string, content: string}> = [
  {
    key: 'login',
    content: 'Login'
  },
  {
    key: 'register',
    content: 'Register'
  }
]

const AuthPage = (): JSX.Element => {
  const imageSrc = 'https://image.flaticon.com/icons/png/512/906/906349.png'
  const [activeIndex, setActiveIndex] = useState<number>(0)
  return (
    <Flex style={{ minHeight: '90vh' }} wrap gap='gap.smaller' space='between'>
      <Image
        style={{
          height: '12rem',
          width: '12rem',
          margin: 'auto'
        }}
        circular
        src={imageSrc}
      />
      <Flex
        column
        gap='gap.medium'
        hAlign='center'
        vAlign='center'
        style={{
          margin: 'auto'
        }}
      >
        <Menu
          defaultActiveIndex={activeIndex}
          onActiveIndexChange={(e, data) => setActiveIndex(Number(data?.activeIndex) || 0)}
          items={items}
          underlined primary
        />
        {
          activeIndex === 0
            ? <LoginForm />
            : <RegisterForm />
        }

      </Flex>
    </Flex>
  )
}

export default AuthPage
