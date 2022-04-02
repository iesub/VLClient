import { Form, Button, Alert} from "react-bootstrap";
import { useState } from "react";
import $ from "jquery";

const AddAuthor = (props) => {
    
    const [show, setShowAuthorAlert] = useState(false);

    $(document).ready(function(){
        $("#authorCreationForm").submit(function(e){
            e.preventDefault()
            setShowAuthorAlert(false)
            var form = $("#authorCreationForm")
            $("#AddAuthorError").html("")
            $.ajax({
                url: process.env.REACT_APP_SERVER_NAME + '/add/author',         
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
                        $("#AddAuthorError").html("Имя автора не может быть пустым")
                        setShowAuthorAlert(true)
                    }
                    if (data.response == "ERROR_ALREADY_EXISTS"){
                        $("#AddAuthorError").html("Автор с таким именем уже есть в списке")
                        setShowAuthorAlert(true)
                    }
                    if (data.response == "SUCCESS"){
                        props.closePanel()
                        props.updateAuthorList()
                    }
                }
              })
        })
    })

    return(
        <>
        <Alert variant="danger" onClose={() => setShowAuthorAlert(false)} show={show}>
            <Alert.Heading>Во время выполнения действия произошла ошибка.</Alert.Heading>
            <p id="AddAuthorError">
                
            </p>
        </Alert>
        <Form id="authorCreationForm">
            <Form.Group className="mb-3" controlId="formAuthor">
                <Form.Label>Имя автора</Form.Label>
                <Form.Control type="text" name="name" autoComplete="off" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Отправить
            </Button>
        </Form></>
    )
}

export default AddAuthor