<?php
// ============================================================
//  public/staff/dashboard.php — Staff Dashboard
// ============================================================
declare(strict_types=1);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/StaffController.php';

AuthController::requireRole('staff');

$staff = new StaffController($_SESSION['shop_id'], $_SESSION['user_id']);

// Handle Customer Approvals/Rejections
if (isset($_GET['approve_customer'])) {
    $staff->updateCustomerStatus($_GET['approve_customer'], 'Approved');
    header('Location: dashboard.php?msg=customer_approved');
    exit;
}
if (isset($_GET['reject_customer'])) {
    $staff->updateCustomerStatus($_GET['reject_customer'], 'Rejected');
    header('Location: dashboard.php?msg=customer_rejected');
    exit;
}

$pendingCustomers = $staff->getPendingCustomers();
$activeOrders     = $staff->getActiveOrders();
$dailyTotal       = $staff->getDailyTotal();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Staff Dashboard | Welaund</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <link rel="stylesheet" href="../../assets/css/style.css">
</head>
<body>

<div class="container-fluid">
    <div class="row">
        <!-- Sidebar -->
        <nav class="col-md-2 d-none d-md-block sidebar">
            <div class="position-sticky pt-4">
                <h4 class="px-4 text-fresh-blue fw-bold mb-4">WELAUND</h4>
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link active" href="dashboard.php">
                            <i class="bi bi-speedometer2 me-2"></i> Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="orders.php">
                            <i class="bi bi-plus-circle me-2"></i> New Order
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../logout.php">
                            <i class="bi bi-box-arrow-left me-2"></i> Logout
                        </a>
                    </li>
                </ul>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="col-md-10 ms-sm-auto px-md-4 py-4">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">Staff Dashboard — <?= htmlspecialchars((string)$_SESSION['shop_name']) ?></h1>
                <div class="btn-toolbar mb-2 mb-md-0">
                    <span class="badge bg-success p-2">Today's Sales: ₱<?= number_format($dailyTotal, 2) ?></span>
                </div>
            </div>

            <!-- New Registration Requests -->
            <div class="dashboard-card mb-4">
                <h5 class="mb-3 d-flex align-items-center">
                    <i class="bi bi-person-plus me-2 text-primary"></i> 
                    New Customer Requests 
                    <?php if (count($pendingCustomers) > 0): ?>
                        <span class="badge bg-danger ms-2"><?= count($pendingCustomers) ?></span>
                    <?php endif; ?>
                </h5>
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead class="table-light">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Date Applied</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($pendingCustomers)): ?>
                                <tr><td colspan="5" class="text-center text-muted">No pending registrations.</td></tr>
                            <?php else: ?>
                                <?php foreach ($pendingCustomers as $c): ?>
                                    <tr>
                                        <td><?= htmlspecialchars((string)($c['first_name'] . ' ' . $c['last_name'])) ?></td>
                                        <td><?= htmlspecialchars((string)$c['email']) ?></td>
                                        <td><?= htmlspecialchars((string)$c['contact_number']) ?></td>
                                        <td><?= date('M d, Y', strtotime($c['last_updated'])) ?></td>
                                        <td>
                                            <a href="?approve_customer=<?= $c['id'] ?>" class="btn btn-sm btn-success">Approve</a>
                                            <a href="?reject_customer=<?= $c['id'] ?>" class="btn btn-sm btn-outline-danger">Reject</a>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Active Orders Queue -->
            <div class="dashboard-card">
                <h5 class="mb-3 d-flex align-items-center">
                    <i class="bi bi-clock-history me-2 text-fresh-blue"></i> 
                    Active Laundry Queue
                </h5>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Order Ref</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($activeOrders)): ?>
                                <tr><td colspan="5" class="text-center text-muted">No ongoing orders.</td></tr>
                            <?php else: ?>
                                <?php foreach ($activeOrders as $o): ?>
                                    <tr>
                                        <td class="fw-bold"><?= htmlspecialchars((string)$o['order_ref']) ?></td>
                                        <td><?= htmlspecialchars((string)($o['first_name'] . ' ' . $o['last_name'])) ?></td>
                                        <td>
                                            <span class="badge bg-primary"><?= $o['order_status'] ?></span>
                                        </td>
                                        <td><?= date('M d, h:i A', strtotime($o['created_on'])) ?></td>
                                        <td>
                                            <a href="order_details.php?id=<?= $o['id'] ?>" class="btn btn-sm btn-outline-secondary">View</a>
                                            <a href="update_status.php?id=<?= $o['id'] ?>&status=Done" class="btn btn-sm btn-info text-white">Mark Done</a>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
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
