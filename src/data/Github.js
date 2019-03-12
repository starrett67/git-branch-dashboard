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

  async getRepos (org, topics) {
    const repos = await this.octokit.repos.listForOrg({ org: org, per_page: 1000 })
    if (topics) return repos.data.filter(r => containsTopic(r, topics))
    else return repos.data
  }

  async getTopics (repo) {
    this.octokit.repos.listTopics({ owner: org })
  }
}
