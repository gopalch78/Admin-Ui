import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <>
      <div className="header-container">
        <h1 className="heading">ADMIN UI</h1>
        <button type="button" onClick={onClickLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </>
  )
}

export default withRouter(Header)
