import {Switch, BrowserRouter as Router, Route} from 'react-router-dom'
import AuthPage from './Pages/AuthPage';


const App = ():JSX.Element  => {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path = '/auth' component={AuthPage} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
