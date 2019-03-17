import React, { Component } from 'react'
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol } from 'mdbreact'

class Branch extends Component {
  render () {
    return (
      <MDBCard style={{ width: '30rem', margin: '0 auto' }}>
        <MDBCardBody>
          <MDBCardTitle>{this.props.branch.name.toUpperCase()}</MDBCardTitle>
          <MDBRow className='text-left'>
            <MDBCol>
              <MDBRow>
                <MDBCol size='3'>
                  <MDBCardText>Commiter:</MDBCardText>
                </MDBCol>
                <MDBCol>
                  <MDBCardText>{this.props.branch.commit.author.name}</MDBCardText>
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol size='3'>
                  <MDBCardText>Date:</MDBCardText>
                </MDBCol>
                <MDBCol>
                  <MDBCardText>{this.props.branch.commit.author.date}</MDBCardText>
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol size='3'>
                  <MDBCardText>Message:</MDBCardText>
                </MDBCol>
                <MDBCol className='text-truncate'>
                  <MDBCardText>{this.props.branch.commit.message}</MDBCardText>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
          <MDBRow className='mt-3'>
            {this.props.otherBranches.map(o => (
              <MDBCol>
                <MDBBtn
                  className='text-truncate'
                  onClick={() => { this.props.onMerge(o, this.props.branch) }}
                >
                 Merge {o.name}
                </MDBBtn>
              </MDBCol>
            ))}
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    )
  }
}

export default Branch
