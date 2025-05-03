<?php
require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;

class VerifyToken {
    private $secretKey;
    
    public function __construct() {
        $this->secretKey = "your_secret_key_nhathau_xaydung_2024"; // Khóa bí mật PHẢI giống với khóa trong Login_API.php
    }
    
    public function validate() {
        // Lấy header Authorization
        $headers = getallheaders(); // sử dụng hàm getallheaders() thay vì apache_request_headers()
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        // Kiểm tra header Authorization có tồn tại không
        if (!$authHeader) {
            return [
                'valid' => false,
                'message' => 'Token không được cung cấp'
            ];
        }
        
        // Tách "Bearer" khỏi token
        $arr = explode(" ", $authHeader);
        if (count($arr) != 2) {
            return [
                'valid' => false,
                'message' => 'Token không đúng định dạng'
            ];
        }
        
        $jwt = $arr[1];
        
        if (!$jwt) {
            return [
                'valid' => false,
                'message' => 'Token không được cung cấp'
            ];
        }
        
        // Xác thực JWT
        try {
            $decoded = JWT::decode($jwt, new Key($this->secretKey, 'HS256'));
            return [
                'valid' => true,
                'data' => $decoded->data
            ];
        } catch (ExpiredException $e) {
            return [
                'valid' => false,
                'message' => 'Token đã hết hạn'
            ];
        } catch (Exception $e) {
            return [
                'valid' => false,
                'message' => 'Token không hợp lệ: ' . $e->getMessage()
            ];
        }
    }
}
?>