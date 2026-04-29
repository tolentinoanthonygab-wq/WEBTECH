<?php
// ============================================================
//  public/staff/payment.php — GCash Handshake Verification
// ============================================================
declare(strict_types=1);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/StaffController.php';

AuthController::requireRole('staff');

$staff = new StaffController($_SESSION['shop_id'], $_SESSION['user_id']);
$orderId = $_GET['id'] ?? '';
$order = $staff->getOrder($orderId);

if (!$order || $order['order_status'] !== 'Done') {
    header('Location: dashboard.php');
    exit;
}

$error = '';
$total = 0;
foreach($order['items'] as $item) { $total += (float)$item['subtotal']; }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ref = $_POST['transaction_ref'] ?? '';
    if (empty($ref)) {
        $error = "GCash Reference Number is required.";
    } else {
        if ($staff->verifyGcashPayment($orderId, $ref, (float)$total)) {
            header("Location: order_details.php?id=$orderId&msg=verified");
            exit;
        } else {
            $error = "Failed to verify payment.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Payment | Welaund</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../../assets/css/style.css">
</head>
<body>

<div class="login-container">
    <div class="card shadow-lg">
        <div class="card-header bg-primary text-white py-3">
            <h4 class="mb-0">GCash Verification</h4>
        </div>
        <div class="card-body p-4 text-center">
            <p class="text-muted">Order: <strong><?= htmlspecialchars((string)$order['order_ref']) ?></strong></p>
            <h2 class="text-primary mb-4">₱<?= number_format($total, 2) ?></h2>

            <?php if ($error): ?><div class="alert alert-danger"><?= $error ?></div><?php endif; ?>

            <form method="POST">
                <div class="mb-4 text-start">
                    <label class="form-label fw-bold">Enter GCash Transaction Ref No.</label>
                    <input type="text" name="transaction_ref" class="form-control form-control-lg text-center" placeholder="e.g. 9012 345 678901" required autofocus>
                    <small class="text-muted d-block mt-2">Enter the reference number provided by the customer to confirm the payment.</small>
                </div>
                
                <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-success btn-lg">Verify & Mark Paid</button>
                    <a href="order_details.php?id=<?= $orderId ?>" class="btn btn-link">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>

</body>
</html>
