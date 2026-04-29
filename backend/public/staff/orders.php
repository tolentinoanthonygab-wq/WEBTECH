<?php
// ============================================================
//  public/staff/orders.php — New Order / Calculator
// ============================================================
declare(strict_types=1);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/StaffController.php';

AuthController::requireRole('staff');

$staff = new StaffController($_SESSION['shop_id'], $_SESSION['user_id']);

$services  = $staff->getServices();
$customers = $staff->getApprovedCustomers();

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['create_order'])) {
    $customerId = $_POST['customer_id'] ?? '';
    // Simplify for MVP/Demo: handle one item or a set of items from form
    $serviceId = $_POST['service_id'] ?? '';
    $weight    = $_POST['weight'] ?? 0;

    if (empty($customerId) || empty($serviceId) || $weight <= 0) {
        $error = "Please select a customer, service, and valid weight.";
    } else {
        try {
            $items = [['service_id' => $serviceId, 'weight' => $weight]];
            $orderRef = $staff->createOrder($customerId, $items, $_POST['notes'] ?? '');
            header("Location: dashboard.php?success=Order Created: $orderRef");
            exit;
        } catch (\Exception $e) {
            $error = "Error creating order.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order | Welaund</title>
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
                    <li class="nav-item"><a class="nav-link" href="dashboard.php"><i class="bi bi-speedometer2 me-2"></i> Dashboard</a></li>
                    <li class="nav-item"><a class="nav-link active" href="orders.php"><i class="bi bi-plus-circle me-2"></i> New Order</a></li>
                    <li class="nav-item"><a class="nav-link" href="../logout.php"><i class="bi bi-box-arrow-left me-2"></i> Logout</a></li>
                </ul>
            </div>
        </nav>

        <main class="col-md-10 ms-sm-auto px-md-4 py-4">
            <div class="pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">Create New Order</h1>
            </div>

            <?php if ($error): ?><div class="alert alert-danger"><?= $error ?></div><?php endif; ?>

            <div class="dashboard-card" style="max-width: 800px;">
                <form method="POST">
                    <div class="row mb-3">
                        <div class="col-md-12">
                            <label class="form-label">Select Customer</label>
                            <select name="customer_id" class="form-select" required>
                                <option value="">-- Choose Approved Customer --</option>
                                <?php foreach ($customers as $c): ?>
                                    <option value="<?= $c['id'] ?>"><?= htmlspecialchars((string)($c['first_name'] . ' ' . $c['last_name'])) ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Service Type</label>
                            <select name="service_id" id="service_id" class="form-select" required onchange="calculateTotal()">
                                <option value="">-- Select Service --</option>
                                <?php foreach ($services as $s): ?>
                                    <option value="<?= $s['id'] ?>" data-price="<?= $s['price_per_unit'] ?>">
                                        <?= htmlspecialchars((string)$s['service_name']) ?> (₱<?= $s['price_per_unit'] ?>/<?= $s['unit'] ?>)
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Weight (kg)</label>
                            <input type="number" step="0.01" name="weight" id="weight" class="form-control" placeholder="0.00" required oninput="calculateTotal()">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Notes</label>
                        <textarea name="notes" class="form-control" rows="2" placeholder="e.g. Wash & Fold, light starch"></textarea>
                    </div>

                    <div class="bg-light p-3 rounded mb-4 text-end">
                        <h4 class="mb-0">Estimated Total: <span class="text-primary" id="display_total">₱0.00</span></h4>
                        <small class="text-muted" id="price_info"></small>
                    </div>

                    <div class="d-grid">
                        <button type="submit" name="create_order" class="btn btn-primary btn-lg">Complete & Print Receipt</button>
                    </div>
                </form>
            </div>
        </main>
    </div>
</div>

<script>
function calculateTotal() {
    const serviceSelect = document.getElementById('service_id');
    const weightInput = document.getElementById('weight');
    const displayTotal = document.getElementById('display_total');
    const priceInfo = document.getElementById('price_info');

    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    const price = parseFloat(selectedOption.getAttribute('data-price')) || 0;
    const weight = parseFloat(weightInput.value) || 0;

    const total = (price * weight).toFixed(2);
    displayTotal.innerText = '₱' + total;

    if (price > 0) {
        priceInfo.innerText = 'Price: ₱' + price + ' per unit';
    } else {
        priceInfo.innerText = '';
    }
}
</script>
</body>
</html>
