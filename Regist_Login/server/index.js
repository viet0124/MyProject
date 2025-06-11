const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(3002, '0.0.0.0',() => {
  console.log('Server is running on port 3002');
});

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'quanlychamcong'
})

// Khởi tạo thư mục uploads nếu chưa có
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Nhận vector từ máy xử lý model
app.post('/receive-vector', (req, res) => {
  const { ID, vectorId } = req.body;

  if (!ID || !vectorId) {
    return res.status(400).json({ message: 'Thiếu ID hoặc vectorId' });
  }

  const sql = 'UPDATE nhanvien SET id_vector = ? WHERE ma_nhan_vien = ?';
  db.query(sql, [vectorId, ID], (err, result) => {
    if (err) {
      console.error('Lỗi khi cập nhật vector:', err);
      return res.status(500).json({ message: 'Lỗi khi cập nhật vector' });
    }

    res.json({ message: 'Vector được lưu thành công!' });
  });
});




// Check ID
app.get('/check-id/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'SELECT * FROM nhanvien WHERE ma_nhan_vien = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Lỗi khi kiểm tra ID:', err);
      return res.status(500).json({ message: 'Lỗi khi kiểm tra ID', error: err });
    }

    if (result.length > 0) {
      res.status(200).json({ exists: true, nhanvien: result[0] }); // ✅ Có nhân viên
    } else {
      res.status(200).json({ exists: false }); // ❌ Không có nhân viên
    }
  });
});

// Đăng ký người dùng
app.post('/register', (req, res) => {
  const { ID, Email, Username, Password, VectorID } = req.body;
  const role = 'user';

  // 1. Kiểm tra xem tài khoản đã tồn tại chưa (theo ma_nhan_vien hoặc ten_dang_nhap)
  const checkSql = 'SELECT * FROM taikhoan WHERE ma_nhan_vien = ? OR ten_dang_nhap = ?';
  db.query(checkSql, [ID, Username], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('❌ Lỗi khi kiểm tra tài khoản:', checkErr);
      return res.status(500).json({ message: 'Lỗi kiểm tra tài khoản', error: checkErr });
    }

    if (checkResult.length > 0) {
      return res.status(400).json({ message: 'Tài khoản đã tồn tại cho mã nhân viên hoặc tên đăng nhập.' });
    }

    // 2. Chưa có thì thêm mới
    const sqlInsertTK = `
      INSERT INTO taikhoan (ma_nhan_vien, ten_dang_nhap, mat_khau, email, vai_tro)
      VALUES (?, ?, ?, ?, ?)
    `;
    const tkValues = [ID, Username, Password, Email, role];

    db.query(sqlInsertTK, tkValues, (err, result) => {
      if (err) {
        console.error('❌ Lỗi khi lưu tài khoản:', err);
        return res.status(500).json({ message: 'Lỗi khi lưu tài khoản', error: err });
      }

      // 3. Cập nhật vector ID trong bảng nhân viên
      const sqlUpdateNV = `UPDATE nhanvien SET vector_id = ? WHERE ma_nhan_vien = ?`;
      db.query(sqlUpdateNV, [VectorID, ID], (err2, result2) => {
        if (err2) {
          console.error('❌ Lỗi khi cập nhật vector:', err2);
          return res.status(500).json({ message: 'Lỗi khi cập nhật vector', error: err2 });
        }

        res.status(200).json({ message: '🎉 Đăng ký thành công và đã cập nhật vector.' });
      });
    });
  });
});






// Đăng nhập người dùng
app.post('/login', (req, res) => {
    const LGusername = req.body.LoginUsername;
    const LGpassword = req.body.LoginPassword;
    const sqlSelect = "SELECT * FROM taikhoan WHERE ten_dang_nhap = ? && mat_khau = ? ";
    const VALUES = [LGusername, LGpassword];
    db.query(sqlSelect, VALUES, (err, result) => {
        if (err) { 
            res.send({ message: err });
        } else {
            if (result.length > 0) {
                res.send({ user: result[0] }); 
            } else {
                res.send({ message: 'Invalid username or password!' });
            }
        }
    });
});

// Chấm công
app.get('/history/:username', (req, res) => {
  const username = req.params.username;

  const query = `SELECT 
        nv.ma_nhan_vien,
        nv.ho_ten,
        nv.phong_ban,
        nv.chuc_vu,
        nv.trang_thai,
        DAY(cc.thoi_gian_vao) AS ngay,
        MONTH(cc.thoi_gian_vao) AS thang,
        YEAR(cc.thoi_gian_vao) AS nam,
        TIME(cc.thoi_gian_vao) AS gio_vao,
        TIME(cc.thoi_gian_ra) AS gio_ra,
        TIMEDIFF(cc.thoi_gian_ra, cc.thoi_gian_vao) AS thoi_gian_lam,
        CASE 
            WHEN TIMEDIFF(cc.thoi_gian_ra, cc.thoi_gian_vao) > '00:00:00' THEN 'Đã chấm công'
            ELSE 'Chưa chấm công'
        END AS trang_thai
    FROM 
        taikhoan tk
    JOIN 
        nhanvien nv ON tk.ma_nhan_vien = nv.ma_nhan_vien
    JOIN 
        chamcong cc ON nv.ma_nhan_vien = cc.ma_nhan_vien
    WHERE 
        tk.ten_dang_nhap = ?
    ORDER BY 
        cc.thoi_gian_vao DESC;`  
  

  db.query(query, [username], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Lỗi truy vấn CSDL' });
    } else {
      res.json(result);
    }
  });
});

