import React, { useEffect, useState } from 'react'
import Branch from './Branch'
import { MDBRow, MDBCol, MDBContainer } from 'mdbreact'

const Repository = ({ onMerge, repository, branchFilters, gitHubService }) => {
  const [branches, setBranches] = useState([])

  useEffect(() => {
    const getBranches = async () => {
      setBranches(await gitHubService.getRepoBranches(repository, branchFilters))
    }
    getBranches()
  }, [repository, branchFilters])

  const renderBranch = (branch) => {
    if (branch) {
      return (
        <MDBCol size={Math.floor(12 / totalBranches())} className='flex-row' key={branch.name}>
          <Branch
            branch={branch}
            mergableBranches={mergableBranches(branch)}
            onMerge={(srcBranch, destBranch) => onMerge(repository, srcBranch, destBranch)}
          />
        </MDBCol>
      )
    } else {
      return (
        <MDBCol />
      )
    }
  }

  const totalBranches = () => {
    return branches.filter(branch => !!branch).length
  }

  const loading = () => {
    const loading = !branches || branches.length === 0
    return loading
  }

  const mergableBranches = (branch) => {
    return branches.filter(repoBranch => repoBranch && repoBranch.name !== branch.name)
  }

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol className='text-center mt-5'>
          <h1>
            <a href={repository.html_url}>{repository.name}</a>
          </h1>
        </MDBCol>
      </MDBRow>
      <MDBRow className='mb-5'>
        {!loading() && branches.map(branch => renderBranch(branch))}
      </MDBRow>
    </MDBContainer>
  )
}

export default Repository
