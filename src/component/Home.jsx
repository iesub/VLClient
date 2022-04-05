import { Container, Row, Col, Button, Modal, Form, Alert, Pagination } from "react-bootstrap"
import $ from "jquery";
import { BsSearch } from "react-icons/bs"
import preload from "../grid.svg";
import "../css/Preload.css"
import React, {useEffect} from "react";
import { useState } from "react";

var searchProgress = false;
var bookName = "";

const Home = (props) => {

    var paginationItems = []
    const [pagItems, setPagItems] = useState([])
    const [updateState, setUpdateState] = useState(false)
    var beforeEllipsis = false;
    var afterEllipsis = false;
    var activePag = 1;
    var amountPag;
    
    const pagMoveUpdate = () => {
        drawPag()
        setUpdateState(false)
        updateList()
    }

    const pagToFirst = () => {
        activePag = 1;
        pagMoveUpdate()
    }

    const pagNext = () => {
        activePag += 1;
        pagMoveUpdate()
    }

    const pagPrev = () => {
        activePag -= 1;
        pagMoveUpdate()
    }

    const pagLast = () => {
        activePag = amountPag;
        pagMoveUpdate()
    }

    const pagTo = (e, number) => {
        activePag = number;
        pagMoveUpdate()
    }
    
    const drawPag = () => {

        console.log(amountPag)
        paginationItems = []

        paginationItems.push(
            <Pagination.First key = {"first"} onClick={pagToFirst}/>
        )
    
        if (activePag == 1){
            paginationItems.push(
                <Pagination.Prev key = {"prev"} disabled/>
            )
        } else {
            paginationItems.push(
                <Pagination.Prev key = {"prev"} onClick={pagPrev}/>
            )
        }
    
        if (activePag <= 5){
            for (let number = 1; number <= amountPag; number++) {                
                paginationItems.push(
                  <Pagination.Item key={number} onClick={((e) => pagTo(e, number))} active={number === activePag}>
                    {number}
                  </Pagination.Item>
                );
            }
        }
    
        if (activePag > 5){
            for (let number = 1; number <= amountPag; number++) {
                if (number <= activePag - 3 && !beforeEllipsis){              
                paginationItems.push(
                    <Pagination.Ellipsis key = {"el1"}/>
                );
                beforeEllipsis = true;
                }
                if (activePag-2 <= number && number <= activePag+2){
                    paginationItems.push(
                    <Pagination.Item key={number} onClick={((e) => pagTo(e, number))} active={number === activePag}>
                    {number}
                    </Pagination.Item> 
                    )
                }
                if (number >= activePag + 3 && !afterEllipsis){
                    paginationItems.push(
                    <Pagination.Ellipsis key = {"el2"} />
                    )
                    afterEllipsis = true;
                }
            }
        }
    
        if (activePag == amountPag){
            paginationItems.push(
                <Pagination.Next key = {"next"} disabled/>
            )
        } else {
            paginationItems.push(
                <Pagination.Next key = {"next"} onClick = {pagNext}/>
            )
        }
    
        paginationItems.push(
            <Pagination.Last key = {"last"} onClick = {pagLast}/>
        )

        setPagItems(paginationItems)
    }
    

    $(document).ready(function(){
        $("#headlineRow").css({
            "border-bottom": "solid grey 2px",
            "margin-bottom": "20px"
        })

        $(".selectDiv").css({
            overflow: 'scroll',
            height: '100px',
            'overflowX': 'hidden'
          });

        updateList()
    })

    const updateList = () => {
        if (!updateState){
            findByName(bookName)
        }
        setUpdateState(true)
    }

    const previewBooks = (data) => {
        $("#bookList").html("")
        var rowNext = 4;
        var books = "";
        for (let i = 0; i < data.response.length; i++){
            if (rowNext == 0){
                books = books.concat(
                    "</div>"
                )
            }
            if (rowNext == 4){
                books = books.concat(
                    "<div class = 'row bookrow'>"
                )
                rowNext = 0
            }
            var date = new Date(data.response[i].releaseDate);
            var dateString = date.toLocaleDateString();
            books = books.concat(
                "<div class = 'col-sm-3'>" +
                "<div class = 'row'> <img class = 'imagePreview' src = 'data:image/png;base64," + data.response[i].logo + "'/> </div>" +
                "<div class = 'row'> <label><strong>Название: </strong>" + data.response[i].name + "</label> </div>" +
                "<div class = 'row'> <label><strong>Автор: </strong>" + data.response[i].author.name + "</label> </div>" +
                "<div class = 'row'> <label><strong>Жанр: </strong>" + data.response[i].bookGenre.name + "</label> </div>" +
                "<div class = 'row'> <label><strong>Дата выхода: </strong>" + dateString + "</label> </div>" +
                "</div>"
            )
            rowNext+=1
        }
        if (rowNext!=0){
            books.concat(
                "</div>"
            )
        }
       books = books.concat(
            "</div>"
       )
        $("#bookList").append(
            books
        )
    }

    const findByName = (name) => {
        if (searchProgress) {return (1)}
        else {searchProgress = true}
        $.ajax({
            url: process.env.REACT_APP_SERVER_NAME + '/get/book-by-name',         
            method: 'post',             
            dataType: 'html',
            credentials: "same-origin",
            data: {query: name, offset: activePag},
            xhrFields:{
              withCredentials: true
            },               
            success: function(data){
                data = JSON.parse(data)
                //var pagNumber = Math.ceil(data.responseCount / 20)
                amountPag = data.responseCount
                if (amountPag==0){
                    $("#bookList").html("")
                    $("#bookList").append(
                        "<h5 class = 'text-center'> По вашему запросу ничего не найдено. </h5>"
                    )
                    return
                }
                searchProgress = false
                drawPag()
                getAuthors()
                getGenres()
                getTags()
                previewBooks(data)
                }
        })
    }

    const getAuthors = () => {
        $("#authors").html("")
        $.ajax({
            url: process.env.REACT_APP_SERVER_NAME + '/get/authors',         
            method: 'get',             
            dataType: 'html',
            credentials: "same-origin",
            xhrFields:{
              withCredentials: true
            },               
            success: function(data){   
                data = JSON.parse(data)
                for (var i = 0; i < data.response.length; i ++){
                    $("#authors").append(
                        '<input type="radio" class="btn-check btn-customs" name="author" id="author'+i+'" value="'+data.response[i].id+'" autocomplete="off"/>' + 
                        '<label class="btn btn-primary btn-customs" for="author'+i+'">'+ data.response[i].name +'</label>'
                    )
                }
            }
          })
        }

        const getGenres = () => {
          $("#genre").html("")
          $.ajax({
              url: process.env.REACT_APP_SERVER_NAME + '/get/book-genres',         
              method: 'get',             
              dataType: 'html',
              credentials: "same-origin",
              xhrFields:{
                withCredentials: true
              },               
              success: function(data){   
                  data = JSON.parse(data)
                  for (var i = 0; i < data.response.length; i ++){
                    $("#genre").append(
                        '<input type="radio" class="btn-check btn-customs" name="genre" id="genre'+i+'" value="'+data.response[i].id+'" autocomplete="off"/>' + 
                        '<label class="btn btn-primary btn-customs" for="genre'+i+'">'+ data.response[i].name +'</label>'
                    )
                  }
              }
            })
        }

        const getTags = () => {
            $("#tags").html("")
            $.ajax({
                url: process.env.REACT_APP_SERVER_NAME + '/get/book-tags',         
                method: 'get',             
                dataType: 'html',
                credentials: "same-origin",
                xhrFields:{
                  withCredentials: true
                },               
                success: function(data){   
                    data = JSON.parse(data)
                    for (var i = 0; i < data.response.length; i ++){
                        $("#tags").append(
                            '<input type="checkbox" class="btn-check btn-customs" name="tag" id="tag'+i+'" value="'+data.response[i].id+'" autocomplete="off"/>' + 
                            '<label class="btn btn-primary btn-customs" for="tag'+i+'">'+ data.response[i].name +'</label>'
                        )
                    }
                }
              })
        }

    return(
    <Container>
        <Row id = "headlineRow">
            <h1>Главная</h1>
        </Row>

        <Row>
            <Col xl = "4">
                <Row>
                    <Col>
                        <Form onSubmit = {(e) => {
                            {
                                e.preventDefault()
                            }
                        }} className='d-flex'>
                        <Form.Group className="flex-fill" controlId="formBasicSearch">
                            <Form.Control className = "queryInput" name = "query" autoComplete="off" placeholder="Введите название книги" />
                        </Form.Group>
                        <Button onClick = {() => {
                            bookName = $('.queryInput').val()
                            findByName($('.queryInput').val())
                        }} id = "BookSearchForm" style = {{height: "38px"}} variant="primary" type="button">
                            <BsSearch/>
                        </Button>
                        </Form>
                    </Col>
                </Row>
                <Row style = {{"borderBottom": "solid grey 2px",
            "marginBottom": "20px", "marginTop": "20px"}}>
                </Row>
                <Row>
                    <Col>
                        <Form>
                        <Form.Group className="mb-3" controlId="formBasicAuthor">
                            <Form.Label>Автор</Form.Label>
                            <div id = "authors" className = "selectDiv">

                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicGenre">
                            <Form.Label>Жанр</Form.Label>
                            <div id = "genre" className = "selectDiv">

                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicTags">
                            <Form.Label>Теги</Form.Label>
                            <div id = "tags" className = "selectDiv">
                            
                            </div>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Применить фильтры
                        </Button>
                        </Form>
                    </Col>
                </Row>
            </Col>

            <Col xl = "8" id = "bookList">
                <div className="preload">
                        <img className = "grid" src={preload} width="80" />
                </div>
            </Col>
        </Row>

        <Row>
            <Col>
                <Pagination className="justify-content-center pagination">
                    {pagItems}
                </Pagination>
            </Col>
        </Row>
    </Container>
    )
}

export default Home
