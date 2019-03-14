import React, { Component } from 'react'
import GithubData from '../data/Github'

class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: new GithubData(props.token),
      org: 'RoomstoGoDigital',
      topics: ['lambda-edge'],
      user: props.user,
      repos: [],
      branches: ['master', 'staging', 'production']
    }
  }

  componentWillMount () {
    this._asyncRequest = this.getRepos().then(r => this.setState({ repos: r }))
  }

  componentWillUnmount () {
    if (this._asyncRequest) {
      this._asyncRequest.cancel()
    }
  }

  renderRepo (r) {
    const html = (<p key={r.name}>{r.full_name}</p>)
    return html
  }

  async getRepos () {
    const { data, topics, org, branches } = this.state
    const repos = await data.getFilteredRepos(org, topics, branches)
    return repos
  }

  render () {
    let page = (
      <div>
        <p>
                    Loading Repositories...
        </p>
      </div>
    )
    if (this.state.repos.length > 1) {
      page = (
        <div>
          {this.state.repos.map(this.renderRepo)}
        </div>
      )
    }
    return page
  }
}

export default Dashboard
