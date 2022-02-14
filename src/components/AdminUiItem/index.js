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
      <li className="item-container">
        <input type="checkbox" className="checkbox-element" />
        <p className="admin-item">{name}</p>
        <p className="admin-item">{email}</p>
        <p className="admin-item">{role}</p>
        <div className="edit-delete-container">
          <FaEdit />
          <MdDelete onClick={onClickRemoveAdminUiItem} />
        </div>
      </li>
    </div>
  )
}
export default AdminUiItem
