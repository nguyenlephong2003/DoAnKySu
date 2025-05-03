<?php
class Database {
    private $host = "localhost";
    private $db_name = "ql_nhathauxaydung";
    private $user = "admin";
    private $password = "123";
    private $conn;

    public function getConn() {
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->user, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
            $this->conn->exec("set names utf8");
            return $this->conn;
        } catch(PDOException $exception) {
            echo "Error: " . $exception->getMessage();
            exit;
        }
    }
}
?>