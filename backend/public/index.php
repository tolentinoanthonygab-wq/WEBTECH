<?php
// ============================================================
//  public/index.php — Unified Login Page
// ============================================================
declare(strict_types=1);

require_once __DIR__ . '/../controllers/AuthController.php';

session_start();

// If already logged in, redirect to respective dashboard
if (!empty($_SESSION['logged_in'])) {
    switch ($_SESSION['role']) {
        case 'super_admin': header('Location: super_admin/dashboard.php'); break;
        case 'owner':       header('Location: owner/dashboard.php');       break;
        case 'staff':       header('Location: staff/dashboard.php');       break;
        case 'customer':    header('Location: customer/dashboard.php');    break;
    }
    exit;
}

$error = $_GET['error'] ?? '';
$success = $_GET['success'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $role     = $_POST['role'] ?? '';

    $auth = new AuthController();
    $result = $auth->login($email, $password, $role);

    if ($result === true) {
        // Redirection handled by switch above on next load, or manually here
        header('Location: index.php');
        exit;
    } else {
        $error = $result;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | Welaund SaaS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<div class="login-container">
    <div class="card">
        <div class="card-header">
            <h3>WELAUND</h3>
            <p class="text-muted mb-0">Professional Laundry Management</p>
        </div>
        <div class="card-body p-4">
            <?php if ($error): ?>
                <div class="alert alert-danger"><?= htmlspecialchars((string)$error) ?></div>
            <?php endif; ?>
            <?php if ($success): ?>
                <div class="alert alert-success"><?= htmlspecialchars((string)$success) ?></div>
            <?php endif; ?>

            <form method="POST">
                <div class="mb-3">
                    <label class="form-label">Select Role</label>
                    <select name="role" class="form-select" required>
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="owner">Shop Owner</option>
                        <option value="super_admin">Super Admin</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Email Address</label>
                    <input type="email" name="email" class="form-control" placeholder="name@example.com" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input type="password" name="password" class="form-control" placeholder="••••••••" required>
                </div>
                <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-primary btn-lg">Login</button>
                </div>
            </form>
        </div>
        <div class="card-footer text-center bg-white border-0 pb-4">
            <p class="mb-0 text-muted">Don't have a customer account?</p>
            <a href="register.php" class="text-decoration-none">Register as Customer</a>
        </div>
    </div>
</div>

</body>
</html>
