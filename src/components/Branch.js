import React from 'react'
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol
} from 'mdbreact'
import MergeButton from './MergeButton'

const Branch = ({ branch, mergableBranches, onMerge }) => {
  return (
    <MDBCard style={{ width: '85%', margin: '0 auto' }}>
      <MDBCardBody>
        <MDBCardTitle>{branch.name.toUpperCase()}</MDBCardTitle>
        <MDBRow className='text-left'>
          <MDBCol>
            <MDBRow>
              <MDBCol style={{ minWidth: '7rem', maxWidth: '7rem' }}>
                <MDBCardText>Commiter:</MDBCardText>
              </MDBCol>
              <MDBCol>
                <MDBCardText>{branch.commit.author.name}</MDBCardText>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol style={{ minWidth: '7rem', maxWidth: '7rem' }}>
                <MDBCardText>Date:</MDBCardText>
              </MDBCol>
              <MDBCol>
                <MDBCardText>{new Date(branch.commit.author.date).toLocaleString()}</MDBCardText>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol style={{ minWidth: '7rem', maxWidth: '7rem' }}>
                <MDBCardText>Message:</MDBCardText>
              </MDBCol>
              <MDBCol className='text-wrap'>
                <MDBCardText>{branch.commit.message}</MDBCardText>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
        <MDBRow className='mt-3'>
          {mergableBranches.map((o, index) => (
            <MergeButton key={`${branch.name}-${index}`} branch={branch} srcBranch={o} onMerge={onMerge} />
          ))}
        </MDBRow>
      </MDBCardBody>
    </MDBCard>
  )
}

export default Branch
