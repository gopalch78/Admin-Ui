import {FaEdit} from 'react-icons/fa'
import {MdDelete} from 'react-icons/md'
import './index.css'

const AdminUiItem = props => {
  const {
    adminUiDetails,
    deleteAdminUiItem,
    toggleIsChecked,
    isChecked,
    onEditData,
  } = props
  const {id, name, email, role} = adminUiDetails

  const checkedClassName = isChecked
    ? 'checkbox-element active'
    : 'checkbox-element'

  // Remove Functionality

  const onClickRemoveAdminUiItem = () => {
    deleteAdminUiItem(id)
  }
  // Edit Functionality

  const onClickEditData = () => {
    onEditData(id)
  }

  // toggle Functionality

  const onClickChecked = () => {
    toggleIsChecked(id)
  }

  return (
    <>
      <li className="item-container">
        <input
          type="checkbox"
          className={checkedClassName}
          onChange={onClickChecked}
          value={name}
          name={name}
          checked={adminUiDetails?.isChecked || false}
        />
        <p className="item">{name}</p>
        <p className="item">{email}</p>
        <p className="item">{role}</p>

        <div className="edit-delete-container">
          <FaEdit className="edit" onClick={onClickEditData} />
          <MdDelete onClick={onClickRemoveAdminUiItem} className="delete" />
        </div>
      </li>
      <hr className="line" />
    </>
  )
}
export default AdminUiItem
