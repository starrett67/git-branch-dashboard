import React from 'react'
import Branch from './Branch'
import { MDBRow, MDBCol, MDBContainer } from 'mdbreact'

const Repository = ({ onMerge, repository, branchFilters }) => {
  const renderBranch = (branchName) => {
    const branch = repository[branchName]
    if (repository[branchName]) {
      return (
        <MDBCol size={`${Math.floor(12 / totalBranches())}`} className='flex-row' key={branch.name}>
          <Branch
            branch={branch}
            mergableBranches={mergableBranches(branch)}
            onMerge={(srcBranch, destBranch) => onMerge(repository, srcBranch, destBranch)}
          />
        </MDBCol>
      )
    } else {
      return (
        <MDBCol key={branchName} />
      )
    }
  }

  const totalBranches = () => {
    return branchFilters.filter(branch => !!repository[branch]).length
  }

  const mergableBranches = (targetBranch) => {
    return branchFilters.map(branchName => {
      let branch
      if (repository[branchName] && repository[branchName].name !== targetBranch.name) {
        branch = repository[branchName]
      }
      return branch
    }).filter(branch => !!branch)
  }

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol className='text-center mt-5'>
          <h1>
            <a href={repository.url}>{repository.name}</a>
          </h1>
        </MDBCol>
      </MDBRow>
      <MDBRow className='mb-5'>
        {branchFilters.map(branch => renderBranch(branch))}
      </MDBRow>
    </MDBContainer>
  )
}

export default Repository
