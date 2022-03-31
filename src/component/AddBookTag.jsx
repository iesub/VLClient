import { Form, Button, Alert} from "react-bootstrap";
import { useState } from "react";
import $ from "jquery";

const AddAuthor = (props) => {
    
    const [showTagAlert, setShowBookTagAlert] = useState(false);

    $(document).ready(function(){
        $("#tagForm").submit(function(e){
            e.preventDefault()
            setShowBookTagAlert(false)
            var form = $("#tagForm")
            $("#AddTagError").html("")
            $.ajax({
                url: process.env.REACT_APP_SERVER_NAME + '/add/book-tag',         
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
                        $("#AddTagError").html("Нужно обязательно заполнить это поле")
                        setShowBookTagAlert(true)
                    }
                    if (data.response == "ERROR_ALREADY_EXISTS"){
                        $("#AddTagError").html("Такой тег уже в списке")
                        setShowBookTagAlert(true)
                    }
                    if (data.response == "SUCCESS"){
                        props.closePanel()
                        props.updateTagList()
                    }
                }
              })
        })
    })

    return(
        <>
        <Alert variant="danger" onClose={() => setShowBookTagAlert(false)} show={showTagAlert}>
            <Alert.Heading>Во время выполнения действия произошла ошибка.</Alert.Heading>
            <p id="AddTagError">
                
            </p>
        </Alert>
        <Form id="tagForm">
            <Form.Group className="mb-3" controlId="formAuthor">
                <Form.Label>Наименование тега</Form.Label>
                <Form.Control type="email" name="name" autoComplete="off" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Отправить
            </Button>
        </Form></>
    )
}

export default AddAuthor