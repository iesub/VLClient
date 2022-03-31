import { Container, Row, Col, Button, Modal, Form, Alert, Pagination } from "react-bootstrap"
import $ from "jquery";
import { setInit } from "../actions/PaginationActions";
import { connect } from "react-redux";
import BookHomePreviewBox from "./BookHomePreviewBox";

const Home = (props) => {
    
    const paginationItems = []
    var beforeEllipsis = false;
    var afterEllipsis = false;

    const pagToFirst = () => {
        props.setInit({
            pageNumber: 1,
            pageAmount: props.pagInfo.pageAmount,
            checked: "true"
        })
    }

    const pagNext = () => {
        props.setInit({
            pageNumber: props.pagInfo.pageNumber + 1,
            pageAmount: props.pagInfo.pageAmount,
            checked: "true"
        })
    }

    const pagPrev = () => {
        props.setInit({
            pageNumber: props.pagInfo.pageNumber - 1,
            pageAmount: props.pagInfo.pageAmount,
            checked: "true"
        })
    }

    const pagLast = () => {
        props.setInit({
            pageNumber: props.pagInfo.pageAmount,
            pageAmount: props.pagInfo.pageAmount,
            checked: "true"
        })
    }

    const pagTo = (e, number) => {
        props.setInit({
            pageNumber: number,
            pageAmount: props.pagInfo.pageAmount,
            checked: "true"
        })
    }
    
    paginationItems.push(
        <Pagination.First key = {"first"} onClick={pagToFirst}/>
    )

    if (props.pagInfo.pageNumber == 1){
        paginationItems.push(
            <Pagination.Prev key = {"prev"} disabled/>
        )
    } else {
        paginationItems.push(
            <Pagination.Prev key = {"prev"} onClick={pagPrev}/>
        )
    }

    var active = props.pagInfo.pageNumber
    if (props.pagInfo.pageAmount <= 5){
        for (let number = 1; number <= props.pagInfo.pageAmount; number++) {                
            paginationItems.push(
              <Pagination.Item key={number} active={number === active}>
                {number}
              </Pagination.Item>
            );
        }
    }

    if (props.pagInfo.pageAmount > 5){
        for (let number = 1; number <= props.pagInfo.pageAmount; number++) {
            if (number <= active - 3 && !beforeEllipsis){              
            paginationItems.push(
                <Pagination.Ellipsis key = {"el1"}/>
            );
            beforeEllipsis = true;
            }
            if (active-2 <= number && number <= active+2){
                paginationItems.push(
                <Pagination.Item key={number} onClick={((e) => pagTo(e, number))} active={number === active}>
                {number}
                </Pagination.Item> 
                )
            }
            if (number >= active + 3 && !afterEllipsis){
                paginationItems.push(
                <Pagination.Ellipsis key = {"el2"} />
                )
                afterEllipsis = true;
            }
        }
    }

    if (props.pagInfo.pageNumber == props.pagInfo.pageAmount){
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

    const previewBooks = (data) => {
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

    $(document).ready(function(){
        $("#headlineRow").css({
            "border-bottom": "solid grey 2px",
            "margin-bottom": "20px"
        })

        if (!props.pagInfo.checked){
        $.ajax({
            url: process.env.REACT_APP_SERVER_NAME + '/get/book-count',         
            method: 'get',             
            dataType: 'html',
            credentials: "same-origin",
            xhrFields:{
              withCredentials: true
            },               
            success: function(data){   
                data = JSON.parse(data)
                var pagNumber = Math.ceil(data.response / 20)
                if (pagNumber==0){return}
                var payload = {
                    pageNumber: 1,
                    pageAmount: pagNumber,
                    checked: "true"
                }
                props.setInit(payload)
            }
          })
        }

        if (props.pagInfo.checked){
            $.ajax({
                url: process.env.REACT_APP_SERVER_NAME + '/get/book-list',         
                method: 'get',             
                dataType: 'html',
                data: {"offset": props.pagInfo.pageNumber},
                credentials: "same-origin",
                xhrFields:{
                  withCredentials: true
                },               
                success: function(data){   
                    data = JSON.parse(data)
                    console.log(data.response)
                    previewBooks(data)
                    $(".imagePreview").css({"width": "25vmin"})
                    $(".pagination").css({"margin-top": "20px"})
                    $(".bookrow").css({"margin-top": "20px"})
                }
              })
            }
    })


    return(
    <Container>
        <Row id = "headlineRow">
            <h1>Главная</h1>
        </Row>

        <Row>
            <Col xs = "4">

            </Col>

            <Col xs = "8" id = "bookList">
                
            </Col>
        </Row>

        <Row>
            <Col>
                <Pagination className="justify-content-center pagination">
                    {paginationItems}
                </Pagination>
            </Col>
        </Row>
    </Container>
    )
}

const mapStateToProps = (store) => {
    return {
        pagInfo: store.pagData
    }
}
  
var mapDispatchToProps = dispatch => {
    return {
      setInit: payload => dispatch(setInit(payload)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)
