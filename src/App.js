import React, { Component } from 'react'
import Github from './components/Github'
import Dashboard from './components/Dashboard'
import Cookies from 'universal-cookie'

import './App.css'

const cookies = new Cookies()

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      github: cookies.get('github') || null
    }
    console.log(this.state)
  }

  onSuccess (response) {
    cookies.set('github', response, { path: '/' })
    this.setState({ github: response })
  }

  onFailure (response) { console.log(response) }

  renderLogin () {
    if (this.state.github) {
      return (<Dashboard token={this.state.github._token.accessToken} user={this.state.github._profile.name} />)
    } else {
      return (<Github onSuccess={(res) => this.onSuccess(res)} onFailure={(res) => this.onFailure(res)} />)
    }
  }

  render () {
    return (
      <div className='wrapper'>
        <div className='container'>
          {this.renderLogin()}
        </div>
      </div>
    )
  }
}

export default App
