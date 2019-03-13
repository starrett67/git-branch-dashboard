import Octokit from '@octokit/rest'

const containsTopic = (repo, topics) => {
  let containsTopic = true
  if (!Array.isArray(repo.topics) || topics.find(t => !repo.topics.includes(t))) containsTopic = false
  return containsTopic
}

export default class GithubData {
  constructor (token) {
    console.log(token)
    this.octokit = new Octokit({
      auth: `Bearer ${token}`
    })
  }

  async getFilteredRepos (org, topics, branches) {
    let repos = await this.getRepos(org)
    const topicPromises = repos.map(r => this.getTopics(r))
    await Promise.all(topicPromises)
    repos = repos.filter(r => containsTopic(r, topics))
    const branchPromises = repos.map(r => this.getBranches(r))
    await Promise.all(branchPromises)
    console.log(repos)
    return repos
  }

  async getRepos (org) {
    const repos = await this.octokit.repos.listForOrg({ org: org, per_page: 1000 })
    return repos.data.map(d => d)
  }
  async getBranches (repo) {
    const branches = await this.octokit.repos.listBranches({ repo: repo.name, owner: repo.owner.login })
    repo.branches = branches.data
  }
  async getTopics (repo) {
    const topics = await this.octokit.repos.listTopics({
      repo: repo.name,
      owner: repo.owner.login,
      headers: { accept: 'application/vnd.github.mercy-preview+json' }
    })
    repo.topics = topics.data.names
  }
}
