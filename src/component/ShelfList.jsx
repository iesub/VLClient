import { useState } from "react";
import { Col, Container, Row, Form, Button, Alert} from "react-bootstrap";
import { useParams } from "react-router-dom";
import {BsPlusLg, BsFillTrashFill} from "react-icons/bs"
import $ from "jquery";
import preload from "../grid.svg";
import "../css/Preload.css"
import { LinkContainer } from 'react-router-bootstrap'
import { connect } from "react-redux";

const ShelfList = (props) => {

    const[shelvesList, setShlevesList] = useState([])
    const[shelfListGot, setShelfListGot] = useState(false)
    const[createShelfError, setCreateShelfError] = useState([])

    if (!shelfListGot && props.user.isAuthenticated){
    setShelfListGot(true)
    $.ajax({
        url: process.env.REACT_APP_SERVER_NAME + '/get/shelves',         
        method: 'get',             
        dataType: 'html',
        credentials: "same-origin",
        data: {},
        xhrFields:{
          withCredentials: true
        },               
        success: function(data){
            data = JSON.parse(data)
            setShlevesList([])
            var tempList = []
            if (data.response.length == 0){
                tempList.push(
                    <div key = {"div"+Math.random() * (100 - 1) + 1} className="text-center">
                        <h5>У вас еще нет книжных полок. Самое вермя создать!</h5>
                    </div>
                )
            } else {
                for (let i = 0; i < data.response.length; i++){
                    tempList.push(
                        <Row className = "shelfRow" key = {"shelfRow" + Math.random() * (100 - 1) + 1}>
                            <Col xl="8" className = "d-inline-flex align-items-center"> 
                                <h5>{data.response[i].name}</h5> 
                                <h5 className = "bookCount">  Количество книг - {data.response[i].bookCount} </h5>
                            </Col>
                            <Col xl="4" className = "d-inline-flex">
                                <div className="flex-fill d-grid gap-2">
                                <LinkContainer to = {"/bookShelf/" + data.response[i].id}>
                                    <Button className = "readButton text-center" variant="primary">Перейти</Button>        
                                </LinkContainer>
                                </div>
                                <div>
                                <Button variant="danger" className = "deleteShelf" onClick = {() => {
                                    $.ajax({
                                        url: process.env.REACT_APP_SERVER_NAME + '/delete/shelf',         
                                        method: 'post',             
                                        dataType: 'html',
                                        credentials: "same-origin",
                                        data: {id: data.response[i].id},
                                        xhrFields:{
                                          withCredentials: true
                                        },               
                                        success: function(data){
                                            setShelfListGot(false)
                                        }
                                    })
                                }}>
                                    <BsFillTrashFill />
                                </Button>
                                </div>
                            </Col>
                        </Row>
                    )
                }                
            }
            $("#shelvesList").html("")
            setShlevesList(tempList)
        }
    })
    }

    const createShelf = () => {
        var form = $("#bookShelfCreation")
        setCreateShelfError([])
        $.ajax({
            url: process.env.REACT_APP_SERVER_NAME + '/add/shelf',         
            method: 'post',             
            dataType: 'html',
            credentials: "same-origin",
            data: form.serialize(),
            xhrFields:{
              withCredentials: true
            },               
            success: function(data){
                data = JSON.parse(data)
                if (data.response == "NAME_EMPTY_ERROR"){
                    var shelfError = []
                    shelfError.push(
                        <Alert variant="danger" key = {'alert' + Math.random() * (100 - 1) + 1}>
                            <p>
                                Название полки не может быть пустым.
                            </p>
                        </Alert>
                    )
                    setCreateShelfError(shelfError)
                } else {
                    setShelfListGot(false)
                }
            }
        })
    }
    

    $(document).ready(function(){
        $("#headlineRow").css({
            "border-bottom": "solid grey 2px",
            "margin-bottom": "20px"
        })
        $("#shelvesList").css({
            "margin-top": "10px"
        })
        $(".bookCount").css({
            "margin-left": "5px"
        })
        $(".shelfRow").css({
            "margin-top": "5px",
            "margin-bottom": "5px",
        })
    })

    return (
        <Container>
            <Row id = "headlineRow">
                <h1>Ваши книжные полки</h1>
            </Row>

            <Row id = "shelfCreation">
            <Col xl = "2">
                </Col>
                <Col xl = "8" className = "imagePreview">
                {createShelfError}
                <label>Введите название новой полки</label>
                <Form id = "bookShelfCreation" className="d-flex" onSubmit={(e) => {
                    e.preventDefault()
                    createShelf()
                }}>
                    <Form.Group className="flex-fill">
                        <Form.Control type="text" name = "name" autoComplete="off"/>
                    </Form.Group>
                    <Button type = "submit">
                        <BsPlusLg/>
                    </Button>
                </Form>
                </Col>
                <Col xl = "2">
                </Col>
            </Row>

            <Row>
                <Col xl = "2">
                </Col>
                <Col xl = "8" id = "shelvesList" className = "imagePreview">
                <div className="preload text-center" id = "preload">
                        <img className = "grid" src={preload} width="80" />
                </div>
                {shelvesList}
                </Col>
                <Col xl = "2">
                </Col>
            </Row>
        </Container>
    )
}


const mapStateToProps = (store) => {
    return {
        user: store.user
    }
}
  
export default connect(
    mapStateToProps
)(ShelfList)