import { ArrowLeftIcon, Avatar, Button, Flex, Text } from '@fluentui/react-northstar'
import { AcceptIcon } from '@fluentui/react-icons-northstar'
import classes from './style.module.css'
import { useHistory } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { useReducer } from 'react'
import { callAPI, CallAPIReducer } from '../../../utils/http'
import { AuthReducerActionType } from '../../../context/Auth'

const Navbar = (): JSX.Element => {
  const history = useHistory()
  const { user } = useAuth()
  const redirectToDashboard = () => history.push('/')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [httpState, httpDispatch] = useReducer(CallAPIReducer, {
    error: null,
    response: null,
    loading: false
  })
  const { dispatch } = useAuth()
  const {loading} = httpState
  const onLogoutHandler = async (e: any) => {
    e.preventDefault()
    httpDispatch({ type: 'LOADING' })
    try {
      const r = await callAPI({
        path: '/logout',
        method: 'POST'
      })
      httpDispatch({ type: 'RESPONSE', payload: r })
      dispatch({ type: AuthReducerActionType.LOGOUT })
      return null
    } catch (e) {
      httpDispatch({ type: 'ERROR', payload: e.message })
    }
  }
  return (
    <Flex space='between' style={{ background: '#3a3942', color: 'white', minHeight: '3rem' }}>
      <Text onClick={redirectToDashboard} content='Microsoft engage' className={`${classes.center} ${classes.logo}`} />
      {
        user &&
          <Flex gap='gap.small' vAlign='center' hAlign='center'>
            <h4>{user.name.toUpperCase()}</h4>
            <Avatar
              className={classes.center}
              name={user.name.toUpperCase()}
              status={{
                color: 'green',
                icon: <AcceptIcon />,
                title: 'Available'
              }}
            />
            <Button content='logout' loading={loading} onClick={onLogoutHandler} icon={<ArrowLeftIcon />} text style={{ color: 'white' }} />
          </Flex>
      }
    </Flex>
  )
}

export default Navbar
