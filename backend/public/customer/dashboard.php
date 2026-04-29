<?php
// ============================================================
//  backend/public/customer/dashboard.php
// ============================================================
declare(strict_types=1);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../config/Database.php';

AuthController::requireRole('customer');

$db = Database::getConnection();
$customerId = $_SESSION['user_id'];
$shopId     = $_SESSION['shop_id'];

// Fetch customer's orders
$stmt = $db->prepare(
    "SELECT o.id, o.order_ref, o.order_status, o.created_on,
            o.total_amount AS total
     FROM orders o
     WHERE o.customer_id = :cid AND o.shop_id = :sid
     ORDER BY o.created_on DESC"
);
$stmt->execute([':cid' => $customerId, ':sid' => $shopId]);
$orders = $stmt->fetchAll();

// Fetch shop context for payment info if something is 'Done'
$shop_stmt = $db->prepare("SELECT shop_name, gcash_number, gcash_name FROM laundry_shops WHERE id = :sid");
$shop_stmt->execute([':sid' => $shopId]);
$shop = $shop_stmt->fetch();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Laundry | Welaund</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <link rel="stylesheet" href="../../assets/css/style.css">
</head>
<body>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
    <div class="container">
        <a class="navbar-brand text-fresh-blue fw-bold" href="#">WELAUND</a>
        <div class="ms-auto d-flex align-items-center">
            <span class="text-white me-3 d-none d-md-inline">Welcome, <?= htmlspecialchars((string)$_SESSION['user_name']) ?></span>
            <a href="../logout.php" class="btn btn-outline-light btn-sm">Logout</a>
        </div>
    </div>
</nav>

<div class="container">
    <div class="row">
        <div class="col-md-12 mb-4">
            <h3 class="mb-3">My Order History</h3>
            <p class="text-muted">Tracking orders at <strong><?= htmlspecialchars((string)$shop['shop_name']) ?></strong></p>
        </div>

        <div class="col-md-12">
            <div class="dashboard-card">
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Order Reference</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th class="text-end">Amount</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($orders)): ?>
                                <tr><td colspan="5" class="text-center py-4">You haven't placed any orders yet.</td></tr>
                            <?php else: ?>
                                <?php foreach ($orders as $o): ?>
                                    <tr>
                                        <td class="fw-bold"><?= htmlspecialchars((string)$o['order_ref']) ?></td>
                                        <td>
                                            <?php if ($o['order_status'] === 'Ongoing'): ?>
                                                <span class="badge bg-primary">Processing</span>
                                            <?php elseif ($o['order_status'] === 'Done'): ?>
                                                <span class="badge bg-info text-white">Ready for Payment</span>
                                            <?php elseif ($o['order_status'] === 'Paid'): ?>
                                                <span class="badge bg-success">Paid & Completed</span>
                                            <?php else: ?>
                                                <span class="badge bg-secondary"><?= $o['order_status'] ?></span>
                                            <?php endif; ?>
                                        </td>
                                        <td><?= date('M d, Y', strtotime($o['created_on'])) ?></td>
                                        <td class="text-end">₱<?= number_format((float)$o['total'], 2) ?></td>
                                        <td class="text-end">
                                            <?php if ($o['order_status'] === 'Done'): ?>
                                                <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#payModal<?= $o['id'] ?>">
                                                    Pay Now
                                                </button>

                                                <!-- Payment Modal -->
                                                <div class="modal fade text-start" id="payModal<?= $o['id'] ?>" tabindex="-1">
                                                    <div class="modal-dialog">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h5 class="modal-title">Payment Details</h5>
                                                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                                            </div>
                                                            <div class="modal-body">
                                                                <p>Please send <strong>₱<?= number_format((float)$o['total'], 2) ?></strong> to the shop's GCash:</p>
                                                                <div class="bg-light p-3 rounded text-center">
                                                                    <h4 class="mb-1"><?= htmlspecialchars((string)$shop['gcash_number']) ?></h4>
                                                                    <p class="text-muted mb-0"><?= htmlspecialchars((string)$shop['gcash_name']) ?></p>
                                                                </div>
                                                                <p class="mt-3 small">After payment, provide your <strong>Reference Number</strong> to the staff for verification.</p>
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            <?php else: ?>
                                                <button class="btn btn-outline-secondary btn-sm" disabled>View Details</button>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
