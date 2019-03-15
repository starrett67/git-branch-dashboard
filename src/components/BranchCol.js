import React, { Component } from 'react'

class BranchCol extends Component {
  render () {
    return (
      <div className='col-3' key={this.props.branch.name}>
        <ul>
          <li key='commiter'>{this.props.branch.commit.author.name}</li>
          <li key='date'>{this.props.branch.commit.author.date}</li>
          <li key='message'>{this.props.branch.commit.message}</li>
        </ul>
      </div>
    )
  }
}

export default BranchCol
