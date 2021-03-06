import { Col, Container, Form, Row, Button, Alert } from "react-bootstrap";
import $ from "jquery";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registration = (props) => {

    const [showFormatAlert, setShowFormatAlert] = useState(false);
    const [showExistanceAlert, setShowExistanceAlert] = useState(false);
    const [showPasswordAlert, setShowPasswordAlert] = useState(false);

    const [showMailEmptyAlert, setShowMailEmptyAlert] = useState(false);
    const [showNicknameEmptyAlert, setShowNicknameEmptyAlert] = useState(false);
    const [showPasswordEmptyAlert, setShowPasswordEmptyAlert] = useState(false);
    const [showPasswordConfEmptyAlert, setShowPasswordConfEmptyAlert] = useState(false);

    let navigate = useNavigate();

    $(document).ready(function(e){

        $("#headlineRow").css({
            "border-bottom": "solid grey 2px",
            "margin-bottom": "20px"
        })

        $("#regForm").submit(function(e){
            e.preventDefault();
            setShowExistanceAlert(false)
            setShowFormatAlert(false)
            setShowPasswordAlert(false)
            var form = $("#regForm");
            $.ajax({
                url: process.env.REACT_APP_SERVER_NAME + '/registration',         
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
                    if (data.registrationData.mailExist && data.registrationData.gotErrors){
                        setShowExistanceAlert(true)
                    }
                    if (data.registrationData.mailEmpty){
                        setShowMailEmptyAlert(true)
                    }
                    if (data.registrationData.nicknameEmpty){
                        setShowNicknameEmptyAlert(true)
                    }
                    if (data.registrationData.passwordEmpty){
                        setShowPasswordEmptyAlert(true)
                    }
                    if (!data.registrationData.mailExist && !data.registrationData.gotErrors){
                        navigate("/login", { replace: true });
                    }
                }
              })
        })
        })

    return(
        <Container>
            <Row id = "headlineRow">
                <h1>????????????????????</h1>
            </Row>
            <Row>
                <Col xs = "3"></Col>
                <Col xs = "6">
                <Form id = "regForm">
                    
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Alert id = "alert" show={showFormatAlert} variant="danger">
                            <p>
                                ???????????????? ???????????? ??????????.
                            </p>
                        </Alert>
                        <Alert id = "alert" show={showExistanceAlert} variant="danger">
                            <p>
                                ???????????????????????? ?? ?????????? ???????????? ?????? ????????????????????.                            
                            </p>
                        </Alert>
                        <Alert id = "alert" show={showMailEmptyAlert} variant="danger">
                            <p>
                                ?????????????????? ?????? ????????.                            
                            </p>
                        </Alert>
                        <Form.Label>?????? ?????????? ?????????????????????? ??????????</Form.Label>
                        <Form.Control type="email"name = "username" placeholder="example@mail.com" />
                    </Form.Group>

                    <Alert id = "alert" show={showNicknameEmptyAlert} variant="danger">
                            <p>
                                ?????????????????? ?????? ????????.                            
                            </p>
                    </Alert>
                    <Form.Group className="mb-3" controlId="formBasicNickname">
                        <Form.Label>?????? ????????????????????????</Form.Label>
                        <Form.Control type="nickname" name = "nickname" />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Alert id = "alert" show={showPasswordAlert} variant="danger">
                            <p>
                            ???????????? ???????????? ??????????????????.
                            </p>
                        </Alert>
                        <Alert id = "alert" show={showPasswordEmptyAlert} variant="danger">
                            <p>
                                ?????????????????? ?????? ????????.                            
                            </p>
                        </Alert>
                        <Form.Label>????????????</Form.Label>
                        <Form.Control type="password"name = "password" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                        <Form.Label>?????????????????? ????????????</Form.Label>
                        <Alert id = "alert" show={showPasswordConfEmptyAlert} variant="danger">
                            <p>
                                ?????????????????? ?????? ????????.                            
                            </p>
                        </Alert>
                        <Form.Control type="password"name = "passwordConfirm" />
                    </Form.Group>
                
                    <Button variant="primary" type="submit" onClick = {Registration}>
                        ????????????????????????????????????
                    </Button>
                </Form>
                </Col>
                <Col xs = "3"></Col>
            </Row>
        </Container>
    )
}

export default Registration;