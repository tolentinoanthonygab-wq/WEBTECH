<?php
// ============================================================
//  WeLaund System Diagnostic — http://localhost/newWeb/backend/test.php
//  DELETE THIS FILE after testing
// ============================================================
require_once __DIR__ . '/config/Env.php';
Env::load();

$results = [];

// 1. ENV CHECK
$results['env'] = [
    'DB_HOST'      => Env::get('DB_HOST'),
    'DB_PORT'      => Env::get('DB_PORT'),
    'DB_NAME'      => Env::get('DB_NAME'),
    'DB_USER'      => Env::get('DB_USER'),
    'DB_PASS'      => Env::get('DB_PASS') ? '***set***' : 'NOT SET',
    'FRONTEND_URL' => Env::get('FRONTEND_URL'),
];

// 2. DB CONNECTION
try {
    require_once __DIR__ . '/config/Database.php';
    $db = Database::getConnection();
    $results['database'] = 'CONNECTED ✅';
} catch (\Exception $e) {
    $results['database'] = 'FAILED ❌ — ' . $e->getMessage();
}

// 3. TABLES CHECK
if (str_contains($results['database'], 'CONNECTED')) {
    $tables = ['super_admins','owners','laundry_shops','staff','customers','services','orders','order_items','payments'];
    foreach ($tables as $t) {
        try {
            $count = $db->query("SELECT COUNT(*) FROM $t")->fetchColumn();
            $results['tables'][$t] = "$count rows ✅";
        } catch (\Exception $e) {
            $results['tables'][$t] = 'MISSING ❌';
        }
    }
}

// 4. SEED DATA CHECK
if (str_contains($results['database'], 'CONNECTED')) {
    $accounts = [
        'super_admin' => "SELECT email, status FROM super_admins LIMIT 1",
        'owner'       => "SELECT email, status FROM owners LIMIT 1",
        'staff'       => "SELECT email, status FROM staff LIMIT 1",
        'customer'    => "SELECT email, status FROM customers LIMIT 1",
    ];
    foreach ($accounts as $role => $sql) {
        try {
            $row = $db->query($sql)->fetch();
            $results['seed_accounts'][$role] = $row ? "{$row['email']} ({$row['status']}) ✅" : 'NO DATA ❌';
        } catch (\Exception $e) {
            $results['seed_accounts'][$role] = 'ERROR ❌';
        }
    }
}

// 5. PHP EXTENSIONS
$results['php_extensions'] = [
    'pdo'      => extension_loaded('pdo')      ? '✅' : '❌ MISSING',
    'pdo_pgsql'=> extension_loaded('pdo_pgsql')? '✅' : '❌ MISSING',
    'json'     => extension_loaded('json')     ? '✅' : '❌ MISSING',
    'session'  => extension_loaded('session')  ? '✅' : '❌ MISSING',
];

// 6. API FILES EXIST
$apiFiles = [
    'api/auth/login.php',
    'api/auth/session.php',
    'api/auth/logout.php',
    'api/staff/orders.php',
    'api/staff/customers.php',
    'api/staff/services.php',
];
foreach ($apiFiles as $f) {
    $results['api_files'][$f] = file_exists(__DIR__ . '/' . $f) ? '✅' : '❌ MISSING';
}
?>
<!DOCTYPE html>
<html>
<head>
  <title>WeLaund Diagnostics</title>
  <style>
    body { font-family: monospace; background: #0f172a; color: #e2e8f0; padding: 2rem; }
    h1 { color: #38bdf8; } h2 { color: #94a3b8; margin-top: 1.5rem; }
    .ok  { color: #4ade80; } .fail { color: #f87171; }
    table { border-collapse: collapse; width: 100%; margin-top: 0.5rem; }
    td, th { padding: 6px 12px; border: 1px solid #1e293b; text-align: left; }
    th { background: #1e293b; color: #7dd3fc; }
    tr:nth-child(even) { background: #0f172a; }
    tr:nth-child(odd)  { background: #1e293b55; }
  </style>
</head>
<body>
<h1>🧺 WeLaund System Diagnostics</h1>

<h2>1. Environment Variables</h2>
<table><tr><th>Key</th><th>Value</th></tr>
<?php foreach ($results['env'] as $k => $v): ?>
<tr><td><?= $k ?></td><td class="ok"><?= htmlspecialchars($v) ?></td></tr>
<?php endforeach; ?>
</table>

<h2>2. Database Connection</h2>
<p class="<?= str_contains($results['database'],'CONNECTED') ? 'ok' : 'fail' ?>"><?= $results['database'] ?></p>

<?php if (isset($results['tables'])): ?>
<h2>3. Tables</h2>
<table><tr><th>Table</th><th>Status</th></tr>
<?php foreach ($results['tables'] as $t => $s): ?>
<tr><td><?= $t ?></td><td class="<?= str_contains($s,'✅') ? 'ok' : 'fail' ?>"><?= $s ?></td></tr>
<?php endforeach; ?>
</table>

<h2>4. Seed Accounts</h2>
<table><tr><th>Role</th><th>Account</th></tr>
<?php foreach ($results['seed_accounts'] as $r => $s): ?>
<tr><td><?= $r ?></td><td class="<?= str_contains($s,'✅') ? 'ok' : 'fail' ?>"><?= $s ?></td></tr>
<?php endforeach; ?>
</table>
<?php endif; ?>

<h2>5. PHP Extensions</h2>
<table><tr><th>Extension</th><th>Status</th></tr>
<?php foreach ($results['php_extensions'] as $e => $s): ?>
<tr><td><?= $e ?></td><td class="<?= str_contains($s,'✅') ? 'ok' : 'fail' ?>"><?= $s ?></td></tr>
<?php endforeach; ?>
</table>

<h2>6. API Files</h2>
<table><tr><th>File</th><th>Status</th></tr>
<?php foreach ($results['api_files'] as $f => $s): ?>
<tr><td><?= $f ?></td><td class="<?= str_contains($s,'✅') ? 'ok' : 'fail' ?>"><?= $s ?></td></tr>
<?php endforeach; ?>
</table>

<p style="margin-top:2rem;color:#475569;">⚠️ Delete this file after testing: <code>backend/test.php</code></p>
</body>
</html>
