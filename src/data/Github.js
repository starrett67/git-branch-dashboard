import Octokit from '@octokit/rest'

const containsTopic = (repo, topics) => {
  let containsTopic = true
  console.log(`filtering topics: ${topics}`)
  if (!Array.isArray(repo.topics) || topics.find(t => !repo.topics.includes(t))) containsTopic = false
  return containsTopic
}

const filterBranches = (repo, branches) => {
  repo.branches = branches.map(b => repo.branches.find(branch => branch.name === b))
}

export default class GithubData {
  constructor (token) {
    console.log(token)
    this.octokit = new Octokit({
      auth: `Bearer ${token}`
    })
  }

  async getFilteredRepos (org, topics, branches) {
    this.apiCalls = 0
    let repos = await this.getRepos(org)
    await this.getAllTopics(repos)
    repos = repos.filter(r => containsTopic(r, topics))
    await this.getAllBranches(repos)
    repos.forEach(r => filterBranches(r, branches))
    await this.getAllBranchesCommits(repos)
    console.log(repos)
    console.log(`All Done! And to think it only took ${this.apiCalls} to get all the data. Thats cheap!`)
    return repos
  }

  async getRepos (org) {
    const repos = await this.octokit.repos.listForOrg({ org: org, per_page: 1000 })
    this.apiCalls++
    return repos.data.map(d => d)
  }

  getAllBranches (repos) {
    const branchPromises = repos.map(r => this.getBranches(r))
    return Promise.all(branchPromises)
  }

  async getBranches (repo) {
    const branches = await this.octokit.repos.listBranches({ repo: repo.name, owner: repo.owner.login })
    this.apiCalls++
    repo.branches = branches.data
  }

  getAllTopics (repos) {
    const topicPromises = repos.map(r => this.getTopics(r))
    return Promise.all(topicPromises)
  }

  async getTopics (repo) {
    const topics = await this.octokit.repos.listTopics({
      repo: repo.name,
      owner: repo.owner.login,
      headers: { accept: 'application/vnd.github.mercy-preview+json' }
    })
    this.apiCalls++
    repo.topics = topics.data.names
  }

  getAllBranchesCommits (repos) {
    const brachesCommits = repos.map(r => this.getAllCommits(r))
    return Promise.all(brachesCommits)
  }

  getAllCommits (repo) {
    const branchCommits = repo.branches.map(b => this.getCommitData(repo, b))
    return Promise.all(branchCommits)
  }

  async getCommitData (repo, branch) {
    if (branch) {
      const response = await this.octokit.repos.getCommit({ repo: repo.name, owner: repo.owner.login, sha: branch.commit.sha })
      this.apiCalls++
      return Object.assign(branch.commit, response.data.commit)
    }
  }

  async getPullRequest (repo, src, dest) {
    const pr = await this.octokit.pulls.list({
      repo: repo.name,
      owner: repo.owner.login,
      title: src.commit.message,
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
        title: src.commit.message,
        head: src.name,
        base: dest.name
      })
      console.log(pr)
      return pr.data
    } catch (err) {
      return this.getPullRequest(repo, src, dest)
    }
  }
}
