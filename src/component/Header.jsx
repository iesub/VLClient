import { Navbar } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'
import '../css/Header.css'
import $ from "jquery";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { initUser } from "../actions/AuthorizationActions";
import { useEffect } from 'react';

const logout = () => {
    $.ajax({
        url: process.env.REACT_APP_SERVER_NAME + `/logout`,         
        method: 'get',             
        dataType: 'html',
        credentials: "same-origin",
        xhrFields:{
          withCredentials: true
        },               
        success: function(data){   
            window.location.reload("/");
        }
      });
    }

const Header = (props) =>{

var navigate = useNavigate();

var loginPath
var regPath
var logoutComponent
var addBookComponent
var shelfListComponent

useEffect(() => {
    if(!props.user.isAuthenticated && checkIfPathContains(pathname, authorizedAccessPaths) && props.user.checked){
        replaceToLogin()
    }
})

$(document).ready(function(){
    if (!props.user.checked){
    $.ajax({
        url: process.env.REACT_APP_SERVER_NAME + `/ifAuthenticated`,         
        method: 'get',             
        dataType: 'html',
        credentials: "same-origin",
        xhrFields:{
          withCredentials: true
        },               
        success: function(data){   
            data = JSON.parse(data)
                if (data.userInfo.authenticated == true){
                    props.setInitAction({
                        checked: true,
                        mail: data.userInfo.mail,
                        nickname: data.userInfo.nickname,
                        authorities: data.userInfo.authorities,
                        isAuthenticated: data.userInfo.authenticated
                    })
                } else {
                    props.setInitAction({
                        checked: true,
                        mail: "",
                        nickname: "",
                        authorities: [],
                        isAuthenticated: false
                    }) 
                }
        }
      });
    }
})

const checkIfPathContains = (line, paths) => {
    for (let i = 0; i < paths.length; i++){
        if (line.includes(paths[i])){
            return true
        }
    }
    return  false
}

var pathname = window.location.pathname
var authorizedAccessPaths = ["/addBook", "/bookShelves", "/readBook", "/bookShelf"]

const replaceToLogin = () =>{
    navigate("/login", { replace: true });
}


if (!props.user.isAuthenticated){
    loginPath = <LinkContainer  to = "/login">
                    <Nav.Link className = "NavLink">Авторизоваться</Nav.Link>
                </LinkContainer>
    regPath = <LinkContainer  to = "/registration">
                    <Nav.Link className = "NavLink">Зарегистрироваться</Nav.Link>
              </LinkContainer>
}

if (props.user.isAuthenticated){
    logoutComponent = <Nav.Link onClick = {logout} className = "NavLink">Выйти</Nav.Link>
    addBookComponent = <LinkContainer  to = "/addBook">
                        <Nav.Link className = "NavLink">Добавить книгу</Nav.Link>
                </LinkContainer>
    shelfListComponent = <LinkContainer  to = "/bookShelves">
                            <Nav.Link className = "NavLink">Ваши книжные полки</Nav.Link>
                        </LinkContainer>
}

return(
    <header>
        <Navbar className="Header" bg="primary" variant="dark" expand="lg">
        <Container>
            <Navbar.Brand className = "Brand" href="/">
                Книжная полка
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
            <LinkContainer to = "/">
                <Nav.Link className = "NavLink">На главную</Nav.Link>
            </LinkContainer>
            {loginPath}
            {regPath}
            {shelfListComponent}
            {addBookComponent}
            {logoutComponent}
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    </header>
    )
}

const mapStateToProps = (store) => {
    return {
        user: store.user
    }
}
  
var mapDispatchToProps = dispatch => {
    return {
      setInitAction: payload => dispatch(initUser(payload))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header)