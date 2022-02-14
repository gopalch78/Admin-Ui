import {Component} from 'react'
import {BiChevronRightSquare, BiChevronLeftSquare} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import AdminUiItem from '../AdminUiItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class AdminHome extends Component {
  state = {
    userData: [],
    apiStatus: apiStatusConstants.initial,
    totalPages: 0,
    activePage: 1,
  }

  componentDidMount() {
    this.getAdminUiRepositoriesData()
  }

  getAdminUiRepositoriesData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const limit = 10
    const adminUiUrl = `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
    const options = {
      method: 'GET',
    }
    const adminUiResponse = await fetch(adminUiUrl, options)
    const totalData = adminUiResponse.total

    const totalPages = Math.ceil(totalData / limit)
    const adminUiData = await adminUiResponse.json()
    const updatedAdminUiData = adminUiData.map(eachId => ({
      id: eachId.id,
      name: eachId.name,
      email: eachId.email,
      role: eachId.role,
    }))
    this.setState({
      userData: updatedAdminUiData,
      apiStatus: apiStatusConstants.success,
      totalPages,
    })
  }

  onIncreasePageNumber = () => {
    const {activePage} = this.state
    if (activePage < 4) {
      this.setState(
        prevState => ({
          activePage: prevState.activePage + 1,
        }),
        this.getAdminUiRepositoriesData,
      )
    }
  }

  onDecreasePageNumber = () => {
    const {activePage} = this.state
    if (activePage > 1) {
      this.setState(
        prevState => ({
          activePage: prevState.activePage - 1,
        }),
        this.getAdminUiRepositoriesData,
      )
    }
  }

  deleteAdminUiItem = id => {
    const {userData} = this.state
    this.setState({userData: userData.filter(each => each.id !== id)})
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <h1 className="error-message">Something Went Wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div testid="loader">
      <Loader color="#0284c7" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderAdminUiListView = () => {
    const {userData, activePage, totalPages} = this.state
    return (
      <>
        <ul>
          {userData.map(each => (
            <AdminUiItem
              key={each.id}
              adminUiDetails={each}
              deleteAdminUiItem={this.deleteAdminUiItem}
            />
          ))}
        </ul>
        <div className="pagination-container">
          <button
            type="button"
            onClick={this.onDecreasePageNumber}
            className="pagination-left-button"
          >
            <BiChevronLeftSquare size={20} />
          </button>
          <span className="active-page">{activePage}</span>
          <span className="of">of </span>
          <span className="total-pages">{totalPages}</span>
          <button
            type="button"
            onClick={this.onIncreasePageNumber}
            className="pagination-right-button"
          >
            <BiChevronRightSquare size={20} />
          </button>
        </div>
      </>
    )
  }

  renderAdminUiDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderAdminUiListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-container">
        <Header />
        <input type="search" placeholder="Search by name,email or role" />
        <li className="list-of-items">
          <p className="list-item">Name</p>
          <p className="list-item">Email</p>
          <p className="list-item"> Role</p>
          <p className="list-item">Actions</p>
        </li>
        {this.renderAdminUiDetails()}
      </div>
    )
  }
}

export default AdminHome
