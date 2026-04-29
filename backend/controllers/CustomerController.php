<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/Database.php';

class CustomerController
{
    private PDO $db;
    private string $customerId;

    public function __construct(string $customerId)
    {
        $this->db         = Database::getConnection();
        $this->customerId = $customerId;
    }

    /** Get all orders for this specific customer */
    public function getOrders(): array
    {
        $stmt = $this->db->prepare(
            "SELECT o.id, o.order_ref, o.order_status, o.total_amount, o.created_on, o.payment_status,
                    s.shop_name, s.address as shop_address
             FROM orders o
             JOIN laundry_shops s ON s.id = o.shop_id
             WHERE o.customer_id = :cid
             ORDER BY o.created_on DESC"
        );
        $stmt->execute([':cid' => $this->customerId]);
        return $stmt->fetchAll();
    }

    /** Get customer profile info */
    public function getProfile(): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT id, first_name, middle_name, last_name, email, contact_number, address, status 
             FROM customers WHERE id = :cid"
        );
        $stmt->execute([':cid' => $this->customerId]);
        return $stmt->fetch() ?: null;
    }

    /** Get services for the customer's shop */
    public function getShopServices(string $shopId): array
    {
        $stmt = $this->db->prepare(
            "SELECT id, service_name, unit, price_per_unit, category
             FROM services WHERE shop_id = :sid AND status = 'active'
             ORDER BY category, service_name"
        );
        $stmt->execute([':sid' => $shopId]);
        return $stmt->fetchAll();
    }

    public function updateProfile(array $data): bool
    {
        $stmt = $this->db->prepare(
            "UPDATE customers SET 
                first_name = :fn, middle_name = :mn, last_name = :ln, 
                contact_number = :cn, address = :addr, last_updated = NOW()
             WHERE id = :cid"
        );
        return $stmt->execute([
            ':fn'   => $data['first_name'],
            ':mn'   => $data['middle_name'] ?? '',
            ':ln'   => $data['last_name'],
            ':cn'   => $data['contact_number'] ?? '',
            ':addr' => $data['address'] ?? '',
            ':cid'  => $this->customerId
        ]);
    }

    public function updatePassword(string $current, string $new): bool
    {
        $stmt = $this->db->prepare("SELECT password_hash FROM customers WHERE id = :id");
        $stmt->execute([':id' => $this->customerId]);
        $hash = $stmt->fetchColumn();

        if ($hash && !password_verify($current, $hash)) return false;

        $newHash = password_hash($new, PASSWORD_BCRYPT);
        $stmt = $this->db->prepare("UPDATE customers SET password_hash = :hash, last_updated = NOW() WHERE id = :id");
        return $stmt->execute([':hash' => $newHash, ':id' => $this->customerId]);
    }

    public function createRequest(string $shopId, string $type): string
    {
        $orderRef = 'REQ-' . strtoupper(substr(uniqid('', true), -6));
        $stmt = $this->db->prepare(
            "INSERT INTO orders (order_ref, customer_id, shop_id, pickup_delivery_type, order_status)
             VALUES (:ref, :cid, :sid, :type, 'Requested') RETURNING id"
        );
        $stmt->execute([
            ':ref'  => $orderRef,
            ':cid'  => $this->customerId,
            ':sid'  => $shopId,
            ':type' => $type
        ]);
        return $orderRef;
    }
}
