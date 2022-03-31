import { Container, Row, Col, Button, Modal, Form, Alert, Pagination } from "react-bootstrap"
import $ from "jquery";

const BookHomePreviewBox = (props) => {

    $("#imagePreview").css({"height": "30vmin"})

    return (
        <Col>
            <Row>
                <img id = "imagePreview" src = {"data:image/png;base64," + props.logo}/>
            </Row>
            <Row>
                <label>Название: {props.name}</label>
            </Row>
            <Row>
                <label>Автор: {props.author.name}</label>
            </Row>
            <Row>
                <label>Жанр: {props.bookGenre.name}</label>
            </Row>
        </Col>
    )
}

export default BookHomePreviewBox