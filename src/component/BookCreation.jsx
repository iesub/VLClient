import { Container, Row, Col, Button, Modal, Form, Alert } from "react-bootstrap"
import AddAuthor from "./AddAuthor"
import AddBookGenre from "./AddBookGenre"
import AddBookTag from "./AddBookTag"
import { useState } from "react";
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import Dropzone from "dropzone";
import preload from "../grid.svg";
import "../css/Preload.css"

const BookCreation = () => {

    $("#tagList").css({
        overflow: 'scroll',
        height: '80px',
        'overflowX': 'hidden'
      });

    const [showAuthor, setAuthorModalShow] = useState(false);
    const [showGenre, setGenreModalShow] = useState(false);
    const [showTag, setTagModalShow] = useState(false);
    const [showLogoAlert, setShowLogoAlert] = useState(false);
    const [showLogoAlertD, setShowLogoAlertD] = useState(false);
    const [showBookNameAlert, setShowBookNameAlert] = useState(false);
    const [showDateAlert, setShowDateAlert] = useState(false);
    const [showDescriptionAlert, setShowDescriptionAlert] = useState(false);
    const [showTagAlert, setShowTagAlert] = useState(false);
    const [showAuthorAlert, setShowAuthorAlert] = useState(false);
    const [showGenreAlert, setShowGenreAlert] = useState(false);
    const [showBookAlert, setShowBookAlert] = useState(false);
    const [showBookDAlert, setShowBookAlertD] = useState(false);
    const [showNameExistAlert, setShowExistAlert] = useState(false);
    const [showWait, setShowWait] = useState(false);
    const handleCloseAuthor = () => setAuthorModalShow(false);
    const handleShowAuthor = () => setAuthorModalShow(true);
    let navigate = useNavigate();

    const handleCloseGenre = () => setGenreModalShow(false);
    const handleShowGenre = () => setGenreModalShow(true);

    const handleCloseTag = () => setTagModalShow(false);
    const handleShowTag = () => setTagModalShow(true);

    var logoDropzone;
    var bookDrozpone
    var logofile = 1;
    var bookfile = 1;

    const initLogoDropper = () => {
        logoDropzone = new Dropzone("div#logoDrozpone"
        ,{ url: '#', 
           maxFilesize: 1024,
           paramName: "logo",
           acceptedFiles: "image/png",
           autoQueue: false,});
    }

    const initBookDropper = () => {
        bookDrozpone = new Dropzone("div#bookDrozpone"
        ,{ url: '#', 
           maxFilesize: 1024,
           paramName: "book",
           acceptedFiles: "application/pdf",
           autoQueue: false,});
    }

    const convertFormToJSON = (form) => {
        const array = $(form).serializeArray();
        const json = {};
        $.each(array, function () {
          json[this.name] = this.value || "";
        });
        return json;
      }

    const getFormReady = () => {
        $("#authorList").html("")
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
                $("#authorList").append("<option value = ''></option>")
                for (var i = 0; i < data.response.length; i ++){
                    $("#authorList").append("<option value = " + data.response[i].id + ">" + data.response[i].name + "</option>")
                }
            }
          })

          $("#genreList").html("")
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
                  $("#genreList").append("<option value = ''></option>")
                  for (var i = 0; i < data.response.length; i ++){
                      $("#genreList").append("<option value = " + data.response[i].id + ">" + data.response[i].name + "</option>")
                  }
              }
            })

            $("#tagList").html("")
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
                        $("#tagList").append("<input style = 'margin-right: 4px;' id = 'chooseTag' type = 'checkbox' value = " + data.response[i].id + ">" + "<label style = 'margin-right: 8px;'>" + data.response[i].name + "</label>")
                    }
                }
              })
    }

    const contains = (arr, elem) => {
        for(var i=0; i<arr.length; i++) {
            if(elem === arr[i]) {
                 return true
            }
        }
        return false;
     }

     const getExtension = (filename) => {
        var parts = filename.split('.');
        return parts[parts.length - 1];
      }

    $(document).ready(function(){

        $("#headlineRow").css({
            "border-bottom": "solid grey 2px",
            "margin-bottom": "20px"
        })

        $("#tagsForm").css({"display": "none"});

        initLogoDropper()
        initBookDropper()
        getFormReady()

        $("#bookCreationForm").on("submit", function(e){
            e.preventDefault()
            if (logofile == 1){
                setShowLogoAlertD(true)
                return
            }
            if (bookfile == 1){
                setShowBookAlertD(true)
                return
            }
            var tags = []
            $("input:checkbox[id=chooseTag]:checked").each(function(){
                tags.push($(this).val());
            });
            $("#tagsForm").val(tags)
            var form = $("#bookCreationForm")
            var fd = new FormData
            fd.append('dataDTO', JSON.stringify(convertFormToJSON(form)))
            fd.append('logo', logofile)
            fd.append('book', bookfile)
            setShowBookNameAlert(false)
            setShowDateAlert(false)
            setShowTagAlert(false)
            setShowDescriptionAlert(false)
            setShowGenreAlert(false)
            setShowAuthorAlert(false)
            setShowExistAlert(false)
            setShowWait(true)
            $.ajax({
                url: process.env.REACT_APP_SERVER_NAME + '/add/book',         
                method: 'post',             
                credentials: "same-origin",
                data: fd,
                processData: false,
                contentType: false,
                xhrFields:{
                  withCredentials: true
                },               
                success: function(data){
                    setShowWait(false)
                    setShowLogoAlertD(false)
                    setShowBookAlertD(false)
                    if (contains(data.response, "ERROR_DESCRIPTION_EMPTY")){
                        setShowDescriptionAlert(true)
                    }
                    if (contains(data.response, "ERROR_NAME_EMPTY")){
                        setShowBookNameAlert(true)
                    }
                    if (contains(data.response, "ERROR_AUTHOR_EMPTY")){
                        setShowAuthorAlert(true)
                    }
                    if (contains(data.response, "ERROR_GENRE_EMPTY")){
                        setShowGenreAlert(true)
                    }
                    if (contains(data.response, "ERROR_RELEASE_DATE_EMPTY")){
                        setShowDateAlert(true)
                    }
                    if (contains(data.response, "ERROR_TAGS_EMPTY")){
                        setShowTagAlert(true)
                    }
                    if (contains(data.response, "ERROR_NAME_EXIST")){
                        setShowExistAlert(true)
                    }
                    if (data.response == "SUCCESS"){
                        setShowWait(false)
                    }
                    //$("#logoPreview").attr("src", "data:image/png;base64," + data.response.logo)
                }
              })
        })

        logoDropzone.on("error", function (file, message) {
            if (message!="Upload canceled."){
                setShowLogoAlert(true)
                logoDropzone.removeFile(file)
            }
        })

        logoDropzone.on("addedfile", function (file) {
            logofile = file
            logoDropzone.removeFile(file)
            setShowLogoAlert(false)
            var ext = getExtension(logofile.name);
            switch (ext.toLowerCase()) {
                case 'png':
                    $("#logoPreview").attr("src", URL.createObjectURL(logofile))
                    $("#logoPreview").css({"height": "30vmin"})
                    $('#logoPreview').css({'margin-top':'10px'})
            }
        })

        bookDrozpone.on("error", function (file, message) {
            if (message!="Upload canceled."){
                setShowBookAlert(true)
                logoDropzone.removeFile(file)
            }
        })

        bookDrozpone.on("addedfile", function (file) {
            bookfile = file
            bookDrozpone.removeFile(file)
            setShowBookAlert(false)
            var ext = getExtension(bookfile.name);
            switch (ext.toLowerCase()) {
                case 'pdf':

                    $("#bookPreview").html("Наименование файла: " + bookfile.name)
            }
        })
    })

    return (
        <Container>
            <Row id = "headlineRow">
                <h1>Добавить книгу</h1>
            </Row>
            <Row>
                <Col xs = "3"></Col>
                <Col xs = "6">

                <Form id="bookCreationForm">

                <Form.Group className="mb-3" controlId="formAuthor">
                    <Form.Label>Название книги</Form.Label>

                    <Alert variant="danger" show={showBookNameAlert}>
                        <p id="AddAuthorError">
                            Введите название книги.
                        </p>
                    </Alert>

                    <Alert variant="danger" show={showNameExistAlert}>
                        <p id="AddAuthorError">
                            Книга с таким названием уже существует.
                        </p>
                    </Alert>

                    <Form.Control name = "name" autoComplete="off">
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAuthor">
                    <Form.Label>Обложка</Form.Label>

                    <Alert variant="danger" show={showLogoAlert}>
                        <p id="AddAuthorError">
                            Убедитесь, что формат обложки - PNG.
                        </p>
                    </Alert>

                    <Alert variant="danger" show={showLogoAlertD}>
                        <p id="AddAuthorError">
                            Загрузите обложку.
                        </p>
                    </Alert>

                    <div id = "logoDrozpone" className = "dropzone" name = "logo">
                    <div className="dz-message" data-dz-message><span>Выберете файл формат PNG для обложки</span></div>
                    </div>
                    <img id = "logoPreview" className="rounded mx-auto d-block"/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAuthor">
                    <Form.Label>Дата выхода</Form.Label>
                    <Alert variant="danger" show={showDateAlert}>
                        <p id="AddAuthorError">
                            Введите дату выхода книги. Формат год-месяц-число.
                        </p>
                    </Alert>
                    <Form.Control name = "releaseDate" autoComplete="off" placeholder="2005-12-25">
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAuthor">
                    <Form.Label>Описание</Form.Label>

                    <Alert variant="danger"show={showDescriptionAlert}>
                        <p id="AddAuthorError">
                            Введите описание книги.
                        </p>
                    </Alert>

                    <Form.Control name = "description" as="textarea" rows={3} autoComplete="off">
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAuthor">
                    <Form.Label>Автор</Form.Label>
                    
                    <Alert variant="danger" show={showAuthorAlert}>
                        <p id="AddAuthorError">
                            Выберете автора.
                        </p>
                    </Alert>

                    <Form.Select id = "authorList" name = "author">
                    </Form.Select>
                    <Button variant="primary" onClick={handleShowAuthor}>
                    Добавить автора
                    </Button>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAuthor">
                    <Form.Label>Жанр</Form.Label>

                    <Alert variant="danger" onClose={() => setShowGenreAlert(false)} show={showGenreAlert}>
                        <p id="AddAuthorError">
                            Выберете жанр.
                        </p>
                    </Alert>

                    <Form.Select id = "genreList" name = "bookGenre">
                    </Form.Select>
                    <Button variant="primary" onClick={handleShowGenre}>
                    Добавить жанр
                    </Button>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAuthor">
                    <Form.Label>Теги</Form.Label>
                    <Alert variant="danger" show={showTagAlert}>
                        <p id="AddAuthorError">
                            Выберите теги.
                        </p>
                    </Alert>
                    <div id = "tagList">
                    </div>
                    <Form.Control id = "tagsForm" name = "tags" autoComplete="off">
                    </Form.Control>
                    <Button variant="primary" onClick={handleShowTag}>
                    Добавить тег
                    </Button>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAuthor">
                    <Form.Label>Книга</Form.Label>

                    <Alert variant="danger" show={showBookAlert}>
                        <p id="AddAuthorError">
                            Убедитесь, что формат книги - PDF.
                        </p>
                    </Alert>

                    <Alert variant="danger" show={showBookDAlert}>
                        <p id="AddAuthorError">
                            Загрузите книгу.
                        </p>
                    </Alert>

                    <div id = "bookDrozpone" className = "dropzone" name = "book">
                    <div className="dz-message" data-dz-message><span>Загрузите книгу в формате PDF</span></div>
                    </div>
                    <p id = "bookPreview" className="rounded mx-auto d-block"/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Отправить
                </Button>
                </Form>
            
                <Modal show={showAuthor} backdrop = 'static' onHide={handleCloseAuthor} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Добавить автора</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AddAuthor closePanel = {handleCloseAuthor} updateAuthorList = {getFormReady}>
                        </AddAuthor>
                    </Modal.Body>
                </Modal>

                <Modal show={showGenre} backdrop = 'static' onHide={handleCloseGenre} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Добавить жанр</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AddBookGenre closePanel = {handleCloseGenre} updateGenreList = {getFormReady}>
                        </AddBookGenre>
                    </Modal.Body>
                </Modal>

                <Modal show={showTag} backdrop = 'static' onHide={handleCloseTag} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Добавить жанр</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AddBookTag closePanel = {handleCloseTag} updateTagList = {getFormReady}>
                        </AddBookTag>
                    </Modal.Body>
                </Modal>

                <Modal show={showWait} backdrop = 'static' centered>
                    <Modal.Header>
                    <Modal.Title>Подождите, ваша книга загружается...</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div className="preload">
                        <img className = "grid" src={preload} width="80" />
                    </div>
                    </Modal.Body>
                </Modal>
                </Col>
                <Col xs = "3"></Col>
            </Row>
        </Container>
    )
}

export default BookCreation