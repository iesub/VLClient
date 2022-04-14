import { useState } from "react";
import { Col, Container, Row, Form, Button, Modal} from "react-bootstrap";
import { useParams } from "react-router-dom";
import $ from "jquery";
import preload from "../grid.svg";
import "../css/Preload.css"
import ModalBookShow from "./ModalBookShow";
import {BsFillTrashFill} from "react-icons/bs"
import { connect } from "react-redux";

const ShelfBooks = (props) => {
    
    const [shelfInfoGot, setShelfInfoGot] = useState(false)
    let { id } = useParams();
    const [bookPreview, setBookPreview] = useState([])
    const [modalPreview, setModalPreview] = useState([])

    if (!shelfInfoGot && props.user.isAuthenticated){
        $.ajax({
            url: process.env.REACT_APP_SERVER_NAME + '/get/shelf',         
            method: 'get',             
            dataType: 'html',
            credentials: "same-origin",
            data: {id: id},
            xhrFields:{
              withCredentials: true
            },               
            success: function(data){
                data = JSON.parse(data)
                setShelfInfoGot(true)
                if (data.response == "OWNERSHIP_ERROR"){
                    $("#shelfName").html("Ошибка")
                    $("#bookList").html("<h3>Данная полка вам не принадлежит.</h3>")
                } else {
                    $("#shelfName").html(data.response.name)
                    getBooks()
                }
            }
        })
    }

    const getBooks = () => {
        $.ajax({
            url: process.env.REACT_APP_SERVER_NAME + '/get/books-from-shelf',         
            method: 'get',             
            dataType: 'html',
            credentials: "same-origin",
            data: {id: id},
            xhrFields:{
              withCredentials: true
            },               
            success: function(data){
                data = JSON.parse(data)
                console.log(data)
                previewBooks(data)
            }
        })
    }

    const previewBooks = (data) => {
        setBookPreview([])
        $("#preload").hide(50)
        var bookPrev = []
        var value = data
        for (let j = 0; j < data.response.length; j){
        var bookRow = []
        j += 4;
        for (let i = 0; i < j; i++){
            if (value.response[i] == null){       
                continue
            }
            var date = new Date(value.response[i].releaseDate);
            var dateString = date.toLocaleDateString(date);
            var tags = "";
            for (let j = 0; j < value.response[i].tags.length; j++){
                if (j+1 != value.response[i].tags.length){
                    tags += value.response[i].tags[j].name + ", "
                } else {
                    tags += value.response[i].tags[j].name
                }
            }

            bookRow.push(
                <Col xl = "3" key = {'col' + Math.random() * (100 - 1) + 1}>
                    <Row>
                        <img className = 'img-fluid imagePreview' src = {"data:image/png;base64," + value.response[i].logo}/>
                    </Row>
                    <Row>
                        <p> <strong>Название: </strong> {value.response[i].name} </p>
                    </Row>
                    <Row>
                        <p> <strong>Автор: </strong> {value.response[i].author.name} </p>
                    </Row>
                    <Row>
                        <p> <strong>Жанр: </strong> {value.response[i].bookGenre.name} </p>
                    </Row>
                    <Row>
                        <p> <strong>Дата выхода: </strong>{dateString} </p>
                    </Row>
                    <Row>
                        <Button className = "moreButton" variant="primary" onClick = {() => {
                            var modItems = [] 
                            modItems.push(
                                <ModalBookShow key = { Math.random() * (100 - 1) + 1} value = {value.response[i]} tags = {tags} dateString = {dateString} i = {i}/>
                            )
                            setModalPreview(modItems)
                        }}>Подробнее</Button>
                        <Button variant="danger" className = "deleteShelf" onClick = {() => {
                                    $.ajax({
                                        url: process.env.REACT_APP_SERVER_NAME + '/delete/book-from-shelf',         
                                        method: 'post',             
                                        dataType: 'html',
                                        credentials: "same-origin",
                                        data: {bookId: data.response[i].id, shelfId: id},
                                        xhrFields:{
                                          withCredentials: true
                                        },               
                                        success: function(data){
                                            getBooks()
                                        }
                                    })
                                }}>
                                    <BsFillTrashFill />
                        </Button>
                    </Row>
                </Col>           
            )
        }
        bookPrev.push(
            <Row key = {"rowBook" + Math.random() * (100 - 1) + 1}>
                {bookRow}
            </Row>
        )
    }
        setBookPreview(bookPrev)
    }

    $(document).ready(function(){
        $("#headlineRow").css({
            "border-bottom": "solid grey 2px",
            "margin-bottom": "20px"
        })
    })

    return(
        <Container>
            <Row id = "headlineRow">
                <h1 id = "shelfName">Ваши книжные полки</h1>
            </Row>
            <Row>
                <Col xl = "2"></Col>
                <Col xl = "8" id = "bookList">
                <div className="preload text-center" id = "preload">
                        <img className = "grid" src={preload} width="80" />
                </div>
                {bookPreview}
                </Col>
                <Col xl = "2"></Col>
            </Row>
            <Row>
            {modalPreview}
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
)(ShelfBooks)