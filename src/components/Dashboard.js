import React, { useEffect, useState } from 'react'
import GithubDataV2 from '../data/GithubV2'
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
  const [gitHubService, setGitHubService] = useState(new GithubDataV2(token, githubFailure))
  const [selectedOrg, setSelectedOrg] = useState('')
  const [selectedSortBy, setSelectedSortBy] = useState('')
  const [orgList, setOrgList] = useState([])
  const [topicFilters, setTopicFilters] = useState(config.defaultTopicFilters)
  const [keywordFilter, setKeywordFilter] = useState('')
  const [branchFilters, setBranchFilters] = useState(config.defaultBranchFilters)
  const [repoList, setRepoList] = useState([])
  const [repoBranches, setRepoBranches] = useState(new Map())
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
      const githubRepos = await gitHubService.getRepos({ org: selectedOrg, keyword: keywordFilter, topics: topicFilters })
      setRepoList(githubRepos)
    }
    setRepoList([])
    setRepoBranches(new Map())
    selectedOrg && !loading && fetchAndSetRepos()
  }, [selectedOrg, topicFilters, branchFilters, keywordFilter])

  // If branch filters change and sort branch is not available set to empty
  useEffect(() => {
    if (!branchFilters.includes(selectedSortBy)) {
      setSelectedSortBy('')
    }
  }, [branchFilters])

  // Sort repolistories by an updated branch
  useEffect(() => {
    sortRepoList()
  }, [selectedSortBy, repoBranches])

  // Github Token Change
  useEffect(() => setGitHubService(new GithubDataV2(token, githubFailure)), [token])

  const onMerge = async (repository, srcBranch, destBranch) => {
    console.log(`Creating Pull Request: ${repository.name}`)
    console.log(`${srcBranch.name}  =====> ${destBranch.name}`)
    try {
      const response = await gitHubService.createPullRequest(repository, srcBranch, destBranch)
      window.open(response.html_url)
    } catch (err) {
      window.alert(`Failed to open pull request for ${repository.name}. Check that there are commit to merge.`)
    }
  }

  const sortRepoList = () => {
    console.log('sorting counts', repoList.length, repoBranches.size)
    if (repoList.length > 0 && repoBranches.size === repoList.length) {
      let sortedRepoList = []
      if (selectedSortBy) {
        sortedRepoList = repoList.slice().sort((r1, r2) => sortByBranch(r1, r2, selectedSortBy))
      } else {
        sortedRepoList = repoList.slice().sort((r1, r2) => new Date(r2.updated_at) - new Date(r1.updated_at))
      }
      if (sortedRepoList !== repoList) {
        setRepoList(sortedRepoList)
      }
    }
  }

  const sortByBranch = (repoa, repob, branch) => {
    const repoABranches = repoBranches.get(repoa.name)
    const repoBBranches = repoBranches.get(repob.name)
    const repoAUpdated = repoABranches && repoABranches[branch] && repoABranches[branch].commit.commit.author.date
    const repoBUpdated = repoBBranches && repoBBranches[branch] && repoBBranches[branch].commit.commit.author.date
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

  const addRepoBranches = (branchName, branches) => {
    const branchObj = {}
    branches.forEach(branch => { branchObj[branch.name] = branch })
    repoBranches.set(branchName, branchObj)
    sortRepoList()
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
            gitHubService={gitHubService}
            addRepoBranches={addRepoBranches}
          />
        ))}
        {(!repoList.length || repoList.length < 1) && (
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
