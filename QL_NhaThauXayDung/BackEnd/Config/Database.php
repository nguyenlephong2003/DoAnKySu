<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

class Database
{
    // Thông tin kết nối local
    // private $local_host = "localhost";
    // private $local_db_name = "ql_nhathauxaydung";
    // private $local_user = "admin";
    // private $local_password = "123";

    private $local_host = "sql304.ezyro.com";
    private $local_db_name = "ezyro_39222478_ql_nhathauxaydung";
    private $local_user = "ezyro_39222478";
    private $local_password = "p2hgtzbw";

    // Thông tin kết nối host
    private $host;
    private $db_name;
    private $user;
    private $password;

    private $conn;

    public function __construct()
    {
        // Load .env file từ thư mục Config
        $dotenv = Dotenv::createImmutable(__DIR__);
        $dotenv->load();

        // Lấy thông tin từ .env
        $this->host = $_ENV['DB_HOST'];
        $this->db_name = $_ENV['DB_NAME'];
        $this->user = $_ENV['DB_USER'];
        $this->password = $_ENV['DB_PASS'];
    }

    public function getConn()
    {
        try {
            // Kết nối tới host
            // $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->user, $this->password);

            //Kết nối local (đã comment)
            $this->conn = new PDO("mysql:host=" . $this->local_host . ";dbname=" . $this->local_db_name, 
                                $this->local_user, 
                                $this->local_password);
            

            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
            return $this->conn;
        } catch (PDOException $exception) {
            echo "Error: " . $exception->getMessage();
            exit;
        }
    }
}
