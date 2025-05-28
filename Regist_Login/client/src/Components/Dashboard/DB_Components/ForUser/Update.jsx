import React, { useEffect, useState } from 'react';
import axios from 'axios';

// CSS
import './../../../../App.css';
import './ForUser.css';

// Icons
import { IoSearchSharp } from "react-icons/io5";

const Update = () => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');  

  useEffect(() => {
    const username = localStorage.getItem('ten_dang_nhap');
   
      axios.get('http://localhost:3002/list')
        .then(response => setData(response.data))
        .catch(error => console.log(error));
    
  }, []);

  // // Lọc data theo tháng được chọn, nhớ return trong filter
  // const filteredData = selectedMonth
  //   ? data.filter(item => item.thang === Number(selectedMonth))
  //   : data;

  return (
    <div className='list'>
      {/* <div className="searchbar">
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
      </div> */}
      <table className='table'>
        <caption>Bảng Nhan Su </caption>
        <thead>
          <tr>
            <th>Ma Nhan Vien</th>
            <th>Ho Ten</th>
            <th>Phong Ban</th>
            <th>Chuc Vu</th>
            <th>Trạng thái</th>
            <th>So Lan Cham Cong</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan="5" style={{textAlign: 'center'}}>Không có dữ liệu cho tháng này</td>
            </tr>
          )}
          {data.map((row, index) => (
            <tr key={index}>
                <td>{row.ma_nhan_vien}</td>
                <td>{row.ho_ten}</td>
                <td>{row.phong_ban}</td>
                <td>{row.chuc_vu}</td>
                <td>{row.trang_thai}</td>
                <td>{row.so_lan_cham_cong}</td>
                <td><button>Edit</button></td>
            </tr>
          ))}
        </tbody>
        <tfoot><button>Add</button></tfoot>
      </table>
    </div>
  );
};

export default Update;
