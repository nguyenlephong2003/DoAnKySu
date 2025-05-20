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
        // Kiểm tra cookie auth_token
        if (!isset($_COOKIE['auth_token'])) {
            return [
                'valid' => false,
                'message' => 'Token không được cung cấp'
            ];
        }
        
        $jwt = $_COOKIE['auth_token'];
        
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