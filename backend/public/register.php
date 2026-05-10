<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/Database.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $shopId   = $_POST['shop_id']        ?? '';
    $shopName = $_POST['shop_name']       ?? '';
    $fname    = trim($_POST['first_name']  ?? '');
    $mname    = trim($_POST['middle_name'] ?? '');
    $lname    = trim($_POST['last_name']   ?? '');
    $email    = trim($_POST['email']       ?? '');
    $password = $_POST['password']         ?? '';
    $contact  = trim($_POST['contact_number'] ?? '');
    $address  = trim($_POST['address']     ?? '');

    if (!$shopId || !$fname || !$lname || !$email || !$password) {
        $error = 'Please fill in all required fields.';
    } else {
        try {
            $db  = Database::getConnection();
            $chk = $db->prepare("SELECT id FROM customers WHERE email = :e LIMIT 1");
            $chk->execute([':e' => strtolower($email)]);
            if ($chk->fetch()) {
                $error = 'An account with this email already exists.';
            } else {
                $db->prepare(
                    "INSERT INTO customers (shop_id,first_name,middle_name,last_name,email,password_hash,contact_number,address,status)
                     VALUES (:sid,:fn,:mn,:ln,:em,:pw,:cn,:ad,'Pending')"
                )->execute([
                    ':sid' => $shopId,
                    ':fn'  => $fname, ':mn' => $mname, ':ln' => $lname,
                    ':em'  => strtolower($email),
                    ':pw'  => password_hash($password, PASSWORD_BCRYPT),
                    ':cn'  => $contact, ':ad' => $address,
                ]);
                // Return JSON for AJAX
                if (!empty($_SERVER['HTTP_X_REQUESTED_WITH'])) {
                    header('Content-Type: application/json');
                    echo json_encode(['success' => true, 'shop_name' => htmlspecialchars($shopName)]);
                    exit;
                }
                // Fallback: set flag for non-JS
                $showSuccess = true;
                $successShop = htmlspecialchars($shopName);
            }
        } catch (\Exception $e) {
            if (!empty($_SERVER['HTTP_X_REQUESTED_WITH'])) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'error' => 'Registration failed. Please try again.']);
                exit;
            }
            $error = 'Registration failed. Please try again.';
        }
    }

    // AJAX error response
    if ($error && !empty($_SERVER['HTTP_X_REQUESTED_WITH'])) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => $error]);
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register — WeLaund</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="../assets/css/auth.css" rel="stylesheet">
</head>
<body class="wl-auth-bg">

    <div class="wl-blob wl-blob-1"></div>
    <div class="wl-blob wl-blob-2"></div>
    <div class="wl-blob wl-blob-3"></div>

    <div class="wl-auth-center wl-auth-center--wide">
        <a href="landing.php" class="wl-back-link"><i class="bi bi-arrow-left me-1"></i>Back to WeLaund</a>

        <!-- REGISTRATION FORM STATE -->
        <div class="wl-glass-card wl-glass-card--wide" id="formState" <?= !empty($showSuccess) ? 'style="display:none"' : '' ?>>
            <div class="text-center mb-4">
                <div class="wl-auth-logo"><i class="bi bi-person-plus-fill"></i></div>
                <h4 class="fw-bold mt-3 mb-1">Create your account</h4>
                <p class="text-muted small">Select the shop you wish to join, then fill in your details.</p>
            </div>

            <div id="formError" class="alert wl-alert-danger d-flex align-items-center gap-2 py-2 mb-3 <?= $error ? '' : 'd-none' ?>">
                <i class="bi bi-exclamation-circle-fill"></i>
                <span id="formErrorMsg"><?= htmlspecialchars($error) ?></span>
            </div>

            <form id="registerForm" novalidate>

                <!-- ── SHOP SELECTOR ── -->
                <div class="mb-4">
                    <label class="wl-label">
                        <i class="bi bi-shop-window me-1 text-primary"></i>
                        Select the shop you wish to join <span class="text-danger">*</span>
                    </label>
                    <div class="wl-shop-selector" id="shopSelector">
                        <div class="wl-shop-trigger" id="shopTrigger" tabindex="0">
                            <i class="bi bi-shop-window text-muted"></i>
                            <span id="shopTriggerText" class="text-muted">— Choose a laundry shop —</span>
                            <i class="bi bi-chevron-down ms-auto wl-chevron" id="shopChevron"></i>
                        </div>
                        <div class="wl-shop-dropdown" id="shopDropdown">
                            <div class="wl-shop-search-wrap">
                                <i class="bi bi-search"></i>
                                <input type="text" id="shopSearch" class="wl-shop-search" placeholder="Search shops...">
                            </div>
                            <div class="wl-shop-list" id="shopList">
                                <div class="wl-shop-loading"><div class="spinner-border spinner-border-sm text-primary me-2"></div>Loading shops...</div>
                            </div>
                        </div>
                    </div>
                    <input type="hidden" name="shop_id"   id="shopIdInput">
                    <input type="hidden" name="shop_name" id="shopNameInput">
                    <div class="form-text mt-1"><i class="bi bi-info-circle me-1"></i>Your account will be <strong>Pending</strong> until the shop staff approves it.</div>
                </div>

                <!-- ── NAME ROW ── -->
                <div class="row g-3 mb-3">
                    <div class="col-md-4">
                        <label class="wl-label">First Name <span class="text-danger">*</span></label>
                        <input type="text" name="first_name" class="wl-input-plain" required>
                    </div>
                    <div class="col-md-4">
                        <label class="wl-label">Middle Name</label>
                        <input type="text" name="middle_name" class="wl-input-plain">
                    </div>
                    <div class="col-md-4">
                        <label class="wl-label">Last Name <span class="text-danger">*</span></label>
                        <input type="text" name="last_name" class="wl-input-plain" required>
                    </div>
                </div>

                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label class="wl-label">Email Address <span class="text-danger">*</span></label>
                        <div class="wl-field">
                            <i class="bi bi-envelope"></i>
                            <input type="email" name="email" class="wl-input" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="wl-label">Contact Number</label>
                        <div class="wl-field">
                            <i class="bi bi-phone"></i>
                            <input type="text" name="contact_number" class="wl-input" placeholder="09XXXXXXXXX">
                        </div>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="wl-label">Password <span class="text-danger">*</span></label>
                    <div class="wl-field">
                        <i class="bi bi-lock"></i>
                        <input type="password" name="password" id="regPw" class="wl-input" placeholder="Min. 8 characters" required>
                        <button type="button" class="wl-eye" onclick="togglePw('regPw','regEye')">
                            <i class="bi bi-eye" id="regEye"></i>
                        </button>
                    </div>
                </div>

                <div class="mb-4">
                    <label class="wl-label">Address</label>
                    <textarea name="address" class="wl-input-plain" rows="2" placeholder="Street, Barangay, City"></textarea>
                </div>

                <button type="submit" class="wl-submit-btn w-100" id="submitBtn">
                    <span id="submitLabel"><i class="bi bi-person-plus-fill me-2"></i>Create Account & Apply</span>
                    <span id="submitSpinner" class="d-none">
                        <span class="spinner-border spinner-border-sm me-2"></span>Submitting...
                    </span>
                </button>
            </form>

            <p class="text-center text-muted small mt-4 mb-0">
                Already have an account? <a href="index.php" class="wl-link">Sign in</a>
            </p>
        </div>

        <!-- SUCCESS STATE -->
        <div class="wl-glass-card text-center" id="successState" <?= empty($showSuccess) ? 'style="display:none"' : '' ?>>
            <div class="wl-success-icon mb-4">
                <i class="bi bi-send-check-fill"></i>
            </div>
            <h4 class="fw-bold mb-2">Application Sent!</h4>
            <p class="text-muted mb-1">Your application has been sent to</p>
            <p class="fw-bold fs-5 text-primary mb-3" id="successShopName"><?= $successShop ?? '' ?></p>
            <p class="text-muted small mb-4">
                Staff will review and approve your access shortly.<br>
                You'll be able to log in once your account is activated.
            </p>
            <div class="d-flex gap-2 justify-content-center flex-wrap">
                <a href="index.php" class="wl-submit-btn btn px-4">
                    <i class="bi bi-box-arrow-in-right me-2"></i>Go to Login
                </a>
                <a href="landing.php" class="btn btn-outline-secondary px-4">Back to Home</a>
            </div>
        </div>

    </div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
