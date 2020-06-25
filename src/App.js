import React from 'react';
import fetch from 'cross-fetch'
import { dateFormatWithMonthName } from './utils/functions'
import './App.css';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      user: null,
      id:"",
      isFetching: false,
      error: {
        message: null
      }
    }
  }

  cleanError(){

    this.setState({
      error: {message:null}
    })

  }

  cleanUser(){

    this.setState({
      user: null
    })

  }

  handleInputChange(event) {
    
    this.setState({
      [event.target.name]: event.target.value
    })
    
  }

  handleKeyEnterPress(event){
    if(event.key === "Enter"){
      this.fetchUserById(this.state.id)
    }
  }

  fetchUserById(id){

    if(!id || id===undefined || id===""){
      this.setState({
        error: {
          message: 'El id debe existir.'
        }
      })
      return;
    }

    if(isNaN(Number(id))){
      this.setState({
        error: {
          message: 'El id debe ser válido.'
        }
      })
      return;
    }

    this.setState({isFetching:true})

    fetch(`${process.env.REACT_APP_NODE_API_URL}/users/${id}`, {
      method: "GET",
      mode: "cors",
      credentials: "with-credentials",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    })
    .then(
      response => {
        if (response.ok) {
          return response.json();
        }
        if (response.status === 404 || response.status === 422 || response.status === 500 )
          return response.json().then(err => {
            throw err;
          });
      },
      error => {throw error}
    )
    .then(json => {
      this.setState({
        isFetching: false,
        user: json.data
      })
    })
    .catch(errors => {
      if(errors.status){
        this.setState({
          isFetching: false, 
          error: {
            message: errors.message
          }
        })
      }else{
        this.setState({
          isFetching: false, 
          error: errors
        })
      }
    });


  }

  render(){
    
    const { id, user, error, isFetching} = this.state;

    return (
      <div className="container register">
        {console.log(isFetching)}
        <div className="row">
            <div className="col-md-3 register-left"> 
                <img alt="logo" src={require('./logo-dark.png')} className="img-size"/>
                <p>Busca un usuario ingresando un ID y mira sus datos!</p>
            </div>
            <div className="col-md-9 register-right">
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                        <h3 className="register-heading">Búsqueda de usuarios</h3>
                        <div className="row register-form">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <input onKeyPress={(e) => this.handleKeyEnterPress(e)} value={id} onChange={e => this.handleInputChange(e)} name="id" type="text" className="form-control" placeholder="Ingrese el ID del usuario" />
                                    <p style={{fontSize: 15, marginLeft:5}}>Ej. 124531548</p>
                                    {
                                      (isFetching)&&
                                      <div class="spinner-border text-primary" role="status">
                                        <span class="sr-only">Loading...</span>
                                      </div>
                                    }
                                    {
                                      (error.message)&&
                                        <div className={`alert alert-warning alert-dismissible fade show`} role="alert">
                                          <strong>Ups, hubo un error</strong> {error.message}.
                                          <button onClick={() => this.cleanError()} type="button" className ="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                          </button>
                                        </div>
                                    }
                                    {
                                      (user)&&
                                      <div className={`alert alert-info alert-dismissible fade show`} role="alert">
                                        <strong>Usuario encontrado</strong>.
                                        <button onClick={()=> this.cleanUser()} type="button" className ="close" data-dismiss="alert" aria-label="Close">
                                          <span aria-hidden="true">&times;</span>
                                        </button>
                                        <div className="form-group">
                                          <br></br>
                                          <p>NAME/S URNAME: {user.name + user.surname}</p>
                                          <p>BIRTHDAY: {dateFormatWithMonthName(user.birthday)}</p>
                                          <p>SCORING: {user.scoring.approved? 'Aprobado': 'No Aprobado'}</p>
                                          <p>CUIT: {user.cuit}</p>
                                        </div>
                                      </div>
                                    }
                                </div>
                                <input onClick={()=>this.fetchUserById(id)} type="submit" className="btnRegister"  value="Buscar"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="text-right footer-design ">Realizado por: 
          <p style={{color:"black"}}>Jeferson J. Alvarado C. 
            <br></br>© 2020 Copyright</p>  
          <p></p>
        </div>
      </div>
    );
  }

}

export default App;
