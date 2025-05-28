import React, { useEffect, useState } from 'react';
import axios from 'axios';

// CSS
import './../../../../App.css';
import './ForUser.css';

// Icons
import { IoSearchSharp } from "react-icons/io5";

const History = () => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');  

  useEffect(() => {
    const username = localStorage.getItem('ten_dang_nhap');
    if (username) {
      axios.get('http://localhost:3002/history/'+username)
        .then(response => setData(response.data))
        .catch(error => console.log(error));
    }
  }, []);

  const handleMonth = (event) => {
    setSelectedMonth(event.target.value);  // dùng setState để cập nhật
  };

  // Lọc data theo tháng được chọn, nhớ return trong filter
  const filteredData = selectedMonth
    ? data.filter(item => item.thang === Number(selectedMonth))
    : data;

  return (
    <div className='history'>
      <div className="searchbar">
        <input type="text" id='search' placeholder='Search...' />
        <IoSearchSharp className='icon'/>
        <select name="" value={selectedMonth} id="month" onChange={handleMonth}>
            <option value="">--Tất cả tháng--</option>
            <option value="1">Tháng 1</option>
            <option value="2">Tháng 2</option>
            <option value="3">Tháng 3</option>
            <option value="4">Tháng 4</option>
            <option value="5">Tháng 5</option>
            <option value="6">Tháng 6</option>
            <option value="7">Tháng 7</option>
            <option value="8">Tháng 8</option>
            <option value="9">Tháng 9</option>
            <option value="10">Tháng 10</option>
            <option value="11">Tháng 11</option>
            <option value="12">Tháng 12</option>
        </select>
        <input type="text" name="" id="" />
      </div>
      <table className='table'>
        <caption>Bảng Chấm Công </caption>
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Thời gian vào</th>
            <th>Thời gian ra</th>
            <th>Thời gian làm</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 && (
            <tr>
              <td colSpan="5" style={{textAlign: 'center'}}>Không có dữ liệu cho tháng này</td>
            </tr>
          )}
          {filteredData.map((row, index) => (
            <tr key={index}>
                <td>{row.ngay}</td>
                <td>{row.gio_vao}</td>
                <td>{row.gio_ra}</td>
                <td>{row.thoi_gian_lam}</td>
                <td>{row.trang_thai}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
