import React, { useEffect, useState } from 'react'
import Github from './components/Github'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import Cookies from 'universal-cookie'
import { MDBContainer, MDBRow, MDBCol } from 'mdbreact'

import './App.css'

const cookies = new Cookies()

const App = () => {
  const [githubToken, setGithubToken] = useState(cookies.get('github') || null)

  useEffect(() => {
    cookies.set('github', githubToken)
  }, [githubToken])

  const onSuccess = (response) => {
    setGithubToken(response)
  }

  const handleFailure = (err) => {
    setGithubToken(null)
    cookies.remove('github')
    alert(`Failed to authorize github: ${err.message}`)
  }

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol>
          <Header />
        </MDBCol>
      </MDBRow>
      <MDBRow className='mt-1'>
        <MDBCol className='text-center'>
          {githubToken &&
            <Dashboard githubFailure={handleFailure} token={githubToken} />}
          {!githubToken &&
            <Github onSuccess={onSuccess} onFailure={handleFailure} />}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  )
}
export default App
