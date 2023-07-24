type MyWindow = any

const myWindow: MyWindow = window

class SolaExtensionLogin {
  login (userId: string, userDomain: string, authToken: string, avatar: string) {
    myWindow.postMessage({
      type: 'SOLA_LOGIN',
      user_id: userId,
      user_domain: userDomain,
      auth_token: authToken,
      avatar: avatar
    }, '*')
  }

  logout () {
    myWindow.postMessage({ type: 'SOLA_LOGOUT' }, '*')
  }
}

const solaExtensionLogin = new SolaExtensionLogin()
export default solaExtensionLogin
