import {Switch, BrowserRouter as Router, Route} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute';
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
            <Route  path = '/auth' component={AuthPage} />
            <ProtectedRoute path = '/' component={Dashboard} exact = {true} />
            <ProtectedRoute path = '/meeting' component={MeetingPage} />
            <ProtectedRoute path = '/team/:id' component={TeamPage} />
          </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
