import { Navbar } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'
import '../css/Header.css'
import $ from "jquery";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthorities, setIsAuthenticated, setMail, setNickname, setIfChecked } from "../actions/AuthorizationActions";

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

var loginPath
var regPath
var logoutComponent
var addBookComponent

$(document).ready(function(){
    console.log(process.env.REACT_APP_SERVER_NAME)
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
                    props.setIfCheckedAction(true)
                    props.setMailAction(data.userInfo.mail)
                    props.setIsAuthenticatedAction(data.userInfo.authenticated)
                    props.setAuthoritiesAction(data.userInfo.authorities)
                    props.setNicknameAction(data.userInfo.nickname)
                }
        }
      });
    }
})

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
      setIsAuthenticatedAction: payload => dispatch(setIsAuthenticated(payload)),
      setMailAction: payload => dispatch(setMail(payload)),
      setNicknameAction: payload => dispatch(setNickname(payload)),
      setAuthoritiesAction: payload => dispatch(setAuthorities(payload)),
      setIfCheckedAction: payload => dispatch(setIfChecked(payload))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header)