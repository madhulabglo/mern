import {BrowserRouter as  Router, Routes,Route } from 'react-router-dom';
import LoginScreen from './screens/loginscreen';
import ShowEmployees from './screens/showemployee';


function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
          <Route exact path="/" element={<LoginScreen/>}/>
            <Route exact path="/employee" element={<ShowEmployees/>}/>
          </Routes>
        </Router>
    </div>
  );
}

export default App;
