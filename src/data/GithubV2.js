import { Octokit } from '@octokit/rest'

export default class GithubData {
  constructor (token, failure) {
    this.failureCallback = failure
    this.octokit = new Octokit({
      auth: `Bearer ${token}`
    })
  }

  async getUser () {
    try {
      const response = await this.octokit.users.getAuthenticated()
      return response.data
    } catch (err) {
      this.failureCallback(err)
    }
  }

  async getOrganizations () {
    try {
      const orgs = await this.octokit.orgs.listForAuthenticatedUser()
      return orgs.data.map(o => o.login)
    } catch (err) {
      this.failureCallback(err)
    }
  }

  async getRepos ({ org, topics, perPage = 50, page = 0, keyword = '' }) {
    let query = `${keyword}+archived:false`
    if (org) query += `+org:${org}`
    if (topics && topics.length > 0) query += `+topic:${topics.join('+topic:')}`
    const params = {
      q: query,
      order: 'desc',
      sort: 'updated',
      per_page: perPage,
      page
    }
    try {
      const response = await this.octokit.search.repos(params)
      const repos = response.data.items
        .sort((r1, r2) => new Date(r2.updated_at) - new Date(r1.updated_at))
      console.log(repos)
      return repos
    } catch (err) {
      this.failureCallback(err)
    }
  }

  getRepoBranches (repo, branches) {
    return Promise.all(branches.map(branch => this.getRepoBranch(repo, branch)))
  }

  async getRepoBranch (repo, branch) {
    try {
      const resp = await this.octokit.repos.getBranch({ repo: repo.name, owner: repo.owner.login, branch: branch })
      return resp.data
    } catch (err) {
      console.log(`${repo.name} does not contain branch: ${branch}`)
    }
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

  async createPullRequest (org, repo, src, dest) {
    try {
      const pr = await this.octokit.pulls.create({
        repo: repo.name,
        owner: org,
        title: src.commit.message,
        head: src.name,
        base: dest.name
      })
      return pr.data
    } catch (err) {
      return this.getPullRequest(repo, src, dest)
    }
  }
}
