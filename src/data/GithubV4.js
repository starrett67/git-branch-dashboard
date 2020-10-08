import { graphql } from '@octokit/graphql'

export default class GithubData {
  constructor (token, failure) {
    this.failureCallback = failure
    this.octoGraph = graphql.defaults({
      headers: {
        authorization: `Bearer ${token}`
      }
    })
  }

  __getRepoPage ({ org, branches, afterCursor }) {
    const after = afterCursor ? `, after:"${afterCursor}"` : ''
    const branchQuery = branches.map(branch => (`
      ${branch}: ref(qualifiedName: "${branch}") {
        name
        commit: target {
        ... on Commit {
            id
            message
            tree {
              oid
            }
            author {
              name
              date
            }
          }
        }
      }
    `))
    const graphQuery = `
      {
        repositories: search(query: "org:${org}", type: REPOSITORY, first: 100${after}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          repos: nodes {
            ... on Repository {
              name
              isArchived
              url
              repositoryTopics(first: 100) {
                topics:nodes {
                  topic {
                    name
                  }
                }
              }
              updatedAt
              ${branchQuery.join('\n')}
            }
          }
        }
      }
    `
    return this.octoGraph(graphQuery)
  }

  async getOrgRepos ({ org, branches = [] }) {
    let repos = []
    let hasNextPage = true
    let afterCursor
    while (hasNextPage) {
      const resp = await this.__getRepoPage({ org, branches, afterCursor })
      hasNextPage = resp.repositories.pageInfo.hasNextPage
      afterCursor = resp.repositories.pageInfo.endCursor
      repos = [...repos, ...resp.repositories.repos]
    }
    return repos.filter(repo => !repo.isArchived).sort((r1, r2) => new Date(r2.updatedAt) - new Date(r1.updatedAt))
  }
}
