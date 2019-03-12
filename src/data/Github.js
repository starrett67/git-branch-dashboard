import Octokit from '@octokit/rest'

const containsTopic = (repo, topics) => {
  let containsTopic = true
  if (!repo.topics || topics.find(!repo.topics.includes)) containsTopic = false
  return containsTopic
}

export default class GithubData {
  constructor (token) {
    console.log(token)
    this.octokit = new Octokit({
      auth: `Bearer ${token}`
    })
  }

  async getFilteredRepos (org, topics) {
    const repos = await this.getRepos(org)
    const topicPromises = repos.map(this.getTopics)
    await Promise.all(topicPromises)
    return repos.filter(r => containsTopic(r, topics))
  }

  async getRepos (org) {
    const repos = await this.octokit.repos.listForOrg({ org: org, per_page: 1000 })
    return repos.data
  }

  async getTopics (repo) {
    const topics = await this.octokit.repos.listTopics({ owner: repo.owner })
    Object.assign(repo, topics.data)
  }
}
