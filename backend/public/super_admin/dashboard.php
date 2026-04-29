<?php
// ============================================================
//  backend/public/super_admin/dashboard.php
// ============================================================
declare(strict_types=1);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/SuperAdminController.php';

AuthController::requireRole('super_admin');

$admin = new SuperAdminController();
$stats = $admin->getPlatformStats();
$shops = $admin->getAllShops();

// Handle Shop Activation/Deactivation
if (isset($_GET['toggle_shop'])) {
    $currentStatus = $_GET['status'] === 'active' ? 'inactive' : 'active';
    $admin->setShopStatus($_GET['toggle_shop'], $currentStatus);
    header('Location: dashboard.php?msg=updated');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Super Admin | Welaund</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <link rel="stylesheet" href="../../assets/css/style.css">
</head>
<body>

<div class="container-fluid">
    <div class="row">
        <nav class="col-md-2 d-none d-md-block sidebar">
            <div class="position-sticky pt-4">
                <h4 class="px-4 text-fresh-blue fw-bold mb-4">WELAUND</h4>
                <ul class="nav flex-column">
                    <li class="nav-item"><a class="nav-link active" href="#"><i class="bi bi-shield-lock me-2"></i> Super Admin</a></li>
                    <li class="nav-item"><a class="nav-link" href="../logout.php"><i class="bi bi-box-arrow-left me-2"></i> Logout</a></li>
                </ul>
            </div>
        </nav>

        <main class="col-md-10 ms-sm-auto px-md-4 py-4">
            <div class="pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">Global Platform Oversight</h1>
            </div>

            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="dashboard-card text-center py-4 border-primary">
                        <h3 class="text-primary"><?= $stats['total_shops'] ?></h3>
                        <p class="mb-0 text-muted">Total Shops</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="dashboard-card text-center py-4 border-success">
                        <h3 class="text-success"><?= $stats['total_customers'] ?></h3>
                        <p class="mb-0 text-muted">Total Customers</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="dashboard-card text-center py-4 border-info">
                        <h3 class="text-info"><?= $stats['total_orders'] ?></h3>
                        <p class="mb-0 text-muted">Total Orders</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="dashboard-card text-center py-4 border-warning">
                        <h3 class="text-warning">₱<?= number_format($stats['total_revenue'], 2) ?></h3>
                        <p class="mb-0 text-muted">Platform Revenue</p>
                    </div>
                </div>
            </div>

            <div class="dashboard-card">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="mb-0">Laundry Shops Ecosystem</h5>
                    <button class="btn btn-primary btn-sm"><i class="bi bi-plus-lg"></i> Register New Shop</button>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Shop Name</th>
                                <th>Owner Email</th>
                                <th>GCash</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($shops as $s): ?>
                                <tr>
                                    <td>
                                        <div class="fw-bold"><?= htmlspecialchars((string)$s['shop_name']) ?></div>
                                        <small class="text-muted"><?= htmlspecialchars((string)$s['address']) ?></small>
                                    </td>
                                    <td><em>Fetching...</em></td>
                                    <td>
                                        <?= htmlspecialchars((string)($s['gcash_name'] ?: 'N/A')) ?><br>
                                        <small class="text-muted"><?= htmlspecialchars((string)($s['gcash_number'] ?: '')) ?></small>
                                    </td>
                                    <td>
                                        <span class="badge <?= $s['status'] === 'active' ? 'bg-success' : 'bg-danger' ?>">
                                            <?= ucfirst($s['status']) ?>
                                        </span>
                                    </td>
                                    <td><?= date('M d, Y', strtotime($s['created_on'])) ?></td>
                                    <td>
                                        <a href="?toggle_shop=<?= $s['id'] ?>&status=<?= $s['status'] ?>" 
                                           class="btn btn-sm <?= $s['status'] === 'active' ? 'btn-outline-danger' : 'btn-outline-success' ?>">
                                            <?= $s['status'] === 'active' ? 'Deactivate' : 'Activate' ?>
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
