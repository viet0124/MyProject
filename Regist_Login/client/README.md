# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

1. Giải thích các trang 
    Adminpage là trang của admin
    Userpage là trang của user 
    phân quyền theo role trong database

    History là gọi từ Userpage để hiện lịch sử chấm công của nhân viên account đó

    List là hiện ds nhân viên gọi từ adminpage
    Update là trang để chỉnh sửa và thêm nhân viên từ adminpage
    Chart là để thống kê (đang update)

    index.js chứa các hàm backend 

    App.scss là để viết css cho các trang

2. Cách chạy code
    chạy client(web) : npm run dev (mở terminal file client)
    chạy server : node index.js (mở terminal file server)

