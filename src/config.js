const {
  REACT_APP_DEFAULT_BRANCH_FILTERS,
  REACT_APP_DEFAULT_TOPIC_FILTERS,
  REACT_APP_GATEKEEPER_URL,
  REACT_APP_APP_ID,
  REACT_APP_OAUTH_CALLBACK
} = process.env

class Config {
  constructor () {
    this.defaultBranchFilters = REACT_APP_DEFAULT_BRANCH_FILTERS ? REACT_APP_DEFAULT_BRANCH_FILTERS.split(',') : ['main', 'master', 'production']
    this.defaultTopicFilters = REACT_APP_DEFAULT_TOPIC_FILTERS ? REACT_APP_DEFAULT_TOPIC_FILTERS.split(',') : []
    this.gatekeeperURL = REACT_APP_GATEKEEPER_URL || 'https://o3kzmr9dud.execute-api.us-east-1.amazonaws.com/dev/gatekeeper-local'
    this.appId = REACT_APP_APP_ID || '1f8d5cf41665a06afb99'
    this.oauthCallback = REACT_APP_OAUTH_CALLBACK || 'http://localhost:3000/'
  }
}

export default new Config()
