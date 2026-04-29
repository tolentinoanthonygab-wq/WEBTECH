<?php
// ============================================================
//  public/owner/dashboard.php — Owner Dashboard
// ============================================================
declare(strict_types=1);

require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../controllers/OwnerController.php';

AuthController::requireRole('owner');

$owner = new OwnerController($_SESSION['shop_id']);
$monthlyIncome = $owner->getMonthlyIncome();
$yearlyIncome  = $owner->getYearlyIncome();
$staffMembers  = $owner->getAllStaff();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Owner Dashboard | Welaund</title>
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
                    <li class="nav-item"><a class="nav-link active" href="#"><i class="bi bi-graph-up-arrow me-2"></i> Dashboard</a></li>
                    <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-people me-2"></i> Staff Management</a></li>
                    <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-gear me-2"></i> Shop Settings</a></li>
                    <li class="nav-item"><a class="nav-link" href="../logout.php"><i class="bi bi-box-arrow-left me-2"></i> Logout</a></li>
                </ul>
            </div>
        </nav>

        <main class="col-md-10 ms-sm-auto px-md-4 py-4">
            <div class="pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">Owner Dashboard — <?= htmlspecialchars((string)$_SESSION['shop_name']) ?></h1>
            </div>

            <div class="row">
                <!-- Income Report (Monthly) -->
                <div class="col-md-6 mb-4">
                    <div class="dashboard-card h-100">
                        <h5 class="mb-4 d-flex align-items-center"><i class="bi bi-calendar-month me-2 text-primary"></i> Monthly Income</h5>
                        <div class="table-responsive">
                            <table class="table">
                                <thead><tr><th>Month/Year</th><th class="text-end">Total Revenue</th></tr></thead>
                                <tbody>
                                    <?php if(empty($monthlyIncome)): ?>
                                        <tr><td colspan="2" class="text-center text-muted">No data available.</td></tr>
                                    <?php else: ?>
                                        <?php foreach($monthlyIncome as $row): ?>
                                            <tr>
                                                <td><?= date("F", mktime(0, 0, 0, $row['month'], 10)) ?> <?= $row['year'] ?></td>
                                                <td class="text-end fw-bold">₱<?= number_format((float)$row['total'], 2) ?></td>
                                            </tr>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Income Report (Yearly) -->
                <div class="col-md-6 mb-4">
                    <div class="dashboard-card h-100">
                        <h5 class="mb-4 d-flex align-items-center"><i class="bi bi-bar-chart me-2 text-success"></i> Yearly Income</h5>
                        <div class="table-responsive">
                            <table class="table">
                                <thead><tr><th>Year</th><th class="text-end">Total Revenue</th></tr></thead>
                                <tbody>
                                    <?php if(empty($yearlyIncome)): ?>
                                        <tr><td colspan="2" class="text-center text-muted">No data available.</td></tr>
                                    <?php else: ?>
                                        <?php foreach($yearlyIncome as $row): ?>
                                            <tr>
                                                <td><?= $row['year'] ?></td>
                                                <td class="text-end fw-bold text-success">₱<?= number_format((float)$row['total'], 2) ?></td>
                                            </tr>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Staff Status -->
            <div class="dashboard-card">
                <h5 class="mb-4">Shop Staff Members</h5>
                <div class="row">
                    <?php foreach($staffMembers as $s): ?>
                        <div class="col-md-4 mb-3">
                            <div class="border rounded p-3 bg-light">
                                <h6><?= htmlspecialchars((string)($s['first_name'] . ' ' . $s['last_name'])) ?></h6>
                                <p class="small text-muted mb-1"><?= $s['email'] ?></p>
                                <span class="badge <?= $s['status'] === 'active' ? 'bg-success' : 'bg-secondary' ?>"><?= $s['status'] ?></span>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </main>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