// Lấy danh sách nhân viên
app.get('/list', (req, res) => {
  //const username = req.params.username;

  const query = `SELECT 
    nv.ma_nhan_vien,
    nv.ho_ten,
    nv.phong_ban,
    nv.chuc_vu,
    nv.trang_thai,
    COUNT(cc.ma_cham_cong) AS so_lan_cham_cong
FROM 
    nhanvien nv
LEFT JOIN 
    taikhoan tk ON tk.ma_nhan_vien = nv.ma_nhan_vien
LEFT JOIN 
    chamcong cc ON nv.ma_nhan_vien = cc.ma_nhan_vien
GROUP BY 
    nv.ma_nhan_vien, nv.ho_ten, nv.phong_ban, nv.chuc_vu, nv.trang_thai
ORDER BY 
    nv.ho_ten;
`  
  

  db.query(query, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Lỗi truy vấn CSDL' });
    } else {
      res.json(result);
    }
  });
});

// Chỉnh sửa thông tin nhân viên
app.put('/update-employee/:id', (req, res) => {
  const ma_nhan_vien = req.params.id;
  const { ho_ten, phong_ban, chuc_vu, trang_thai } = req.body;

  const sql = `
    UPDATE nhanvien 
    SET ho_ten = ?, phong_ban = ?, chuc_vu = ?, trang_thai = ?
    WHERE ma_nhan_vien = ?
  `;

  db.query(sql, [ho_ten, phong_ban, chuc_vu, trang_thai, ma_nhan_vien], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi cập nhật', error: err });
    res.json({ message: 'Cập nhật thành công' });
  });
});

app.post('/add-employee', (req, res) => {
  const { ma_nhan_vien, ho_ten, phong_ban, chuc_vu, trang_thai } = req.body;

  const sql = `INSERT INTO nhanvien (ma_nhan_vien, ho_ten, phong_ban, chuc_vu, trang_thai) VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [ma_nhan_vien, ho_ten, phong_ban, chuc_vu, trang_thai], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi thêm nhân viên', error: err });
    res.json({ message: 'Thêm nhân viên thành công' });
  });
});


// Nhận thông tin chấm công từ máy xử lý model
app.post('/checkin', (req, res) => {
  const { vectorId, timestamp } = req.body;

  if (!vectorId || !timestamp) {
    return res.status(400).json({ message: 'Thiếu vectorId hoặc thời gian' });
  }

  // 1. Tìm mã nhân viên từ id_vector
  const findEmployeeSql = `SELECT ma_nhan_vien FROM nhanvien WHERE vector_id = ?`;

  db.query(findEmployeeSql, [vectorId], (err, results) => {
    if (err) {
      console.error('Lỗi khi tìm mã nhân viên:', err);
      return res.status(500).json({ message: 'Lỗi truy vấn CSDL' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên với vector này' });
    }

    const maNhanVien = results[0].ma_nhan_vien;
    const today = new Date(timestamp).toISOString().split('T')[0]; // yyyy-mm-dd

    // 2. Kiểm tra bản ghi chưa có thời gian ra hôm nay
    const checkIncompleteSql = `
      SELECT * FROM chamcong 
      WHERE ma_nhan_vien = ? AND DATE(thoi_gian_vao) = ? AND thoi_gian_ra IS NULL
      ORDER BY thoi_gian_vao DESC LIMIT 1
    `;

    db.query(checkIncompleteSql, [maNhanVien, today], (err2, results2) => {
      if (err2) {
        console.error('Lỗi khi kiểm tra chấm công chưa hoàn tất:', err2);
        return res.status(500).json({ message: 'Lỗi kiểm tra dữ liệu' });
      }

      if (results2.length > 0) {
        // Có bản ghi chưa ra -> cập nhật giờ ra
        const maChamCong = results2[0].ma_cham_cong;
        const updateSql = `UPDATE chamcong SET thoi_gian_ra = ? WHERE ma_cham_cong = ?`;

        db.query(updateSql, [timestamp, maChamCong], (err3) => {
          if (err3) {
            console.error('Lỗi khi cập nhật giờ ra:', err3);
            return res.status(500).json({ message: 'Lỗi cập nhật giờ ra' });
          }

          return res.json({ message: 'Đã cập nhật giờ ra thành công' });
        });
      } else {
        // Không có bản ghi chưa ra -> chấm công mới (giờ vào)
        const insertSql = `INSERT INTO chamcong (ma_nhan_vien, thoi_gian_vao) VALUES (?, ?)`;
        db.query(insertSql, [maNhanVien, timestamp], (err4) => {
          if (err4) {
            console.error('Lỗi khi chấm công mới:', err4);
            return res.status(500).json({ message: 'Lỗi khi chấm công mới' });
          }

          return res.json({ message: 'Đã chấm công giờ vào thành công' });
        });
      }
    });
  });
});


