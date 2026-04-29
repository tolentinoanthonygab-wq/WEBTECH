<?php
// ============================================================
//  backend/public/register.php — UPDATED
// ============================================================
declare(strict_types=1);

require_once __DIR__ . '/../config/Database.php';

$db = Database::getConnection();
$shops = $db->query("SELECT id, shop_name FROM laundry_shops WHERE status = 'active' ORDER BY shop_name ASC")->fetchAll();

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $shopId    = $_POST['shop_id'] ?? '';
    $fname     = $_POST['first_name'] ?? '';
    $mname     = $_POST['middle_name'] ?? '';
    $lname     = $_POST['last_name'] ?? '';
    $email     = $_POST['email'] ?? '';
    $password  = $_POST['password'] ?? '';
    $contact   = $_POST['contact_number'] ?? '';
    $address   = $_POST['address'] ?? '';

    if (empty($shopId) || empty($fname) || empty($lname) || empty($email) || empty($password)) {
        $error = 'Please fill in all required fields.';
    } else {
        try {
            $chk = $db->prepare("SELECT id FROM customers WHERE email = :email LIMIT 1");
            $chk->execute([':email' => $email]);
            if ($chk->fetch()) {
                $error = 'Email already exists.';
            } else {
                $stmt = $db->prepare(
                    "INSERT INTO customers (shop_id, first_name, middle_name, last_name, email, password_hash, contact_number, address, status)
                     VALUES (:sid, :fn, :mn, :ln, :em, :pw, :cn, :ad, 'Pending')"
                );
                $stmt->execute([
                    ':sid' => $shopId,
                    ':fn'  => $fname,
                    ':mn'  => $mname,
                    ':ln'  => $lname,
                    ':em'  => strtolower(trim($email)),
                    ':pw'  => password_hash($password, PASSWORD_BCRYPT),
                    ':cn'  => $contact,
                    ':ad'  => $address
                ]);
                $success = 'Successfully registered! Please wait for staff approval.';
            }
        } catch (\Exception $e) {
            $error = 'Registration error: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><title>Register | Welaund</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<div class="login-container" style="max-width: 600px;">
    <div class="card shadow-lg">
        <div class="card-header"><h3>Customer Sign Up</h3></div>
        <div class="card-body p-4">
            <?php if($error): ?><div class="alert alert-danger"><?= $error ?></div><?php endif; ?>
            <?php if($success): ?>
                <div class="alert alert-success"><?= $success ?><br><a href="index.php" class="alert-link">Back to Login</a></div>
            <?php else: ?>
            <form method="POST">
                <div class="mb-3">
                    <label class="form-label">Shop <span class="text-danger">*</span></label>
                    <select name="shop_id" class="form-select" required>
                        <option value="">-- Select Shop --</option>
                        <?php foreach($shops as $s): ?><option value="<?= $s['id'] ?>"><?= htmlspecialchars((string)$s['shop_name']) ?></option><?php endforeach; ?>
                    </select>
                </div>
                <div class="row">
                    <div class="col-md-4 mb-3"><label class="form-label">First Name *</label><input type="text" name="first_name" class="form-control" required></div>
                    <div class="col-md-4 mb-3"><label class="form-label">Middle Name</label><input type="text" name="middle_name" class="form-control"></div>
                    <div class="col-md-4 mb-3"><label class="form-label">Last Name *</label><input type="text" name="last_name" class="form-control" required></div>
                </div>
                <div class="mb-3"><label class="form-label">Email Address *</label><input type="email" name="email" class="form-control" required></div>
                <div class="mb-3"><label class="form-label">Contact Number</label><input type="text" name="contact_number" class="form-control"></div>
                <div class="mb-3"><label class="form-label">Password *</label><input type="password" name="password" class="form-control" required></div>
                <div class="mb-3"><label class="form-label">Address</label><textarea name="address" class="form-control" rows="2"></textarea></div>
                <div class="d-grid gap-2"><button type="submit" class="btn btn-primary btn-lg">Register</button><a href="index.php" class="btn btn-link">Login Instead</a></div>
            </form>
            <?php endif; ?>
        </div>
    </div>
</div>
</body>
</html>
