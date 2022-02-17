import {Component} from 'react'
import ReactPaginate from 'react-paginate'
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
    searchInput: '',
  }

  componentDidMount() {
    this.getAdminUiRepositoriesData()
  }

  handlePageClick = async data => {
    console.log(data.selected)
    const currentPage = data.selected + 1
    const adminData = await this.fetchData(currentPage)
    this.setState({
      userData: adminData,
    })
  }

  getAdminUiRepositoriesData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const adminUiUrl = `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
    const options = {
      method: 'GET',
    }
    const adminUiResponse = await fetch(adminUiUrl, options)
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
    })
  }

  fetchData = () => {
    this.getAdminUiRepositoriesData()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
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
    const {userData, searchInput} = this.state
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
        <ReactPaginate
          previousLabel="<<"
          nextLabel=">>"
          breakLabel="..."
          pageCount="5"
          marginPagesDisplayed="1"
          pageRangeDisplay="1"
          onPageChange={this.handlePageClick}
          containerClassName="pagination justify-content-center"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          activeClassName=" active"
        />
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