// ── Shop Selector ──
const trigger   = document.getElementById('shopTrigger');
const dropdown  = document.getElementById('shopDropdown');
const chevron   = document.getElementById('shopChevron');
const shopList  = document.getElementById('shopList');
const shopSearch= document.getElementById('shopSearch');
const shopIdInp = document.getElementById('shopIdInput');
const shopNmInp = document.getElementById('shopNameInput');
const trigText  = document.getElementById('shopTriggerText');

let allShops = [];

// Fetch shops from API
fetch('../api/public/shops.php')
    .then(r => r.json())
    .then(data => {
        allShops = data;
        renderShops(data);
    })
    .catch(() => {
        shopList.innerHTML = '<div class="wl-shop-empty text-danger"><i class="bi bi-exclamation-circle me-2"></i>Failed to load shops.</div>';
    });

function renderShops(shops) {
    if (!shops.length) {
        shopList.innerHTML = '<div class="wl-shop-empty">No shops available.</div>';
        return;
    }
    shopList.innerHTML = shops.map(s =>
        `<div class="wl-shop-option" data-id="${s.id}" data-name="${s.shop_name}">
            <i class="bi bi-shop-window me-2 text-primary"></i>${s.shop_name}
        </div>`
    ).join('');
    shopList.querySelectorAll('.wl-shop-option').forEach(opt => {
        opt.addEventListener('click', () => selectShop(opt.dataset.id, opt.dataset.name));
    });
}

