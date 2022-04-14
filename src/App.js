import $ from "jquery";
import './css/App.css';
import Header from "./component/Header"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./component/Home";
import Login from "./component/Login";
import Registration from "./component/Registration"
import BookCreation from "./component/BookCreation";
import BookRead from "./component/BookRead";
import ShelfList from "./component/ShelfList";
import ShelfBooks from "./component/ShelfBooks";
import { connect } from "react-redux";


const App = (props) => {
  
  var routes = []

  if (props.user.checked){
    routes.push(
      <>
        <Route key = {"route" + Math.random() * (100 - 1) + 1} path = '/' element = {<Home/>}/>
        <Route key = {"route" + Math.random() * (100 - 1) + 1} path = '/login' element = {<Login/>}/>
        <Route key = {"route" + Math.random() * (100 - 1) + 1} path = '/registration' element = {<Registration/>}/>
        <Route key = {"route" + Math.random() * (100 - 1) + 1} path = '/addBook' element = {<BookCreation/>}/>
        <Route key = {"route" + Math.random() * (100 - 1) + 1} path = '/readBook/:id' element = {<BookRead/>}/>
        <Route key = {"route" + Math.random() * (100 - 1) + 1} path = '/bookShelves' element = {<ShelfList></ShelfList>}/>
        <Route key = {"route" + Math.random() * (100 - 1) + 1} path = '/bookShelf/:id' element = {<ShelfBooks></ShelfBooks>}/>
      </>
    )
  }
  
  return(
    <BrowserRouter>
    <Header></Header>
      <Routes>
        {routes}
      </Routes>
    </BrowserRouter>
  )
}

const mapStateToProps = (store) => {
  return {
      user: store.user
  }
}

export default connect(
  mapStateToProps
)(App);
