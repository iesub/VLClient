import { useState } from "react";
import { Col, Container, Row, Form, Button, Modal} from "react-bootstrap";
import { useParams } from "react-router-dom";
import $ from "jquery";
import preload from "../grid.svg";
import "../css/Preload.css"
import { BsFillCaretLeftFill,  BsFillCaretRightFill} from "react-icons/bs"
import { LinkContainer } from 'react-router-bootstrap'
import { connect } from "react-redux";

const BookRead = (props) => {

    const [currentPage, setCurrentPage] = useState(1)
    const [amountPage, setAmountPage] = useState(1)
    const [pagesCounted, setPagesCounted] = useState(false)
    const [choosePage, setChoosePage] = useState([])
    const [pageImg, setPageImg] = useState([])
    const [chooseShelfToAdd, setChooseShelfToAdd] = useState([])
    const [modalShow, setModalShow] = useState(false)
    const [modalBody, setModalBody] = useState("")
    let { id } = useParams();

    $(document).ready(function(){
        $(".imagePreview").css({
            "max-height": "90vh",
            "height" : "auto"
        })
        $("#headlineRow").css({
            "border-bottom": "solid grey 2px",
            "margin-bottom": "20px"
        })

        $(".choosePageRow").css({
            "margin-top": "5px"
        })
        
        $(".changePageButton").css({
            "margin-left": "5px",
            "margin-right": "5px"
        })

        $(".bookInfo").css({
            "margin-top": "5px"
        })
    })

    if (!pagesCounted && props.user.isAuthenticated){
        $.ajax({
            url: process.env.REACT_APP_SERVER_NAME + '/get/page-amount',         
            method: 'get',             
            dataType: 'html',
            credentials: "same-origin",
            data: {bookId: id},
            xhrFields:{
              withCredentials: true
            },               
            success: function(data){
                data = JSON.parse(data)
                if (data.response == 0){
                    $(".contentRow").html("")
                    $("#firstRow").append("<h2> Такой книги у нас нет </h2>")
                    setPagesCounted(true)
                    return
                } 
                setPagesCounted(true)
                setAmountPage(data.response)
                var choosePageT = []
                for (let i = 0; i < data.response; i++){
                    choosePageT.push(
                        <option value = {i+1} id = {"pageOption"+i} key = {"page" + (Math.random() * (100 - 1) + 1) * (Math.random() * (100 - 1) + 1)}>{i+1}</option>
                    )
                }
                setChoosePage(choosePageT)
                getBookInfo()
            }
        })
    }

    const getBookInfo = () => {
        $.ajax({
            url: process.env.REACT_APP_SERVER_NAME + '/get/book-by-id',         
            method: 'get',             
            dataType: 'html',
            credentials: "same-origin",
            data: {bookId: id},
            xhrFields:{
              withCredentials: true
            },               
            success: function(data){
                data = JSON.parse(data)
                $("#bookName").html(data.response.name)
                $("#bookDescription").html(data.response.description)
                $("#bookAuthor").html(data.response.author.name)
                $("#bookGenre").html(data.response.bookGenre.name)
                var date = new Date(data.response.releaseDate);
                var dateString = date.toLocaleDateString(date);
                $("#bookRelease").html(dateString)
                var tags = "";
                for (let j = 0; j < data.response.tags.length; j++){
                if (j+1 != data.response.tags.length){
                    tags += data.response.tags[j].name + ", "
                } else {
                    tags += data.response.tags[j].name
                }
                }
                $("#bookTags").html(tags)
                loadPage(currentPage)
                loadShelfList()
            }
        })
    }

    const loadPage = (page) => {
        $.ajax({
            url: process.env.REACT_APP_SERVER_NAME + '/get/book-page',         
            method: 'get',             
            dataType: 'html',
            credentials: "same-origin",
            data: {bookId: id, offset: page},
            xhrFields:{
              withCredentials: true
            },               
            success: function(data){
                data = JSON.parse(data)
                setPageImg([])
                $("#page").html("")
                var pageImgT = []
                pageImgT.push(
                    <img key = {Math.random() * (100 - 1) + 1} className = 'img-fluid imagePreview' src = {"data:image/png;base64," + data.response.pagePicture}/>
                )
                setPageImg(pageImgT)
            }
        })
    }

    const loadShelfList = () => {
        setChooseShelfToAdd([])
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
                var options = []
                var finalResult = []
                if (data.response.length == 0){
                    finalResult.push(
                        <Row key = {"shelfChooseRow" + Math.random() * (100 - 1) + 1} className="">
                            <Col xl = "8">
                                <span className="align-middle">У вас нет полок. Пора создать одну.</span>
                            </Col>
                            <Col xl = "4" className="d-grid gap-2">
                            <LinkContainer to = {"/bookShelves"}>
                                <Button className = "readButton text-center" variant="primary">Создать</Button>        
                            </LinkContainer>
                            </Col>
                        </Row>
                    )
                } else {
                    for (let i = 0; i < data.response.length; i++){
                        options.push(
                            <option key = {"shelfChooseOption" + Math.random() * (100 - 1) + 1} value = {data.response[i].id}> {data.response[i].name} </option>
                        )
                    }
                    finalResult.push(
                        <Row key = {"shelfChooseRow" + Math.random() * (100 - 1) + 1}>
                            <Col xl = "1"></Col>
                            <Col xl = "10">
                            <Form id = "bookAddToShelf" className="d-flex" onSubmit={(e) => {
                                e.preventDefault()
                                addBookToShelf()
                            }}>
                                <Form.Group className="flex-fill">
                                    <Form.Select id = "shelfChoose" name = "id">
                                        {options}
                                    </Form.Select>
                                </Form.Group>
                                <Button type = "submit">
                                    Добавить
                                </Button>
                            </Form>
                            </Col>
                            <Col xl = "1"></Col>
                        </Row>
                    )
                }
                setChooseShelfToAdd(finalResult)
            }
        })
    }

    const addBookToShelf = () => {
        var bookID = id
        $.ajax({
            url: process.env.REACT_APP_SERVER_NAME + '/add/book-to-shelf',         
            method: 'post',             
            dataType: 'html',
            credentials: "same-origin",
            data: {bookId: bookID, shelfId: $("#shelfChoose").val()},
            xhrFields:{
              withCredentials: true
            },               
            success: function(data){
                data = JSON.parse(data)
                setModalBody("")
                if (data.response == "ALREADY_ON_SHELF"){
                    setModalBody("Такая книга уже есть в выбранной полке. Попробуйте сменить выбранную Вами полку.")
                } else {
                    setModalBody("Успех. Книга добавлена на полку!")
                }
                setModalShow(true)
            }
        })
    }

    return (
        <Container>

        <Row id = "headlineRow">
            <h3 id = "bookName"></h3>
        </Row>

            <Row className = "contentRow" id = "firstRow">
                <Col className='d-flex align-items-center' xl = "1">
                    
                </Col>
                <Col xl = "10" id = "page" className = "imagePreview text-center">
                <div className="preload" id = "preload">
                        <img className = "grid" src={preload} width="80" />
                </div>
                {pageImg}
                </Col>
                <Col xl = "1">
                </Col>
            </Row>
            <Row className = "contentRow choosePageRow">
                <Col lg = "4"></Col>
                <Col lg = "4">
                    <Form.Group className='d-flex align-items-center'>
                    <Button onClick = {() => {
                            if (currentPage-1 > 0){
                                setCurrentPage(currentPage-1)
                                loadPage(currentPage-1)
                                $("#pageSelect").val(currentPage-1)
                            }
                        }} className = "changePageButton" style = {{height: "38px"}} variant="primary" type="button">
                            <BsFillCaretLeftFill/>
                    </Button>
                    <label className=".align-middle">Страница:</label>
                    <Form.Select id = "pageSelect" onChange = {()=>{
                        var result = parseInt($("#pageSelect").val())
                        setCurrentPage(result)
                        loadPage($("#pageSelect").val())
                    }}>
                        {choosePage}
                    </Form.Select>
                    <label className=".align-middle">{"/" + amountPage}</label>
                    <Button onClick = {() => {
                            if (currentPage+1 <= amountPage){
                                setCurrentPage(currentPage+1)
                                loadPage(currentPage+1)
                                $("#pageSelect").val(currentPage+1)
                            }
                        }} className = "changePageButton" style = {{height: "38px"}} variant="primary" type="button">
                            <BsFillCaretRightFill/>
                    </Button>
                    </Form.Group>
                </Col>
                <Col lg = "4"></Col>
            </Row>
            <Row className = "bookInfo">
                <Col xl = "6">
                    <Row>
                        <label><strong>Описание: </strong> <label id = "bookDescription"></label> </label>
                    </Row>
                </Col>
                <Col xl = "6">
                    <Row>
                        <label><strong>Автор: </strong> <label id = "bookAuthor"></label> </label>
                    </Row>
                    <Row>
                        <label><strong>Жанр: </strong> <label id = "bookGenre"></label> </label>
                    </Row>
                    <Row>
                        <label><strong>Дата выхода: </strong> <label id = "bookRelease"></label> </label>
                    </Row>
                    <Row>
                        <label><strong>Теги: </strong> <label id = "bookTags"></label> </label>
                    </Row>
                    <Row>
                        <label><strong>Добавьте книгу к своей коллекции!</strong></label>
                    </Row>
                    {chooseShelfToAdd}
                </Col>
            </Row>
            <Modal show = {modalShow} centered onHide = {() => {
                setModalShow(false)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавление книги на полку</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalBody}</Modal.Body>
            </Modal>
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
)(BookRead)