function selectShop(id, name) {
    shopIdInp.value = id;
    shopNmInp.value = name;
    trigText.textContent = name;
    trigText.classList.remove('text-muted');
    closeDropdown();
}

function openDropdown() {
    dropdown.classList.add('open');
    chevron.style.transform = 'rotate(180deg)';
    shopSearch.focus();
}
function closeDropdown() {
    dropdown.classList.remove('open');
    chevron.style.transform = '';
}

trigger.addEventListener('click', () => dropdown.classList.contains('open') ? closeDropdown() : openDropdown());
trigger.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDropdown(); } });
document.addEventListener('click', e => { if (!document.getElementById('shopSelector').contains(e.target)) closeDropdown(); });

shopSearch.addEventListener('input', () => {
    const q = shopSearch.value.toLowerCase();
    renderShops(allShops.filter(s => s.shop_name.toLowerCase().includes(q)));
});

// ── Form Submit (AJAX) ──
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!shopIdInp.value) {
        showError('Please select a laundry shop.');
        return;
    }

    const btn     = document.getElementById('submitBtn');
    const label   = document.getElementById('submitLabel');
    const spinner = document.getElementById('submitSpinner');

    btn.disabled = true;
    label.classList.add('d-none');
    spinner.classList.remove('d-none');

    const fd = new FormData(this);

    try {
        const res  = await fetch('register.php', {
            method: 'POST',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            body: fd
        });
        const data = await res.json();

        if (data.success) {
            document.getElementById('successShopName').textContent = data.shop_name;
            document.getElementById('formState').style.display   = 'none';
            document.getElementById('successState').style.display = '';
        } else {
            showError(data.error || 'Registration failed.');
            btn.disabled = false;
            label.classList.remove('d-none');
            spinner.classList.add('d-none');
        }
    } catch {
        showError('Network error. Please try again.');
        btn.disabled = false;
        label.classList.remove('d-none');
        spinner.classList.add('d-none');
    }
});

function showError(msg) {
    const el = document.getElementById('formError');
    document.getElementById('formErrorMsg').textContent = msg;
    el.classList.remove('d-none');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function togglePw(inputId, iconId) {
    const inp = document.getElementById(inputId);
    const ico = document.getElementById(iconId);
    inp.type = inp.type === 'password' ? 'text' : 'password';
    ico.className = inp.type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
}
</script>
</body>
</html>
