import React, { Component } from 'react'
import GithubData from '../data/Github'
import { HashLoader } from 'react-spinners'
import RepoRow from './RepoRow'

class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: new GithubData(props.token),
      org: 'RoomstoGoDigital',
      topics: ['roomstogo'],
      user: props.user,
      repos: [],
      branches: ['master', 'staging', 'production']
    }
  }

  async getRepos () {
    const { data, topics, org, branches } = this.state
    const repos = await data.getFilteredRepos(org, topics, branches)
    return repos
  }

  componentWillMount () {
    this._asyncRequest = this.getRepos().then(r => this.setState({ repos: r }))
  }

  componentWillUnmount () {
    if (this._asyncRequest) {
      this._asyncRequest.cancel()
    }
  }

  rederBranch (b) {

  }

  renderRepo (r) {
    const html = (
      <RepoRow key={r.name} repo={r} />
    )
    return html
  }

  render () {
    let page = (
      <div>
        <HashLoader
          sizeUnit={'px'}
          size={180}
          color={'#6e5494'}
          loading={(this.state.repos.length < 1)}
        />
      </div>
    )
    if (this.state.repos.length > 1) {
      page = (
        <div className='dashboard'>
          {this.state.repos.map(this.renderRepo)}
        </div>
      )
    }
    return page
  }
}

export default Dashboard
