import React, { Component } from 'react';
import Login from "./components/Login"
import './App.css';

import DashBoard from './containers /Dashboard';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import CreateAccount from "./components/CreateAccount"

class App extends Component {
  state = {
    newUser: {
      firstName: "",
      lastName: "",
      username: "",
      role: 0,
      email: "",
      password: "",
    },
    existingUser: {
      email: "",
      password: ""
    },
    loading: true,
    currentUser: null
  }

  updateUser = (user) => {
    this.setState({
      currentUser: user,
      loading: false
    })
  }




  componentDidMount() {
    if (localStorage.getItem("token")) {
      fetch('http://localhost:3000/users', {
        headers: {
          "Authentication": `Bearer ${localStorage.getItem("token")}`
        }
      }).then(res => res.json())
        .then(user => {
          this.updateUser(user)
        })
    } else {
      this.setState({ loading: true })
    }
    fetch("http://localhost:3000/locations")
      .then(res => res.json())
      .then(resp => this.setState({ apiKey: resp }))
  }


  handleUserLogOut = (event) => {
    event.preventDefault()
    const r = window.confirm("Do you really want to Sign Out?")
    if (r == true) {
      // fetch('http://localhost:3000/users/sign_out')
      // .then(res => console.log(res))
      localStorage.clear()
      this.setState({ currentUser: null })

    }
  }


  handleCreateAccountSubmit = (event) => {
    event.preventDefault()

    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: this.state.newUser })
    })
      .then(res => res.json())
      .then(res => this.setState({ currentUser: res }))
      .catch(e => console.error(e))

  }


  handleCreateAccountChange = (event) => {
    console.log(event.target.id, event.target.value)
    this.setState({
      newUser: {
        ...this.state.newUser,
        [event.target.id]: event.target.value
      }
    })

  }
  handleCreateAccountOwnerChange = (event) => {

    event.currentTarget.classList.length < 4 ?
      this.setState(
        {
          newUser: {
            ...this.state.newUser,
            role: 1
          }
        }) :
      this.setState(
        {
          newUser: {
            ...this.state.newUser,
            role: 0
          }
        })
  }

  handleLoginChange = (event) => {
    this.setState({
      existingUser: {
        ...this.state.existingUser,
        [event.target.id]: event.target.value
      }
    })
  }
  handleLoginSubmit = (event) => {
    event.preventDefault()

    fetch('http://localhost:3000/users/sign_in', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: 'application/json'
      },
      body: JSON.stringify({
        user: {
          email: this.state.existingUser.email,
          password: this.state.existingUser.password,
        }
      })
    })
      .then(response => {

        if (response.ok) {
          return response.json()

        } else {
          console.error("incorrect login info")
        }
      })
      .then(data => {
        if (data.authenticated) {
          localStorage.setItem("token", data.token)
          this.setState({ currentUser: data.user })
        } else {
          alert("Incorrect Email or Password")
        }
      }).catch((e) => console.error(e))
    // .then((jsonResponse) => {
    //   localStorage.setItem('jwt', jsonResponse.jwt)
    //   dispatch(setCurrentUser(jsonResponse.user))
    // })
  }



  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/login" />} />
            <Route exact path="/login" render={() => this.state.currentUser ? <Redirect to="/home" /> :
              <Login handleLoginChange={this.handleLoginChange} handleLoginSubmit={this.handleLoginSubmit} />} />
            <Route path="/register" render={() => <CreateAccount owner={this.state.owner} handleCreateAccountSubmit={this.handleCreateAccountSubmit} handleCreateAccountOwnerChange={this.handleCreateAccountOwnerChange} handleCreateAccountChange={this.handleCreateAccountChange} />} />
            <Route path="/home" render={() => this.state.currentUser ? <DashBoard apiKey={this.state.apiKey} user={this.state.currentUser} handleUserLogOut={this.handleUserLogOut} /> : <Redirect to="/login" />} />
          </Switch>
        </Router>
      </div>
    )
  }
}



export default App;
