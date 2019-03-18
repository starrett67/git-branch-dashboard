import React, { Component } from 'react'
import Branch from './Branch'
import { MDBRow, MDBCol, MDBContainer } from 'mdbreact'

class Repository extends Component {
  getRepoName (repo) {
    return repo.full_name.replace(`${repo.owner.login}/`, '')
  }

  renderBranch (branch) {
    if (branch) {
      const otherBranches = this.props.repo.branches.filter(b => b && b.name !== branch.name)
      return (
        <MDBCol key={branch.name}>
          <Branch
            branch={branch}
            otherBranches={otherBranches}
            onMerge={(src, dest) => this.createPullRequest(src, dest)}
          />
        </MDBCol>
      )
    } else {
      return (
        <MDBCol />
      )
    }
  }

  createPullRequest (srcBranch, destBranch) {
    console.log(`Creating Pull Request: ${this.props.repo.name}`)
    console.log(`${srcBranch.name}  =====> ${destBranch.name}`)
    this.props.createPull(this.props.repo, srcBranch, destBranch)
  }

  render () {
    return (
      <MDBContainer fluid>
        <MDBRow>
          <MDBCol className='text-center mt-5'>
            <a href={this.props.repo.html_url}><h1>{this.props.repo.name}</h1></a>
          </MDBCol>
        </MDBRow>
        <MDBRow className='mb-5'>
          {this.props.repo.branches.map(b => this.renderBranch(b))}
        </MDBRow>
      </MDBContainer>
    )
  }
}

export default Repository