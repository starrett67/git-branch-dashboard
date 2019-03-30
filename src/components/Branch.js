import React, { Component } from 'react'
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol } from 'mdbreact'

class Branch extends Component {
  mergeButton (srcBranch) {
    const srcTree = srcBranch.commit.commit.tree.sha
    const destTree = this.props.branch.commit.commit.tree.sha
    return (
      <MDBCol>
        <MDBBtn
          className='text-truncate'
          disabled={(srcTree === destTree)}
          onClick={() => { this.props.onMerge(srcBranch, this.props.branch) }}
        >
          Merge {srcBranch.name}
        </MDBBtn>
      </MDBCol>
    )
  }

  render () {
    return (
      <MDBCard style={{ width: '85%', margin: '0 auto' }}>
        <MDBCardBody>
          <MDBCardTitle>{this.props.branch.name.toUpperCase()}</MDBCardTitle>
          <MDBRow className='text-left'>
            <MDBCol>
              <MDBRow>
                <MDBCol style={{ minWidth: '7rem', maxWidth: '7rem' }}>
                  <MDBCardText>Commiter:</MDBCardText>
                </MDBCol>
                <MDBCol>
                  <MDBCardText>{this.props.branch.commit.commit.author.name}</MDBCardText>
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol style={{ minWidth: '7rem', maxWidth: '7rem' }}>
                  <MDBCardText>Date:</MDBCardText>
                </MDBCol>
                <MDBCol>
                  <MDBCardText>{new Date(this.props.branch.commit.commit.author.date).toLocaleString()}</MDBCardText>
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol style={{ minWidth: '7rem', maxWidth: '7rem' }}>
                  <MDBCardText>Message:</MDBCardText>
                </MDBCol>
                <MDBCol className='text-wrap'>
                  <MDBCardText>{this.props.branch.commit.commit.message}</MDBCardText>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
          <MDBRow className='mt-3'>
            {this.props.otherBranches.map(o => { return this.mergeButton(o) })}
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    )
  }
}

export default Branch
