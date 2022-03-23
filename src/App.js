import $ from "jquery";
import './css/App.css';
import Header from "./component/Header"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./component/Home";
import Login from "./component/Login";
import Registration from "./component/Registration"

const App = () => (
  <BrowserRouter>
  <Header></Header>
    <Routes>
      <Route path = '/' element = {<Home/>}/>
      <Route path = '/login' element = {<Login/>}/>
      <Route path = '/registration' element = {<Registration/>}/>
    </Routes>
  </BrowserRouter>
)

export default App;
