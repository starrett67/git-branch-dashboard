import React, { Component } from 'react'
import SocialButton from './SocialButton'
import FontAwesome from 'react-fontawesome'

const { HOST, PORT } = process.env

class Github extends Component {
  render () {
    const callback = `http://${HOST || 'localhost'}:${PORT || 3000}`
    console.log(callback)
    return (
      <div className='button-wrapper fadein-fast'>
        <SocialButton
          provider='github'
          gatekeeper='http://localhost:9999'
          appId='fe376802e84328ca5784'
          redirect={callback}
          scope={['repo']}
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
