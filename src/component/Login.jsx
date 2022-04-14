import { Col, Container, Form, Row, Button, Alert } from "react-bootstrap";
import $ from "jquery";
import { initUser } from "../actions/AuthorizationActions";
import { connect } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {

    const [show, setShow] = useState(false);
    let navigate = useNavigate();

    $(document).ready(function(){

    $("#headlineRow").css({
        "border-bottom": "solid grey 2px",
        "margin-bottom": "20px"
    })
    
    $("#loginForm").submit(function(e){
        e.preventDefault();
        var form = $("#loginForm");
        $.ajax({
            url: process.env.REACT_APP_SERVER_NAME + '/login',         
            method: 'post',             
            dataType: 'html',
            credentials: "same-origin",
            data: form.serialize(),
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
                    navigate("/", { replace: true });
                } else {
                    setShow(true)
                }
            }
          })
    })
    })

    return(
        <Container>
            <Row id = "headlineRow">
                <h1>Авторизация</h1>
            </Row>
            <Row>
                <Col xs = "3"></Col>
                <Col xs = "6">
                <Form id = "loginForm">
                    <Form.Group>
                    <Alert id = "alert" show={show} variant="danger">
                            <p>
                            Неверный логин или пароль.
                            </p>
                    </Alert>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Ваш адрес электронной почты</Form.Label>
                        <Form.Control type="email"name = "username" placeholder="example@mail.com" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control type="password"name = "password" />
                    </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" name = "rememberme" label="Запомнить меня" />
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick = {Login}>
                        Зайти
                    </Button>
                </Form>
                </Col>
                <Col xs = "3"></Col>
            </Row>
        </Container>
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
)(Login)