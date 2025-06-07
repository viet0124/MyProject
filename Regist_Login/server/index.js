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

app.listen(3002, () => {
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

app.post('/register', upload.single('image'), (req, res) => {
  const { Email, Username, Password } = req.body;
  const imagePath = req.file ? req.file.filename : null;

  const id = Math.floor(Math.random() * 1000);
  const role = 'user';

  const sqlInsert = "INSERT INTO taikhoan (ma_nhan_vien, ten_dang_nhap, mat_khau, email, vai_tro, anh) VALUES (?, ?, ?, ?, ?, ?)";
  const VALUES = [id, Username, Password, Email, role, imagePath];

  db.query(sqlInsert, VALUES, (err, result) => {
    if (err) {
      console.log(err);
      res.send({ message: err });
    } else {
      res.send({ message: 'User registered successfully!' });
    }
  });
});

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

