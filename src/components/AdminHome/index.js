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
    searchInput: '',
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

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
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
    const {userData, activePage, totalPages, searchInput} = this.state
    const searchResults = userData.filter(
      each =>
        each.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        each.email.toLowerCase().includes(searchInput.toLowerCase()) ||
        each.role.toLowerCase().includes(searchInput.toLowerCase()),
    )
    return (
      <>
        <ul>
          {searchResults.map(each => (
            <AdminUiItem
              key={each.id}
              adminUiDetails={each}
              deleteAdminUiItem={this.deleteAdminUiItem}
            />
          ))}
        </ul>
        <button type="button" className="delete-selected">
          Deleted Selected
        </button>
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
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="home-container">
          <input
            type="search"
            placeholder="Search by name,email or role"
            className="search-bar"
            value={searchInput}
            onChange={this.onChangeSearchInput}
          />
          <li className="list-of-items">
            <div className="list-item">
              <p className="paragraph">Name</p>
            </div>
            <div className="list-item">
              <p className="paragraph">Email</p>
            </div>
            <div className="list-item">
              <p className="paragraph"> Role</p>
            </div>
            <div className="list-item">
              <p className="paragraph">Actions</p>
            </div>
          </li>
          {this.renderAdminUiDetails()}
        </div>
      </>
    )
  }
}

export default AdminHome
