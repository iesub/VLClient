import { Container, Row, Col, Button, Modal, Form, Alert, Pagination } from "react-bootstrap"
import $ from "jquery";
import { BsSearch } from "react-icons/bs"
import preload from "../grid.svg";
import "../css/Preload.css"
import React, {useEffect} from "react";
import { useState } from "react";
import ModalBookShow from "./ModalBookShow";
import {BsFillTrashFill} from "react-icons/bs"
import { connect } from "react-redux";

var searchProgress = false;
var bookName = "";
var tags = null
var author = null;
var genre = null;

const Home = (props) => {

    var paginationItems = []
    var bookPrev = []
    const [pagItems, setPagItems] = useState([])
    const [modalPreview, setModalPreview] = useState([])
    const [bookPreview, setBookPreview] = useState([])
    const [updateState, setUpdateState] = useState(false)
    const [filterState, setFilterState] = useState(false)
    const [showWait, setShowWait] = useState(false)
    var beforeEllipsis = false;
    var afterEllipsis = false;
    var activePag = 1;
    var amountPag;

    useEffect(() => {
        
    })

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
    
    const setUpdateStateFunc = (state) => {
        setUpdateState = state
    }

    const drawPag = () => {

        paginationItems = []
        beforeEllipsis = false
        afterEllipsis = false

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
    
        if (amountPag <= 5){
            for (let number = 1; number <= amountPag; number++) {                
                paginationItems.push(
                  <Pagination.Item key={number} onClick={((e) => pagTo(e, number))} active={number === activePag}>
                    {number}
                  </Pagination.Item>
                );
            }
        }
    
        if (amountPag > 5){
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

        $("#bookList").css({
            "margin-top": "10px"
        })

        $("#filtersList").css({
            "margin-top": "10px"
        })

        $(".moreButton").css({
            "margin-bottom": "5px"
        })

        $(".selectDiv").css({
            overflow: 'scroll',
            height: '100px',
            'overflowX': 'hidden'
          });

        updateList()
    })

    const findAuthority = (list, authorityName) => {
        for (let i = 0; i < list.length; i++){
            if (list[i].authority == authorityName){
                return true
            }
        }
        return false
    }

    const updateList = () => {
        if (!updateState){
        if (author == null && genre == null && tags == null){
            findByName(bookName)
        } else if (author != null || genre != null || tags != null ){
            findByFilters()
            }
        } 
        setUpdateState(true)
    }

    const previewBooks = (data) => {
        setBookPreview([])
        $("#preload").hide(50)
        bookPrev = []
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
            var deleteButton = []
            if (findAuthority(props.user.authorities, "ROLE_ADMINISTRATOR")){
                deleteButton.push(
                    <Button key = {'deleteButton' + Math.random() * (100 - 1) + 1} variant="danger" className = "moreButton" onClick = {() => {
                        setShowWait(true)
                        $.ajax({
                            url: process.env.REACT_APP_SERVER_NAME + '/delete/book',         
                            method: 'post',             
                            dataType: 'html',
                            credentials: "same-origin",
                            data: {bookId: data.response[i].id},
                            xhrFields:{
                              withCredentials: true
                            },               
                            success: function(data){
                                setShowWait(false)
                                setUpdateState(false)
                            }
                        })
                    }}>
                        <BsFillTrashFill />
                    </Button>
                )
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
                        <Button variant="primary" className = "moreButton" onClick = {() => {
                            var modItems = [] 
                            modItems.push(
                                <ModalBookShow  key = { Math.random() * (100 - 1) + 1} value = {value.response[i]} tags = {tags} dateString = {dateString} i = {i}/>
                            )
                            setModalPreview(modItems)
                        }}>Подробнее</Button>
                        {deleteButton}
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

    const findByName = (name) => {
        if (searchProgress) {return (1)}
        else {searchProgress = true}
        $("#preload").show(50)
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
                amountPag = Math.ceil(data.responseCount / 20)
                if (amountPag==0){
                    $("#bookList").html("")
                    $("#bookList").append(
                        "<h5 class = 'text-center'> По вашему запросу ничего не найдено. </h5>"
                    )
                    searchProgress = false
                    return
                }
                searchProgress = false
                drawPag()
                previewBooks(data)
                }
        })
    }

    const findByFilters = () => {
        if (searchProgress) {return (1)}
        else {searchProgress = true}
        $("#preload").show(50)
        $.ajax({
            url: process.env.REACT_APP_SERVER_NAME + '/get/book-by-filter',         
            method: 'post',             
            dataType: 'html',
            credentials: "same-origin",
            data: {author: author, genre: genre, tag: tags,offset: activePag},
            xhrFields:{
              withCredentials: true
            },               
            success: function(data){
                data = JSON.parse(data)
                console.log(data)
                amountPag = Math.ceil(data.responseCount / 20)
                if (amountPag==0){
                    $("#bookList").html("")
                    $("#bookList").append(
                        "<h5 class = 'text-center'> По вашему запросу ничего не найдено. </h5>"
                    )
                    searchProgress = false
                    return
                }
                searchProgress = false
                drawPag()
                previewBooks(data)
                },
            error: function(error){
                searchProgress = false
            }
        })
    }

    if (!filterState){
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
        setFilterState(true)
    }
    
    return(
    <Container>
        <Row id = "headlineRow">
            <h1>Главная</h1>
        </Row>

        <Row>
            <Col xl = "4" id = "filtersList">
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
                        <Button variant="primary" type="button" onClick = {() => {
                            if ($("input:radio[name=author]:checked") == null 
                            && $("input:radio[name=genre]:checked") == null 
                            && $("input:checkbox[name=tag]:checked") == null) {return}
                            bookName = ""
                            tags = []
                            $("input:checkbox[name=tag]:checked").each(function(){
                                tags.push($(this).val());
                            });
                            author = $("input:radio[name=author]:checked").val()
                            genre = $("input:radio[name=genre]:checked").val()
                            setBookPreview([])
                            findByFilters()         
                        }}>
                            Применить фильтры
                        </Button>

                        <Button variant="primary" type="button" onClick = {() => {
                            tags = null
                            $("input:checkbox[name=tag]:checked").each(function(){
                                $(this).prop("checked", false)
                            });
                            author = null
                            genre = null
                            $("input:radio[name=author]:checked").prop("checked", false)
                            $("input:radio[name=genre]:checked").prop("checked", false)
                            setBookPreview([])
                            findByName(bookName)
                        }}>
                            Очистить фильтры
                        </Button>
                        </Form>
                    </Col>
                </Row>
            </Col>

            <Col xl = "8" id = "bookList" key = "booklistkey">
                <div className="preload" id = "preload">
                        <img className = "grid" src={preload} width="80" />
                </div>
                {bookPreview}
            </Col>
        </Row>

        <Row>
            <Col>
                <Pagination className="justify-content-center pagination">
                    {pagItems}
                </Pagination>
            </Col>
        </Row>
        <Row>
            {modalPreview}
        </Row>
        <Modal show={showWait} backdrop = 'static' centered>
                <Modal.Header>
                <Modal.Title>Книга удаляется...</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="preload">
                    <img className = "grid" src={preload} width="80" />
                </div>
                </Modal.Body>
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
)(Home)
