<?php
// ============================================================
//  controllers/SuperAdminController.php
//  Global oversight — no shop_id restriction
// ============================================================
declare(strict_types=1);

require_once __DIR__ . '/../config/Database.php';

class SuperAdminController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    // ─────────────────────────────────────────────────────────
    //  LAUNDRY SHOPS
    // ─────────────────────────────────────────────────────────

    public function getAllShops(): array
    {
        return $this->db
            ->query('SELECT s.id, s.shop_name, s.address, s.gcash_number, s.gcash_name, s.status, s.created_on,
                            o.first_name as owner_first, o.last_name as owner_last
                     FROM laundry_shops s
                     LEFT JOIN owners o ON o.id = s.owner_id
                     ORDER BY s.created_on DESC')
            ->fetchAll();
    }

    /**
     * Create owner first, then shop (owner_id NOT NULL constraint).
     */
    public function createShopWithOwner(
        string $shopName,
        string $shopAddress,
        string $shopContact,
        string $ownerFName,
        string $ownerLName,
        string $ownerEmail,
        string $ownerPassword,
        string $createdBy
    ): bool {
        $this->db->beginTransaction();
        try {
            // 1. Create owner
            $o = $this->db->prepare(
                'INSERT INTO owners (first_name, last_name, email, password_hash, created_by)
                 VALUES (:fn, :ln, :email, :pwd, :cb) RETURNING id'
            );
            $o->execute([
                ':fn'    => $ownerFName,
                ':ln'    => $ownerLName,
                ':email' => strtolower(trim($ownerEmail)),
                ':pwd'   => password_hash($ownerPassword, PASSWORD_BCRYPT),
                ':cb'    => $createdBy,
            ]);
            $ownerId = $o->fetchColumn();

            // 2. Create shop with owner_id
            $s = $this->db->prepare(
                'INSERT INTO laundry_shops
                    (owner_id, shop_name, address, contact_number, created_by)
                 VALUES (:oid, :name, :addr, :contact, :cb)'
            );
            $s->execute([
                ':oid'     => $ownerId,
                ':name'    => $shopName,
                ':addr'    => $shopAddress,
                ':contact' => $shopContact,
                ':cb'      => $createdBy,
            ]);

            $this->db->commit();
            return true;
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function setShopStatus(string $shopId, string $status): bool
    {
        $allowed = ['active', 'inactive'];
        if (!in_array($status, $allowed, true)) return false;

        $stmt = $this->db->prepare(
            'UPDATE laundry_shops SET status = :status WHERE id = :id'
        );
        return $stmt->execute([':status' => $status, ':id' => $shopId]);
    }

    // ─────────────────────────────────────────────────────────
    //  SUPER ADMINS  (manage other SA accounts)
    // ─────────────────────────────────────────────────────────

    public function getAllSuperAdmins(): array
    {
        return $this->db->query(
            'SELECT id, username, email, status, created_on FROM super_admins ORDER BY created_on DESC'
        )->fetchAll();
    }

    public function createSuperAdmin(string $username, string $email, string $password): bool
    {
        $stmt = $this->db->prepare(
            'INSERT INTO super_admins (username, email, password_hash) VALUES (:u, :e, :p)'
        );
        return $stmt->execute([
            ':u' => $username,
            ':e' => strtolower(trim($email)),
            ':p' => password_hash($password, PASSWORD_BCRYPT),
        ]);
    }

    public function setSuperAdminStatus(string $id, string $status): bool
    {
        $allowed = ['active', 'inactive'];
        if (!in_array($status, $allowed, true)) return false;

        $stmt = $this->db->prepare('UPDATE super_admins SET status = :status WHERE id = :id');
        return $stmt->execute([':status' => $status, ':id' => $id]);
    }

    // ─────────────────────────────────────────────────────────
    //  OWNERS
    // ─────────────────────────────────────────────────────────

    public function getAllOwners(): array
    {
        return $this->db->query(
            "SELECT o.id, o.first_name, o.last_name, o.email, o.status, 
                    STRING_AGG(s.shop_name, ', ') as shop_name
             FROM owners o
             LEFT JOIN laundry_shops s ON s.owner_id = o.id
             GROUP BY o.id
             ORDER BY o.created_on DESC"
        )->fetchAll();
    }

    public function setOwnerStatus(string $ownerId, string $status): bool
    {
        $allowed = ['active', 'inactive'];
        if (!in_array($status, $allowed, true)) return false;

        $stmt = $this->db->prepare(
            'UPDATE owners SET status = :status WHERE id = :id'
        );
        return $stmt->execute([':status' => $status, ':id' => $ownerId]);
    }

    // ─────────────────────────────────────────────────────────
    //  STAFF  (global view)
    // ─────────────────────────────────────────────────────────

    public function getAllStaff(): array
    {
        return $this->db->query(
            'SELECT st.id, st.first_name, st.last_name, st.email, st.status, s.shop_name
             FROM staff st
             JOIN laundry_shops s ON s.id = st.shop_id
             ORDER BY st.created_on DESC'
        )->fetchAll();
    }

    public function setStaffStatus(string $staffId, string $status): bool
    {
        $allowed = ['active', 'inactive'];
        if (!in_array($status, $allowed, true)) return false;

        $stmt = $this->db->prepare('UPDATE staff SET status = :status WHERE id = :id');
        return $stmt->execute([':status' => $status, ':id' => $staffId]);
    }

    // ─────────────────────────────────────────────────────────
    //  CUSTOMERS  (global view)
    // ─────────────────────────────────────────────────────────

    public function getAllCustomers(): array
    {
        return $this->db->query(
            'SELECT c.id, c.first_name, c.last_name, c.email, c.status, s.shop_name
             FROM customers c
             JOIN laundry_shops s ON s.id = c.shop_id
             ORDER BY c.last_updated DESC'
        )->fetchAll();
    }

    public function setCustomerStatus(string $customerId, string $status): bool
    {
        $allowed = ['Approved', 'Rejected', 'Pending', 'inactive'];
        if (!in_array($status, $allowed, true)) return false;

        $stmt = $this->db->prepare('UPDATE customers SET status = :status WHERE id = :id');
        return $stmt->execute([':status' => $status, ':id' => $customerId]);
    }

    // ─────────────────────────────────────────────────────────
    //  PLATFORM STATS
    // ─────────────────────────────────────────────────────────

    public function getPlatformStats(): array
    {
        return [
            'total_shops'     => (int) $this->db->query('SELECT COUNT(*) FROM laundry_shops')->fetchColumn(),
            'active_shops'    => (int) $this->db->query("SELECT COUNT(*) FROM laundry_shops WHERE status='active'")->fetchColumn(),
            'total_owners'    => (int) $this->db->query('SELECT COUNT(*) FROM owners')->fetchColumn(),
            'total_staff'     => (int) $this->db->query('SELECT COUNT(*) FROM staff')->fetchColumn(),
            'total_customers' => (int) $this->db->query('SELECT COUNT(*) FROM customers')->fetchColumn(),
            'pending_customers' => (int) $this->db->query("SELECT COUNT(*) FROM customers WHERE status='Pending'")->fetchColumn(),
            'total_orders'    => (int) $this->db->query('SELECT COUNT(*) FROM orders')->fetchColumn(),
            'total_revenue'   => (float) $this->db->query('SELECT COALESCE(SUM(amount_paid),0) FROM payments')->fetchColumn(),
            'overdue_orders'  => (int) $this->db->query("SELECT COUNT(*) FROM orders WHERE order_status NOT IN ('Done','Cancelled') AND created_on < NOW() - INTERVAL '3 days'")->fetchColumn(),
        ];
    }

    // ─────────────────────────────────────────────────────────
    //  ENTITY OVERSIGHT — Services, Orders, Payments
    // ─────────────────────────────────────────────────────────

    public function getAllServicesGlobal(): array
    {
        return $this->db->query(
            "SELECT sv.id, sv.service_name, sv.unit, sv.price_per_unit, sv.status, s.shop_name
             FROM services sv
             JOIN laundry_shops s ON s.id = sv.shop_id
             ORDER BY s.shop_name, sv.service_name"
        )->fetchAll();
    }

    public function setServiceStatus(string $id, string $status): bool
    {
        $allowed = ['active', 'inactive'];
        if (!in_array($status, $allowed, true)) return false;
        $stmt = $this->db->prepare('UPDATE services SET status = :status WHERE id = :id');
        return $stmt->execute([':status' => $status, ':id' => $id]);
    }

    public function getAllOrdersGlobal(int $limit = 100): array
    {
        return $this->db->query(
            "SELECT o.id, o.order_ref, o.order_status, o.payment_status, o.total_amount, o.created_on,
                    c.first_name, c.last_name, s.shop_name
             FROM orders o
             JOIN customers c ON c.id = o.customer_id
             JOIN laundry_shops s ON s.id = o.shop_id
             ORDER BY o.created_on DESC
             LIMIT {$limit}"
        )->fetchAll();
    }

    public function setOrderStatus(string $id, string $status): bool
    {
        $allowed = ['Requested', 'Ongoing', 'Done', 'Cancelled'];
        if (!in_array($status, $allowed, true)) return false;
        $stmt = $this->db->prepare("UPDATE orders SET order_status = :status, last_updated = NOW() WHERE id = :id");
        return $stmt->execute([':status' => $status, ':id' => $id]);
    }

    public function getAllPaymentsGlobal(int $limit = 100): array
    {
        return $this->db->query(
            "SELECT p.id, p.amount_paid, p.payment_method, p.status, p.created_on,
                    o.order_ref, c.first_name, c.last_name, s.shop_name
             FROM payments p
             JOIN orders o ON o.id = p.order_id
             JOIN customers c ON c.id = o.customer_id
             JOIN laundry_shops s ON s.id = o.shop_id
             ORDER BY p.created_on DESC
             LIMIT {$limit}"
        )->fetchAll();
    }

    public function setPaymentStatus(string $id, string $status): bool
    {
        $allowed = ['Verified', 'Pending'];
        if (!in_array($status, $allowed, true)) return false;
        $stmt = $this->db->prepare("UPDATE payments SET status = :status WHERE id = :id");
        return $stmt->execute([':status' => $status, ':id' => $id]);
    }
}
