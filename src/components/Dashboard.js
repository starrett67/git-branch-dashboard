import React, { Component } from 'react'
import GithubData from '../data/Github'
import Repository from './Repository'
import Controls from './Controls'
import { HashLoader } from 'react-spinners'
import { css } from '@emotion/core'
import { MDBJumbotron, MDBContainer, MDBRow, MDBCol } from 'mdbreact'

const spinnerOverride = css`
display: block;
margin: 0 auto;
border-color: red;
`

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

  refreshRepos () {
    this.getRepos().then(r => this.setState({ repos: r }))
  }

  async getRepos () {
    const { data, topics, org, branches } = this.state
    console.log(`Getting Filtered Repos: ${topics}`)
    const repos = await data.getFilteredRepos(org, topics, branches)
    return repos
  }

  createPr (repo, src, dest) {
    this.state.data.createPullRequest(repo, src, dest)
      .then(data => window.open(data.html_url))
      .catch(data => window.alert(`Failed to open pull request for ${repo.name}. Check that there are commit to merge.`))
  }

  onSelectOrg (org) {
    this.setState({ org: org, repos: [] }, this.refreshRepos)
  }

  onChangeTopics (topic, add) {
    let topics = this.state.topics.slice()
    if (add) {
      topics.push(topic)
    } else {
      const index = topics.indexOf(topic)
      topics.splice(index, 1)
    }
    console.log(`Topics Changed: ${topics}`)
    this.setState({ topics: topics, repos: [] }, this.refreshRepos)
  }

  onChangeBranches (branch, add) {
    let branches = this.state.branches.slice()
    if (add) {
      branches.push(branch)
    } else {
      const index = branches.indexOf(branch)
      branches.splice(index, 1)
    }
    this.setState({ branches: branches, repos: [] }, this.refreshRepos)
  }

  componentWillMount () {
    this._asyncRequest = this.refreshRepos()
  }

  componentWillUnmount () {
    if (this._asyncRequest) {
      this._asyncRequest.cancel()
    }
  }

  renderRepo (r) {
    return (
      <Repository createPull={(r, s, d) => { this.createPr(r, s, d) }} key={r.name} repo={r} />
    )
  }

  renderRow () {
    if (this.state.repos.length > 1) {
      return this.state.repos.map(r => this.renderRepo(r))
    } else {
      return (
        <MDBJumbotron fluid>
          <MDBContainer className='text-center'>
            <HashLoader
              sizeUnit={'px'}
              size={180}
              color={'#6e5494'}
              css={spinnerOverride}
              loading
            />
          </MDBContainer>
        </MDBJumbotron>
      )
    }
  }

  render () {
    return (
      <MDBRow>
        <MDBCol className='text-center'>
          <Controls
            onSelectOrg={(org) => this.onSelectOrg(org)}
            org={this.state.org.toString()}
            orgs={[this.state.org.toString()]}
            branches={this.state.branches.slice()}
            topics={this.state.topics.slice()}
            onChangeBranches={(b, added) => { this.onChangeBranches(b, added) }}
            onChangeTopics={(t, added) => { this.onChangeTopics(t, added) }}
          />
          {this.renderRow()}
        </MDBCol>
      </MDBRow>
    )
  }
}

export default Dashboard
