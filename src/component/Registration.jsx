import { Col, Container, Form, Row, Button, Alert } from "react-bootstrap";
import $ from "jquery";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registration = (props) => {

    const [showFormatAlert, setShowFormatAlert] = useState(false);
    const [showExistanceAlert, setShowExistanceAlert] = useState(false);
    const [showPasswordAlert, setShowPasswordAlert] = useState(false);

    let navigate = useNavigate();

    $(document).ready(function(e){
        $("#regForm").submit(function(e){
            e.preventDefault();
            setShowExistanceAlert(false)
            setShowFormatAlert(false)
            setShowPasswordAlert(false)
            var form = $("#regForm");
            $.ajax({
                url: 'http://localhost:13378/registration',         
                method: 'post',             
                dataType: 'html',
                credentials: "same-origin",
                data: form.serialize(),
                xhrFields:{
                  withCredentials: true
                },               
                success: function(data){   
                    data = JSON.parse(data)
                    console.log(data)
                    if (!data.registrationData.passwordsCorrect){
                        setShowPasswordAlert(true)
                    }
                    if (!data.registrationData.mailCorrect){
                        setShowFormatAlert(true)
                    }
                    if (data.registrationData.mailCorrect.mailExist){
                        setShowExistanceAlert(true)
                    }
                    if (!data.registrationData.mailCorrect.mailExist){
                        navigate("/login", { replace: true });
                    }
                }
              })
        })
        })

    return(
        <Container>
            <Row>
                <Col xs = "3"></Col>
                <Col xs = "6">
                <Form id = "regForm">
                    
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Alert id = "alert" show={showFormatAlert} variant="danger" onClose={() => setShowFormatAlert(false)} dismissible>
                            <p>
                                Неверный формат почты.
                            </p>
                        </Alert>
                        <Alert id = "alert" show={showExistanceAlert} variant="danger" onClose={() => setShowExistanceAlert(false)} dismissible>
                            <p>
                                Пользователь с такой почтой уже существует.                            
                            </p>
                        </Alert>
                        <Form.Label>Ваш адрес электронной почты</Form.Label>
                        <Form.Control type="email"name = "username" placeholder="example@mail.com" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicNickname">
                        <Form.Label>Имя пользователя</Form.Label>
                        <Form.Control type="nickname" name = "nickname" />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Alert id = "alert" show={showPasswordAlert} variant="danger" onClose={() => setShowPasswordAlert(false)} dismissible>
                            <p>
                            Пароли должны совпадать.
                            </p>
                        </Alert>
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control type="password"name = "password" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                        <Form.Label>Повторите пароль</Form.Label>
                        <Form.Control type="password"name = "passwordConfirm" />
                    </Form.Group>
                
                    <Button variant="primary" type="submit" onClick = {Registration}>
                        Зарегистрироваться
                    </Button>
                </Form>
                </Col>
                <Col xs = "3"></Col>
            </Row>
        </Container>
    )
}

export default Registration;