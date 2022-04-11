import { useState } from "react";
import { Row, Col,Modal} from "react-bootstrap"

const ModalBookShow = (props) => {
    const [showBookModal, setShowBookModal] = useState(true)

    const hide = () => {
        setShowBookModal(false)
    }

    return (
        <Modal key = {'modal' + props.i} id = {'modal' + props.i} onHide = {hide} show = {showBookModal} backdrop = 'static' centered size="lg">
        <Modal.Header closeButton>
        <Modal.Title>{props.value.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
        <Row>
            <Col xl = "5"><img  className = 'img-fluid imagePreview' src={'data:image/png;base64,' + props.value.logo} /></Col>
            <Col xl = "7">
            <h5>Описание:</h5>
            <label>{props.value.description}</label>
            </Col>
        </Row>
        <Row>
        <Col xl = "6">
            <Row>
            <label><strong>Автор: </strong> {props.value.author.name} </label>
            </Row>
            <Row>
            <label><strong>Жанр: </strong> {props.value.bookGenre.name} </label>
            </Row>
            <Row>
            <label><strong>Дата выхода: </strong> {props.dateString} </label>
            </Row>
        </Col>
        <Col xl = "6">
        <strong>Теги: </strong>
        <label> {props.tags} </label>
        </Col>
        </Row>
        </Modal.Body>
    </Modal>
    )
}

export default ModalBookShow