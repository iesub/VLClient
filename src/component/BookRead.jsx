import { useState } from "react";
import { Col, Container, Row, Form} from "react-bootstrap";
import { useParams } from "react-router-dom";
import $ from "jquery";
import preload from "../grid.svg";
import "../css/Preload.css"

const BookRead = (props) => {

    const [currentPage, setCurrentPage] = useState(1)
    const [amountPage, setAmountPage] = useState(1)
    const [pagesCounted, setPagesCounted] = useState(false)
    const [choosePage, setChoosePage] = useState([])
    const [pageImg, setPageImg] = useState([])
    const [loadedPage, setLoadedPage] = useState(false)
    let { id } = useParams();

    $(document).ready(function(){
        $("#headlineRow").css({
            "border-bottom": "solid grey 2px",
            "margin-bottom": "20px"
        })
    })

    console.log("Начал рендерить:" + currentPage)

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
                setLoadedPage(true)
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
            }
        })
    }

    if (!loadedPage){
        $.ajax({
            url: process.env.REACT_APP_SERVER_NAME + '/get/book-page',         
            method: 'get',             
            dataType: 'html',
            credentials: "same-origin",
            data: {bookId: id, offset: currentPage},
            xhrFields:{
              withCredentials: true
            },               
            success: function(data){
                console.log(data)
                data = JSON.parse(data)
                console.log(currentPage)
                setPageImg([])
                $("#page").html("")
                var pageImgT = []
                pageImgT.push(
                    <img  key = {Math.random() * (100 - 1) + 1} className = 'img-fluid imagePreview' src = {"data:image/png;base64," + data.response.pagePicture}/>
                )
                setLoadedPage(true)
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
                <Col xl = "1"></Col>
                <Col xl = "10" id = "page">
                <div className="preload" id = "preload">
                        <img className = "grid" src={preload} width="80" />
                </div>
                {pageImg}
                </Col>
                <Col xl = "1"></Col>
            </Row>
            <Row className = "contentRow">
                <Col lg = "3">
                    <Form.Group className='d-flex'>
                    <label>Страница:</label>
                    <Form.Select id = "pageSelect" onChange = {()=>{
                        setCurrentPage($("#pageSelect").val())
                        setLoadedPage(false)
                    }}>
                        {choosePage}
                    </Form.Select>
                    <label>{"/" + amountPage}</label>
                    </Form.Group>
                </Col>
                <Col lg = "9"></Col>
            </Row>
        </Container>
    )
}

export default BookRead