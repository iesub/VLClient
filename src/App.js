import $ from "jquery";
import './css/App.css';

function allo(){
  $.ajax({
    url: 'http://192.168.1.192:13378/login',         
    method: 'post',
    data: {username: "iesubbotin@gmail.com", password: "123"},             
    dataType: 'html',
    credentials: "same-origin",          
    success: function(data){   
      $("#cont").append(data);           
    }
  });
}

function allo1(){
  $.ajax({
    url: 'http://192.168.1.192:13378/',         
    method: 'get',
    data: {username: "iesubbotin@gmail.com", password: "123"},             
    dataType: 'html',          
    success: function(data){   
      $("#cont").append(data);           
    }
  });
}

const App = () => {

  allo()

  return(
    <div id = "cont">
    </div>
  )
}

export default App;