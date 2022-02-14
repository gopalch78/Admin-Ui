import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

const Header = props => {
  const onClickLogoutAdminUi = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <div className="header-container">
      <h1 className="header-heading">ADMIN UI</h1>
      <button
        type="button"
        onClick={onClickLogoutAdminUi}
        className="logout-btn"
      >
        Logout
      </button>
    </div>
  )
}

export default withRouter(Header)
