import React from 'react'
import { MDBJumbotron, MDBContainer } from 'mdbreact'

const Header = () => {
  return (
    <MDBJumbotron fluid>
      <MDBContainer className='text-center'>
        <h1 className='display-4'>Branch Dashboard</h1>
      </MDBContainer>
    </MDBJumbotron>
  )
}

export default Header
