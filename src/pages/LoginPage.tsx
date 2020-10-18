import React from 'react'
import { useTranslation } from 'react-i18next'
import { GoogleLogin } from 'react-google-login'
import { useHistory } from 'react-router-dom'

import './LoginPage.scss'

import LoginLayout from '../layouts/LoginLayout'
import { GoogleAuthService } from '../services/GoogleAuthService'
import { loadUserData } from '../utils/loadUserData'

export default React.memo(() => {
  const { t } = useTranslation()
  const history = useHistory()

  const onLoginSuccess = async (response) => {
    try {
      await GoogleAuthService.authenticateUser(response.tokenId)

      // Load initial user data
      await loadUserData()

      history.push('/recipes')
    } catch (error) {
      alert(error.message)
    }
  }

  const onLoginFailure = () => {
    alert("Login failure")
  }

  return (
    <LoginLayout>
      <div className="LoginPage lb-body palette-Teal bg">
        <strong>{t('login.welcome')}</strong>
        <br />
        {t('login.invite')}

        <div className="google-btn-wrapper">
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}
            buttonText={t('login.loginWithGoogle')}
            onSuccess={onLoginSuccess}
            onFailure={onLoginFailure}
            cookiePolicy={'single_host_origin'}
            className="login"
          />
        </div>
      </div>
    </LoginLayout>
  )
})
