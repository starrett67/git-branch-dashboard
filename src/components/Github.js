import React, { Component } from 'react'
import SocialButton from './SocialButton'
import FontAwesome from 'react-fontawesome'

class Github extends Component {
  render () {
    return (
      <div className='button-wrapper fadein-fast'>
        <SocialButton
          provider='github'
          gatekeeper='http://localhost:9999'
          appId='fe376802e84328ca5784'
          redirect='http://localhost:3000'
          scope={['repo', 'admin:org']}
          onLoginSuccess={this.props.onSuccess}
          onLoginFailure={this.props.onFailure}
        >
          <FontAwesome name='github' />
        </SocialButton>
      </div>
    )
  }
}

export default Github
