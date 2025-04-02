import React, { useState } from 'react';
import huitImage from '../assets/huit_1.jpg';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { username, password });
    // Add your authentication logic here
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${huitImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg border shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">Đăng Nhập</h1>
          <p className="mt-2 text-base text-gray-700">
            Vui lòng nhập thông tin đăng nhập của bạn
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-800"
              >
                Tên đăng nhập
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tên đăng nhập"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800"
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
                className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="remember-me"
                className="block ml-2 text-sm text-gray-800"
              >
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-base font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-700">
            Chưa có tài khoản?{' '}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;