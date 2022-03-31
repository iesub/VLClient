import $ from "jquery";
import './css/App.css';
import Header from "./component/Header"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./component/Home";
import Login from "./component/Login";
import Registration from "./component/Registration"
import BookCreation from "./component/BookCreation";


const App = () => (
  <BrowserRouter>
  <Header></Header>
    <Routes>
      <Route path = '/' element = {<Home/>}/>
      <Route path = '/login' element = {<Login/>}/>
      <Route path = '/registration' element = {<Registration/>}/>
      <Route path = '/addBook' element = {<BookCreation/>}/>
    </Routes>
  </BrowserRouter>
)

export default App;
