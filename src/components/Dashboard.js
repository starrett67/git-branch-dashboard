import React, { useEffect, useState } from 'react'
import GithubDataV2 from '../data/GithubV2'
import GithubDataV4 from '../data/GithubV4'
import Repository from './Repository'
import Controls from './Controls'
import { HashLoader } from 'react-spinners'
import { css } from '@emotion/core'
import { MDBJumbotron, MDBContainer, MDBRow, MDBCol } from 'mdbreact'
import config from '../config'

const spinnerOverride = css`
display: block;
margin: 0 auto;
border-color: red;
`

const DashBoard = ({ token, githubFailure }) => {
  const githubV4 = new GithubDataV4(token)
  const [gitHubService, setGitHubService] = useState(new GithubDataV2(token, githubFailure))
  const [selectedOrg, setSelectedOrg] = useState('')
  const [selectedSortBy, setSelectedSortBy] = useState('')
  const [orgList, setOrgList] = useState([])
  const [topicFilters, setTopicFilters] = useState(config.defaultTopicFilters)
  const [keywordFilter, setKeywordFilter] = useState('')
  const [branchFilters, setBranchFilters] = useState(config.defaultBranchFilters)
  const [repoList, setRepoList] = useState([])
  const [totalRepoList, setTotalRepoList] = useState([])
  const [loading, setLoading] = useState(false)

  // Initial Load
  useEffect(() => {
    const fetchAndSetOrgs = async () => {
      const gitHubOrgs = await gitHubService.getOrganizations() || []
      const user = await gitHubService.getUser() || {}
      if (gitHubOrgs && gitHubOrgs.length > 0) {
        setSelectedOrg(gitHubOrgs[0])
      } else if (user) {
        setSelectedOrg(user.login)
      }
      setOrgList([...gitHubOrgs, user.login])
    }
    fetchAndSetOrgs()
  }, [])

  // Selected Org or Topic Change
  useEffect(() => {
    const fetchAndSetRepos = async () => {
      setLoading(true)
      let repos = await githubV4.getOrgRepos({ org: selectedOrg, keyword: keywordFilter, topics: topicFilters, branches: branchFilters })
      setTotalRepoList(sortRepoList(repos.slice()))
      setLoading(false)
      repos = applyKeywordFilter(repos)
      repos = applyTopicFilters(repos)
      setRepoList(sortRepoList(first50(repos)))
    }
    setRepoList([])
    setTotalRepoList([])
    selectedOrg && !loading && fetchAndSetRepos()
  }, [selectedOrg, branchFilters])

  // Filter repo list by keyword and topics
  useEffect(() => {
    let repos = applyKeywordFilter(totalRepoList)
    repos = applyTopicFilters(repos)
    setRepoList(first50(repos))
  }, [keywordFilter, topicFilters])

  // If branch filters change and sort branch is not available set to empty
  useEffect(() => {
    if (!branchFilters.includes(selectedSortBy)) {
      setSelectedSortBy('')
    }
  }, [branchFilters])

  // Sort repolistories by an updated branch
  useEffect(() => {
    setRepoList(sortRepoList(repoList))
  }, [selectedSortBy])

  // Github Token Change
  useEffect(() => setGitHubService(new GithubDataV2(token, githubFailure)), [token])

  const first50 = (list) => {
    if (list.length > 50) {
      list = list.slice(0, 50)
    }
    return list
  }

  const applyTopicFilters = (repos) => {
    if (topicFilters.length > 0) {
      repos = repos.filter(repo => {
        const topics = repo.repositoryTopics.topics.map(topic => topic.topic.name)
        const containsTopics = topicFilters.filter(topicName => topics.includes(topicName)).length === topicFilters.length
        return containsTopics
      })
    }
    return repos
  }

  const applyKeywordFilter = (repos) => {
    return repos.filter(repo => repo.name.includes(keywordFilter))
  }

  const onMerge = async (repository, srcBranch, destBranch) => {
    console.log(`Creating Pull Request: ${repository.name}`)
    console.log(`${srcBranch.name}  =====> ${destBranch.name}`)
    try {
      const response = await gitHubService.createPullRequest(selectedOrg, repository, srcBranch, destBranch)
      window.open(response.html_url)
    } catch (err) {
      window.alert(`Failed to open pull request for ${repository.name}. Check that there are commit to merge.`)
    }
  }

  const sortRepoList = (repos) => {
    let sortedRepoList = []
    if (repos.length > 0) {
      if (selectedSortBy) {
        sortedRepoList = repos.slice().sort((r1, r2) => sortByBranch(r1, r2, selectedSortBy))
      } else {
        sortedRepoList = repos.slice().sort((r1, r2) => new Date(r2.updatedAt) - new Date(r1.updatedAt))
      }
    }
    return sortedRepoList
  }

  const sortByBranch = (repoa, repob, branch) => {
    const repoAUpdated = repoa && repoa[branch] && repoa[branch].commit.author.date
    const repoBUpdated = repob && repob[branch] && repob[branch].commit.author.date
    if (!repoAUpdated) { return 0 }
    if (!repoBUpdated) { return -1 }
    return new Date(repoBUpdated) - new Date(repoAUpdated)
  }

  const onChangeTopics = (newTopic, add) => {
    add && setTopicFilters([...topicFilters, newTopic])
    !add && setTopicFilters(topicFilters.filter(t => t !== newTopic))
  }

  const onChangeBranches = (newBranch, add) => {
    add && setBranchFilters([...branchFilters, newBranch])
    !add && setBranchFilters(branchFilters.filter(b => b !== newBranch))
  }

  return (
    <MDBRow>
      <MDBCol className='text-center'>
        <Controls
          onSelectOrg={setSelectedOrg}
          selectedOrg={selectedOrg}
          selectedSortBy={selectedSortBy}
          orgList={orgList}
          branchFilters={branchFilters}
          topicFilters={topicFilters}
          onChangeBranches={onChangeBranches}
          onChangeTopics={onChangeTopics}
          onChangeKeyword={setKeywordFilter}
          onSortChange={setSelectedSortBy}
        />
        {repoList.length > 0 && repoList.map(repository => (
          <Repository
            onMerge={onMerge}
            key={repository.name}
            repository={repository}
            branchFilters={branchFilters}
          />
        ))}
        {(loading) && (
          <MDBJumbotron fluid>
            <MDBContainer className='text-center'>
              <HashLoader
                sizeUnit='px'
                size={180}
                color='#6e5494'
                css={spinnerOverride}
                loading
              />
            </MDBContainer>
          </MDBJumbotron>
        )}
      </MDBCol>
    </MDBRow>
  )
}

export default DashBoard
