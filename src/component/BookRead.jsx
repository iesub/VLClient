import { useState } from "react";
import { Col, Container, Row, Form, Button} from "react-bootstrap";
import { useParams } from "react-router-dom";
import $ from "jquery";
import preload from "../grid.svg";
import "../css/Preload.css"
import { BsFillCaretLeftFill,  BsFillCaretRightFill} from "react-icons/bs"

const BookRead = (props) => {

    const [currentPage, setCurrentPage] = useState(1)
    const [amountPage, setAmountPage] = useState(1)
    const [pagesCounted, setPagesCounted] = useState(false)
    const [choosePage, setChoosePage] = useState([])
    const [pageImg, setPageImg] = useState([])
    let { id } = useParams();

    $(document).ready(function(){
        $("#headlineRow").css({
            "border-bottom": "solid grey 2px",
            "margin-bottom": "20px"
        })

        $(".imagePreview").css({
            "max-height": "90vh",
            "height" : "auto"
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

    if (!pagesCounted){
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
                </Col>
            </Row>
        </Container>
    )
}

export default BookRead