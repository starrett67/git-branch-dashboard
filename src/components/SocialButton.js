import React, { useEffect } from 'react'
import axios from 'axios'

const SocialButton = ({
  gatekeeper,
  children,
  scope,
  appId,
  redirect,
  className,
  onLoginSuccess,
  onLoginFailure
}) => {
  useEffect(() => {
    const code =
      window.location.href.match(/\?code=(.*)/) &&
      window.location.href.match(/\?code=(.*)/)[1]
    if (code) {
      axios(`${gatekeeper}/authenticate/${code}/`)
        .then(response => response.data)
        .then(({ token }) => {
          onLoginSuccess(token)
        })
        .catch(err => onLoginFailure(err))
    }
  }, [])

  const login = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${appId}&scope=${scope}&redirect_uri=${redirect}`
  }

  return (
    <button onClick={() => login()} className={className}>
      {children}
    </button>
  )
}

export default SocialButton
