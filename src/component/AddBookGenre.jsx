import { Form, Button, Alert} from "react-bootstrap";
import { useState } from "react";
import $ from "jquery";

const AddAuthor = (props) => {
    
    const [showGenreAlert, setShowBookGenreAlert] = useState(false);

    $(document).ready(function(){
        $("#genreCreationForm").submit(function(e){
            e.preventDefault()
            setShowBookGenreAlert(false)
            var form = $("#genreCreationForm")
            $("#AddGenreError").html("")
            $.ajax({
                url: process.env.REACT_APP_SERVER_NAME + '/add/book-genre',         
                method: 'post',             
                dataType: 'html',
                credentials: "same-origin",
                data: form.serialize(),
                xhrFields:{
                  withCredentials: true
                },               
                success: function(data){   
                    data = JSON.parse(data)
                    if (data.response == "ERROR_NAME_EMPTY"){
                        $("#AddGenreError").html("Нужно обязательно заполнить это поле")
                        setShowBookGenreAlert(true)
                    }
                    if (data.response == "ERROR_ALREADY_EXISTS"){
                        $("#AddGenreError").html("Такой жанр уже в списке")
                        setShowBookGenreAlert(true)
                    }
                    if (data.response == "SUCCESS"){
                        props.closePanel()
                        props.updateGenreList()
                    }
                }
              })
        })
    })

    return(
        <>
        <Alert variant="danger" onClose={() => setShowBookGenreAlert(false)} show={showGenreAlert}>
            <Alert.Heading>Во время выполнения действия произошла ошибка.</Alert.Heading>
            <p id="AddGenreError">
                
            </p>
        </Alert>
        <Form id="genreCreationForm">
            <Form.Group className="mb-3" controlId="formAuthor">
                <Form.Label>Название жанра</Form.Label>
                <Form.Control type="email" name="name" autoComplete="off" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Отправить
            </Button>
        </Form></>
    )
}

export default AddAuthor