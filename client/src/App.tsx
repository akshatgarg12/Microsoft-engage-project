import {Switch, BrowserRouter as Router, Route} from 'react-router-dom'
import Footer from './components/Templates/Footer';
import Navbar from './components/Templates/Navbar';
import AuthPage from './Pages/AuthPage';
import Dashboard from './Pages/Dashboard';
import MeetingPage from './Pages/Meeting';
import TeamPage from './Pages/TeamPage';


const App = ():JSX.Element  => {
  return (
    <>
      <Router>
        <Navbar />
          <Switch>
            <Route exact path = '/' component={Dashboard} />
            <Route  path = '/auth' component={AuthPage} />
            <Route path = '/meeting' component={MeetingPage} />
            <Route path = '/team/:id' component={TeamPage} />
          </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
