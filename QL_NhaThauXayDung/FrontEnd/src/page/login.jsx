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
      const response = await fetch(`${BASE_URL}NguoiDung_API/DangNhap_API.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          MaNhanVien: username,
          MatKhau: password,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Phản hồi lỗi từ máy chủ:", {
          status: response.status,
          statusText: response.statusText,
          body: text,
        });
        throw new Error(
          `Máy chủ phản hồi lỗi ${response.status}: ${response.statusText}`
        );
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Lỗi khi phân tích JSON:", jsonError);
        throw new Error("Dữ liệu trả về không hợp lệ từ máy chủ.");
      }

      if (data.message === "success") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.nhanvien[0]));
        localStorage.setItem("expires", data.expires);
      
        setSuccess("Đăng nhập thành công!");
        setError("");
      
        // Lấy 2 ký tự đầu của MaNhanVien
        const maNV = data.nhanvien[0].MaNhanVien;
        const maLoai = maNV.substring(0, 2);
        
        // Chuyển hướng dựa vào mã loại
        setTimeout(() => {
          switch (maLoai) {
            case "AD":
              navigate("/admin");
              break;
            case "GD":
              navigate("/giamdoc");
              break;
            case "KT":
              navigate("/ketoan");
              break;
            case "NS":
              navigate("/nhansu");
              break;
            case "QL":
              navigate("/qlcongtrinh");
              break;
            case "K":
              navigate("/nhanvienkho");
              break;
              case "TV":
                navigate("/nhanvientuvan");
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
      setError(
        `Vui lòng kiểm trả lại thông tin`
      );
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
