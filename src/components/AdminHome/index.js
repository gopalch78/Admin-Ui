import {Component} from 'react'
import ReactPaginate from 'react-paginate'
import Loader from 'react-loader-spinner'

import {v4} from 'uuid'
import {FiSearch} from 'react-icons/fi'
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
    offSet: 0,
    perPage: 10,
    pageCount: 0,
    nameInput: '',
    emailInput: '',
  }

  // component lifeCycle Method

  componentDidMount() {
    this.getAdminUiRepositoriesData()
  }

  // pagination handle change function

  handlePageClick = e => {
    const selectedPage = e.selected
    const {perPage} = this.state
    const offSetPage = selectedPage * perPage

    this.setState(
      {
        offSet: offSetPage,
      },
      () => {
        this.getAdminUiRepositoriesData()
      },
    )
  }

  // API Call for Fetching  the data and setting all data to local storage

  getAdminUiRepositoriesData = async () => {
    const {offSet, perPage} = this.state
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const adminUiUrl = `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
    const options = {
      method: 'GET',
    }
    const adminUiResponse = await fetch(adminUiUrl, options)
    const adminUiData = await adminUiResponse.json()
    const slice = adminUiData.slice(offSet, offSet + perPage)
    localStorage.setItem('userData', JSON.stringify(adminUiData))
    const updatedAdminUiData = slice.map(eachId => ({
      id: eachId.id,
      name: eachId.name,
      email: eachId.email,
      role: eachId.role,
    }))
    this.setState({
      userData: updatedAdminUiData,
      apiStatus: apiStatusConstants.success,
      pageCount: Math.ceil(adminUiData.length / perPage),
    })
  }

  // If the Data fetch is failed we can retryData function

  retryData = () => {
    this.getAdminUiRepositoriesData()
  }

  // Adding single item to local Storage

  addSingleAdminData = event => {
    event.preventDefault()
    const {nameInput, emailInput, roleInput} = this.state
    const newData = {
      id: v4(),
      name: nameInput,
      email: emailInput,
      role: roleInput,
    }

    this.setState(prevState => ({
      userData: [...prevState.userData, newData],
      nameInput: '',
      emailInput: '',
      roleInput: '',
    }))
    const localData = localStorage.getItem('userData')
    const parsedData = JSON.parse(localData)
    const updatedData = parsedData
    updatedData.push(newData)
    localStorage.setItem('userData', JSON.stringify(updatedData))
  }

  // event action on name input field

  onChangeNameInput = event => {
    this.setState({
      nameInput: event.target.value,
    })
  }

  // event action on email input field

  onChangeEmailInput = event => {
    this.setState({
      emailInput: event.target.value,
    })
  }

  // event action on role input field

  onChangeRoleInput = event => {
    this.setState({
      roleInput: event.target.value,
    })
  }

  // event action on search input field

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  // Editing the Data

  getData = id => {
    const {userData} = this.state
    const Item = userData.find(each => each.id === id)
    return Item
  }

  onEditData = id => {
    const {userData} = this.state
    const filteredData = userData.filter(each => each.id !== id)
    const indexItem = userData.indexOf(this.getData(id))
    const selectedItem = userData[indexItem]
    this.setState({
      userData: filteredData,
      nameInput: selectedItem.name,
      emailInput: selectedItem.email,
      roleInput: selectedItem.role,
    })
  }

  // adding data  to the list , when click on add button

  addData = () => {
    const {nameInput, emailInput, roleInput} = this.state
    return (
      <div className="input-containers">
        <form onSubmit={this.addSingleAdminData}>
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            type="text"
            id="name"
            onChange={this.onChangeNameInput}
            value={nameInput}
            className="input-field"
          />
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            type="text"
            id="email"
            onChange={this.onChangeEmailInput}
            value={emailInput}
            className="input-field"
          />
          <label htmlFor="role" className="label">
            Role
          </label>
          <input
            type="text"
            id="role"
            onChange={this.onChangeRoleInput}
            value={roleInput}
            className="input-field"
          />
          <button type="submit" className="add-button">
            Add
          </button>
        </form>
      </div>
    )
  }

  // toggling the checkbox

  toggleIsChecked = id => {
    this.setState(prevState => ({
      userData: prevState.userData.map(each => {
        if (id === each.id) {
          return {...each, isChecked: !each.isChecked}
        }
        return each
      }),
    }))
  }

  // toggling all the checkboxes

  onCheckBoxSelectedAll = e => {
    const {name, checked} = e.target
    this.setState(prevState => ({
      userData: prevState.userData.map(each => {
        if (name === 'checkAll') {
          console.log(name)
          return {...each, isChecked: checked}
        }

        return each
      }),
    }))
  }

  // deleting single admin data

  deleteAdminUiItem = id => {
    const {userData} = this.state
    this.setState({userData: userData.filter(each => each.id !== id)})
  }

  // deleting all the data from localStorage

  deleteAllCheckedAdminUiData = () => {
    const {userData} = this.state
    const selectedDataToDelete = userData.filter(
      eachUserData => eachUserData.isChecked !== true,
    )
    localStorage.removeItem('userData')
    this.setState({userData: selectedDataToDelete})
  }

  // failure View

  renderFailureView = () => (
    <div className="failure-view-container">
      <h1 className="error-message">Something Went Wrong</h1>
      <button type="button" onClick={this.retryData}>
        Retry
      </button>
    </div>
  )

  // Loading View with spinner

  renderLoadingView = () => (
    <div testid="loader">
      <Loader color="#0284c7" height={80} type="ThreeDots" width={80} />
    </div>
  )

  // for  rendering of the data

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
              toggleIsChecked={this.toggleIsChecked}
              onEditData={this.onEditData}
              onCheckBoxSelectedAll={this.onCheckBoxSelectedAll}
            />
          ))}
        </ul>
      </>
    )
  }

  // rendering according to the switch statement(successView, failureView,LoadingView)

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

  //  render method called here

  render() {
    const {searchInput, pageCount, userData} = this.state
    return (
      <>
        <Header />
        <div className="home-container">
          <div className="input-search-container">
            <input
              type="text"
              placeholder="Search by name,email or role"
              className="search-bar"
              value={searchInput}
              onChange={this.onChangeSearchInput}
            />
            <FiSearch
              className="search-icon"
              onClick={this.renderAdminUiListView}
            />
          </div>
          {this.addData()}
          <li className="list-of-items">
            <input
              type="checkbox"
              name="checkAll"
              checked={!userData.some(user => user?.isChecked !== true)}
              onChange={this.onCheckBoxSelectedAll}
            />
            <p className="paragraph">Name</p>

            <p className="paragraph">Email</p>

            <p className="paragraph"> Role</p>

            <p className="paragraph">Actions</p>
          </li>
          <hr className="hr-line" />
          {this.renderAdminUiDetails()}
          <div className="bottom-container">
            <button
              type="button"
              className="delete-selected"
              onClick={this.deleteAllCheckedAdminUiData}
            >
              Deleted Selected
            </button>
            <ReactPaginate
              previousLabel="Previous"
              nextLabel="Next"
              breakLabel="..."
              pageCount={pageCount}
              marginPagesDisplayed="2"
              pageRangeDisplay="2"
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
          </div>
        </div>
      </>
    )
  }
}

export default AdminHome
