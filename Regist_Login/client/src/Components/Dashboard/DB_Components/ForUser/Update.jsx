import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './../../../../App.css';
import './ForUser.css';


const Update = () => {
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [addData, setAddData] = useState({
    ma_nhan_vien: '',
    ho_ten: '',
    phong_ban: '',
    chuc_vu: '',
    trang_thai: ''
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = () => {
    axios.get('http://localhost:3002/list')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (row) => {
    setEditData(row);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = () => {
    axios.put(`http://localhost:3002/update-employee/${editData.ma_nhan_vien}`, editData)
      .then(res => {
        alert(res.data.message);
        setShowEditModal(false);
        fetchData();
      })
      .catch(err => {
        alert("Lỗi khi cập nhật");
        console.error(err);
      });
  };

  const handleAddChange = (e) => {
    setAddData({ ...addData, [e.target.name]: e.target.value });
  };

  const handleAddSave = () => {
    axios.post('http://localhost:3002/add-employee', addData)
      .then(res => {
        alert(res.data.message);
        setShowAddModal(false);
        setAddData({
          ma_nhan_vien: '',
          ho_ten: '',
          phong_ban: '',
          chuc_vu: '',
          trang_thai: ''
        });
        fetchData();
      })
      .catch(err => {
        alert("Lỗi khi thêm nhân viên");
        console.error(err);
      });
  };

  return (
    <div className='list'>
      <table className='table'>
        <caption>Bảng Nhân Sự</caption>
        <thead>
          <tr>
            <th>Mã Nhân Viên</th>
            <th>Họ Tên</th>
            <th>Phòng Ban</th>
            <th>Chức Vụ</th>
            <th>Trạng Thái</th>
            <th>Số Lần Chấm Công</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan="7" style={{ textAlign: 'center' }}>Không có dữ liệu</td></tr>
          ) : (
            data.map((row, index) => (
              <tr key={index}>
                <td>{row.ma_nhan_vien}</td>
                <td>{row.ho_ten}</td>
                <td>{row.phong_ban}</td>
                <td>{row.chuc_vu}</td>
                <td>{row.trang_thai}</td>
                <td>{row.so_lan_cham_cong}</td>
                <td><button onClick={() => handleEdit(row)}>Edit</button></td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="7">
              <button onClick={() => setShowAddModal(true)}>Add</button>
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Modal Edit */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            <h3>Chỉnh sửa thông tin</h3>
            <input type="text" name="ho_ten" value={editData.ho_ten} onChange={handleEditChange} placeholder="Họ tên" />
            <input type="text" name="phong_ban" value={editData.phong_ban} onChange={handleEditChange} placeholder="Phòng ban" />
            <input type="text" name="chuc_vu" value={editData.chuc_vu} onChange={handleEditChange} placeholder="Chức vụ" />
            <input type="text" name="trang_thai" value={editData.trang_thai} onChange={handleEditChange} placeholder="Trạng thái" />
            <button onClick={handleEditSave}>Lưu</button>
          </div>
        </div>
      )}

      {/* Modal Add */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            <h3>Thêm nhân viên mới</h3>
            <input type="text" name="ma_nhan_vien" value={addData.ma_nhan_vien} onChange={handleAddChange} placeholder="Mã nhân viên" />
            <input type="text" name="ho_ten" value={addData.ho_ten} onChange={handleAddChange} placeholder="Họ tên" />
            <input type="text" name="phong_ban" value={addData.phong_ban} onChange={handleAddChange} placeholder="Phòng ban" />
            <input type="text" name="chuc_vu" value={addData.chuc_vu} onChange={handleAddChange} placeholder="Chức vụ" />
            <input type="text" name="trang_thai" value={addData.trang_thai} onChange={handleAddChange} placeholder="Trạng thái" />
            <button onClick={handleAddSave}>Thêm</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Update;
