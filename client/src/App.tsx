import {Switch, BrowserRouter as Router, Route} from 'react-router-dom'
import Footer from './components/Templates/Footer';
import AuthPage from './Pages/AuthPage';
import MeetingPage from './Pages/Meeting';


const App = ():JSX.Element  => {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path = '/auth' component={AuthPage} />
          <Route path = '/meeting' component={MeetingPage} />
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
