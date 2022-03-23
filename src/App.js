import $ from "jquery";
import './css/App.css';
import Header from "./component/Header"

function allo(){
  $.ajax({
    url: 'http://localhost:13378/login',         
    method: 'post',
    data: {username: "iesubbotin@gmail.com", password: "123", rememberme: true},             
    dataType: 'html',
    credentials: "same-origin",
    xhrFields:{
      withCredentials: true
    },               
    success: function(data){   
      $("#cont").append(data);           
    }
  });
}

function allo1(){
  $.ajax({
    url: 'http://localhost:13378/logout',         
    method: 'get',
    data: {username: "iesubbotin@gmail.com", password: "123"},             
    dataType: 'html',  
    credentials: "same-origin",
    xhrFields:{
      withCredentials: true
    },           
    success: function(data){   
      $("#cont").append(data);           
    }
  });
}

const App = () => {
  return(
    <Header></Header>
  )
}

export default App;
