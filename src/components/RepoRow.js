import React, { Component } from 'react'
import BranchCol from './BranchCol'

class RepoRow extends Component {
  getRepoName (repo) {
    return repo.full_name.replace(`${repo.owner.login}/`, '')
  }

  renderBranch (branch) {
    if (branch) {
      return (
        <BranchCol key={branch.name} branch={branch} />
      )
    }
    return (
      <div className='col-3'>NAN</div>
    )
  }

  render () {
    return (
      <div className='row' key={this.props.repo.full_name}>
        <div className='col-3' key={this.props.repo.name}>
          {this.getRepoName(this.props.repo)}
        </div>
        {this.props.repo.branches.map(this.renderBranch)}
      </div>
    )
  }
}

export default RepoRow
