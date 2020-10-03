import React from 'react'
import SocialButton from './SocialButton'
import FontAwesome from 'react-fontawesome'
import config from '../config'

const Github = ({ onSuccess, onFailure }) => {
  return (
    <div className='button-wrapper fadein-fast'>
      <SocialButton
        provider='github'
        gatekeeper={config.gatekeeperURL}
        appId={config.appId}
        redirect={config.oauthCallback}
        scope={['repo']}
        className='github'
        onLoginSuccess={onSuccess}
        onLoginFailure={onFailure}
      >
        <FontAwesome name='github' />
      </SocialButton>
    </div>
  )
}

export default Github
