import React, { useState } from "react";
import huitImage from "../assets/nen2.png";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config.js";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin đăng nhập");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}NguoiDung_API/DangNhap_API.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            MaNhanVien: username,
            MatKhau: password,
          }),
        }
      );

      // Đọc response text trước
      const responseText = await response.text();
      console.log("Raw response:", responseText); // Log raw response để debug

      let data;
      try {
        // Thử parse JSON
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Lỗi parse JSON:", parseError);
        console.error("Response không phải JSON:", responseText);
        throw new Error("Server trả về dữ liệu không hợp lệ");
      }

      console.log("Parsed data:", data); // Log parsed data để debug

      if (data.message === "success" && data.nhanvien && data.nhanvien.length > 0) {
        // Lưu thông tin người dùng vào sessionStorage thay vì localStorage
        sessionStorage.setItem("userInfo", JSON.stringify(data.nhanvien[0]));
        setSuccess("Đăng nhập thành công!");
        setError("");

        // Lấy tên loại nhân viên
        const tenLoai = data.nhanvien[0].TenLoaiNhanVien;
        console.log("Tên loại nhân viên:", tenLoai);

        // Chuyển hướng dựa vào tên loại
        setTimeout(() => {
          switch (tenLoai) {
            case "Admin":
              navigate("/admin");
              break;
            case "Giám đốc":
              navigate("/giamdoc");
              break;
            case "Kế toán":
              navigate("/ketoan");
              break;
            case "Nhân sự":
              navigate("/nhansu");
              break;
            case "Quản lý công trình":
              navigate("/qlcongtrinh");
              break;
            case "Nhân viên kho":
              navigate("/nhanvienkho");
              break;
            case "Nhân viên tư vấn":
              navigate("/nhanvientuvan/lapbaogia");
              break;
            default:
              console.error("Không tìm thấy loại nhân viên phù hợp:", tenLoai);
              setError("Loại nhân viên không hợp lệ");
              break;
          }
        }, 1000);
      } else {
        console.warn("Phản hồi không thành công:", data);
        setError(data.message || "Đăng nhập không thành công");
        setSuccess("");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      if (error.message === "Server trả về dữ liệu không hợp lệ") {
        setError("Lỗi kết nối server. Vui lòng thử lại sau.");
      } else {
        setError("Vui lòng kiểm tra lại thông tin đăng nhập");
      }
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${huitImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md space-y-8 bg-white/0 backdrop-blur p-8 rounded-2xl shadow-2xl border border-white/30">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-black">Đăng Nhập</h1>
          <p className="mt-2 text-base text-gray-950">
            Vui lòng nhập thông tin đăng nhập của bạn
          </p>
        </div>

        {/* Hiển thị thông báo lỗi */}
        {error && (
          <div className="mt-2 p-3 bg-red-100 text-red-700 border border-red-300 rounded text-sm">
            {error}
          </div>
        )}

        {/* Hiển thị thông báo thành công */}
        {success && (
          <div className="mt-2 p-3 bg-green-100 text-green-700 border border-green-300 rounded text-sm">
            {success}
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-black"
              >
                Mã nhân viên
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-black border border-b-black rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-zinc-300"
                placeholder="Nhập mã nhân viên"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-black"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-black border border-b-black rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-zinc-300"
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div></div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-sky-400 hover:text-blue-500"
              >
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-base font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
