import Octokit from '@octokit/rest'

const containsTopic = (repo, topics) => {
  let containsTopic = true
  if (!Array.isArray(repo.topics) || topics.find(t => !repo.topics.includes(t))) containsTopic = false
  return containsTopic
}

const sortBranches = (repo, branches) => {
  const sortedArr = []
  for (let branch of branches) {
    const match = repo.branches.find(b => branch === b.name)
    if (match) sortedArr.push(match)
  }
  repo.branches = sortedArr
}

const sortRepos = (repoA, repoB) => {
  try {
    const commitDateA = new Date(repoA.branches[0].commit.commit.author.date)
    const commitDateB = new Date(repoB.branches[0].commit.commit.author.date)
    if (commitDateA > commitDateB) return -1
    else return 1
  } catch (err) { return 0 }
}

export default class GithubData {
  constructor (token) {
    this.repos = []
    this.octokit = new Octokit({
      auth: `Bearer ${token}`
    })
  }

  resetRepos () {
    this.repos = []
  }

  async getOrganizations () {
    let orgs = await this.octokit.orgs.listForAuthenticatedUser()
    console.log(`Orgs: ${JSON.stringify(orgs.data, null, 2)}`)
    return orgs.data.map(o => o.login)
  }

  async getFilteredRepos (org, topics, branches) {
    this.apiCalls = 0
    console.log(`Staring to search Github for data... 404s are expected for missing branches.`)
    await this.getRepos(org)
    await this.getAllTopics()
    const filteredRepos = this.repos.filter(r => containsTopic(r, topics))
    await this.getReposBranches(filteredRepos, branches)
    filteredRepos.forEach(r => sortBranches(r, branches))
    filteredRepos.sort(sortRepos)
    console.log(`Total Calls: ${this.apiCalls}`)
    console.log(filteredRepos)
    return filteredRepos
  }

  async getRepos (org) {
    if (!this.repos.length > 0) {
      console.log('Getting Repos!')
      const repos = await this.octokit.repos.listForOrg({ org: org, per_page: 1000 })
      this.apiCalls++
      repos.data.forEach(r => {
        if (!r.archived) {
          this.repos.push(r)
        }
      })
    }
    return this.repos
  }
  getAllTopics () {
    const topicPromises = this.repos.map(r => {
      if (!r.topics) {
        return this.getTopics(r)
      }
      return Promise.resolve(r.topics)
    })
    return Promise.all(topicPromises)
  }

  async getTopics (repo) {
    console.log('Getting Topics!')
    const topics = await this.octokit.repos.listTopics({
      repo: repo.name,
      owner: repo.owner.login,
      headers: { accept: 'application/vnd.github.mercy-preview+json' }
    })
    this.apiCalls++
    repo.topics = topics.data.names
  }

  getReposBranches (repos, branches) {
    const branchPromises = repos.map(r => this.getRepoBranches(r, branches))
    return Promise.all(branchPromises)
  }

  async getRepoBranches (repo, branches) {
    if (!repo.branches || !Array.isArray(repo.branches)) {
      repo.branches = []
    }
    repo.branches = repo.branches.filter(b => branches.includes(b.name))
    const promises = branches.map(b => {
      const matchingBranch = repo.branches.find(branch => branch.name === b)
      if (!matchingBranch) {
        return this.getRepoBranch(repo, b)
      }
      return Promise.resolve()
    })
    return Promise.all(promises)
  }

  async getRepoBranch (repo, branch) {
    try {
      console.log('Getting Branch!')
      const resp = await this.octokit.repos.getBranch({ repo: repo.name, owner: repo.owner.login, branch: branch })
      this.apiCalls++
      repo.branches.push(resp.data)
    } catch (err) { }
  }

  async getPullRequest (repo, src, dest) {
    const pr = await this.octokit.pulls.list({
      repo: repo.name,
      owner: repo.owner.login,
      title: src.commit.commit.message,
      head: src.name,
      base: dest.name,
      state: 'open'
    })
    return pr.data[0]
  }

  async createPullRequest (repo, src, dest) {
    try {
      const pr = await this.octokit.pulls.create({
        repo: repo.name,
        owner: repo.owner.login,
        title: src.commit.commit.message,
        head: src.name,
        base: dest.name
      })
      return pr.data
    } catch (err) {
      return this.getPullRequest(repo, src, dest)
    }
  }
}
