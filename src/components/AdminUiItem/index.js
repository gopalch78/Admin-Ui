import {FaEdit} from 'react-icons/fa'
import {MdDelete} from 'react-icons/md'
import './index.css'

const AdminUiItem = props => {
  const {adminUiDetails, deleteAdminUiItem} = props
  const {id, name, email, role} = adminUiDetails
  const onClickRemoveAdminUiItem = () => {
    deleteAdminUiItem(id)
  }

  return (
    <div className="admin-ui-item-container">
      <div className="item-container">
        <div className="admin-item">
          <input type="checkbox" className="checkbox-element" />
        </div>
        <div className="admin-item">
          <p>{name}</p>
        </div>
        <div className="admin-item">
          <p>{email}</p>
        </div>
        <div className="admin-item">
          <p>{role}</p>
        </div>
        <div className="edit-delete-container">
          <FaEdit className="edit" />
          <MdDelete onClick={onClickRemoveAdminUiItem} className="delete" />
        </div>
      </div>
    </div>
  )
}
export default AdminUiItem
