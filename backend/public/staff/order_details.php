<?php
// ============================================================
//  public/staff/order_details.php — Order Details & Payment
// ============================================================
declare(strict_types=1);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/StaffController.php';

AuthController::requireRole('staff');

$staff = new StaffController($_SESSION['shop_id'], $_SESSION['user_id']);
$orderId = $_GET['id'] ?? '';
$order = $staff->getOrder($orderId);

if (!$order) {
    header('Location: dashboard.php');
    exit;
}

// Handle Status Updates
if (isset($_POST['update_status'])) {
    $staff->updateOrderStatus($orderId, $_POST['status']);
    header("Location: order_details.php?id=$orderId&msg=updated");
    exit;
}

// Handle Payment (Cash)
if (isset($_POST['pay_cash'])) {
    $amount = (float)$_POST['amount'];
    $staff->recordCashPayment($orderId, $amount);
    header("Location: order_details.php?id=$orderId&msg=paid");
    exit;
}

// Compute Total
$total = 0;
foreach($order['items'] as $item) { $total += (float)$item['subtotal']; }

$shopGcash = $staff->getShopGcashDetails();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Detail | Welaund</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <link rel="stylesheet" href="../../assets/css/style.css">
    <style>
        @media print {
            .no-print { display: none !important; }
            .sidebar { display: none !important; }
            main { margin-left: 0 !important; width: 100% !important; }
            .receipt { border: 1px dashed #ccc; padding: 20px; }
        }
    </style>
</head>
<body>

<div class="container-fluid">
    <div class="row">
        <nav class="col-md-2 d-none d-md-block sidebar no-print">
            <div class="position-sticky pt-4">
                <h4 class="px-4 text-fresh-blue fw-bold mb-4">WELAUND</h4>
                <ul class="nav flex-column">
                    <li class="nav-item"><a class="nav-link" href="dashboard.php"><i class="bi bi-arrow-left me-2"></i> Dashboard</a></li>
                </ul>
            </div>
        </nav>

        <main class="col-md-10 ms-sm-auto px-md-4 py-4">
            <div class="d-flex justify-content-between no-print">
                <h1 class="h2">Order: <?= htmlspecialchars((string)$order['order_ref']) ?></h1>
                <div>
                    <button onclick="window.print()" class="btn btn-outline-dark me-2"><i class="bi bi-printer"></i> Print Receipt</button>
                    <?php if($order['payment_status'] !== 'Paid'): ?>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#paymentModal"><i class="bi bi-cash-stack"></i> Receive Payment</button>
                    <?php endif; ?>
                </div>
            </div>

            <div class="row mt-4">
                <div class="col-md-7">
                    <div class="dashboard-card mb-4 receipt">
                        <h4>Receipt</h4>
                        <hr>
                        <div class="row mb-3">
                            <div class="col-6">
                                <small class="text-muted d-block">CUSTOMER</small>
                                <strong><?= htmlspecialchars((string)($order['first_name'] . ' ' . $order['last_name'])) ?></strong><br>
                                <?= htmlspecialchars((string)$order['contact_number']) ?>
                            </div>
                            <div class="col-6 text-end">
                                <small class="text-muted d-block">DATE</small>
                                <?= date('M d, Y h:i A', strtotime($order['created_on'])) ?>
                                <div class="mt-2 text-uppercase">
                                    <span class="badge <?= $order['payment_status'] === 'Paid' ? 'bg-success' : 'bg-warning' ?>">
                                        <?= $order['order_status'] ?> (<?= $order['payment_status'] ?>)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Service</th>
                                    <th>Weight</th>
                                    <th class="text-end">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach($order['items'] as $item): ?>
                                    <tr>
                                        <td><?= htmlspecialchars((string)$item['service_name']) ?></td>
                                        <td><?= $item['quantity_or_weight'] ?> <?= $item['unit'] ?></td>
                                        <td class="text-end">₱<?= number_format((float)$item['subtotal'], 2) ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colspan="2" class="text-end">Total</th>
                                    <th class="text-end">₱<?= number_format($total, 2) ?></th>
                                </tr>
                            </tfoot>
                        </table>
                        <?php if($order['notes']): ?>
                            <div class="mt-3">
                                <small class="text-muted">Collector Notes:</small><br>
                                <?= nl2br(htmlspecialchars((string)$order['notes'])) ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Admin Controls -->
                <div class="col-md-5 no-print">
                    <div class="dashboard-card mb-4">
                        <h5>Manage Order</h5>
                        <form method="POST">
                            <div class="mb-3">
                                <label class="form-label">Update Status</label>
                                <div class="input-group">
                                    <select name="status" class="form-select">
                                        <option value="Ongoing" <?= $order['order_status'] === 'Ongoing' ? 'selected' : '' ?>>Ongoing</option>
                                        <option value="Done" <?= $order['order_status'] === 'Done' ? 'selected' : '' ?>>Done</option>
                                        <option value="Cancelled" <?= $order['order_status'] === 'Cancelled' ? 'selected' : '' ?>>Cancelled</option>
                                    </select>
                                    <button type="submit" name="update_status" class="btn btn-outline-primary">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <?php if($order['order_status'] === 'Done' && $order['payment_status'] !== 'Paid'): ?>
                        <div class="alert alert-info">
                            <h5><i class="bi bi-qr-code"></i> Ready for GCash Handshake</h5>
                            <p class="mb-0">Ask customer to pay <strong>₱<?= number_format($total, 2) ?></strong> via GCash.</p>
                            <hr>
                            <p><strong>GCash Name:</strong> <?= htmlspecialchars((string)$shopGcash['gcash_name']) ?></p>
                            <p><strong>GCash No:</strong> <?= htmlspecialchars((string)$shopGcash['gcash_number']) ?></p>
                            <a href="payment.php?id=<?= $orderId ?>" class="btn btn-primary w-100">Enter GCash Ref No</a>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </main>
    </div>
</div>

<!-- Cash Payment Modal -->
<div class="modal fade" id="paymentModal" tabindex="-1">
  <div class="modal-dialog">
    <form class="modal-content" method="POST">
      <div class="modal-header">
        <h5 class="modal-title">Record Cash Payment</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <p>Total Amount: <strong>₱<?= number_format($total, 2) ?></strong></p>
        <div class="mb-3">
            <label class="form-label">Amount Received</label>
            <input type="number" step="0.01" name="amount" class="form-control" value="<?= $total ?>" required>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#paymentModal">Close</button>
        <button type="submit" name="pay_cash" class="btn btn-success">Mark as Paid (Cash)</button>
      </div>
    </form>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
