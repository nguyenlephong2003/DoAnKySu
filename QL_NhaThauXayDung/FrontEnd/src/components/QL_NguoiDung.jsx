// import { useEffect, useState } from 'react';

// function QL_NguoiDung() {
//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState('');

//   // Fetch danh sách người dùng từ server
//   useEffect(() => {
//     fetch() // Bạn thay bằng API thực tế của bạn
//       .then(res => res.json())
//       .then(data => setUsers(data))
//       .catch(err => console.error('Lỗi khi tải danh sách người dùng:', err));
//   }, []);

//   // Xử lý tìm kiếm
//   const filteredUsers = users.filter(u => 
//     u.hoTen.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div>
//       <h2>Quản lý người dùng</h2>
      
//       <input 
//         type="text" 
//         placeholder="Tìm theo tên..." 
//         value={search} 
//         onChange={e => setSearch(e.target.value)} 
//       />
      
//       <table border="1" cellPadding="8">
//         <thead>
//           <tr>
//             <th>Mã</th>
//             <th>Họ tên</th>
//             <th>Email</th>
//             <th>Vai trò</th>
//             <th>Thao tác</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredUsers.map(user => (
//             <tr key={user.maNguoiDung}>
//               <td>{user.maNguoiDung}</td>
//               <td>{user.hoTen}</td>
//               <td>{user.email}</td>
//               <td>{user.vaiTro}</td>
//               <td>
//                 <button onClick={() => handleEdit(user)}>Sửa</button>
//                 <button onClick={() => handleDelete(user.maNguoiDung)}>Xóa</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// // Hàm xử lý (chưa cài chi tiết)
// function handleEdit(user) {
//   alert("Chức năng sửa đang được phát triển");
// }
// function handleDelete(maNguoiDung) {
//   if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
//     fetch(`/api/users/${maNguoiDung}`, {
//       method: 'DELETE',
//     })
//       .then(() => alert('Xóa thành công'))
//       .catch(() => alert('Xóa thất bại'));
//   }
// }

// export default QL_NguoiDung;
