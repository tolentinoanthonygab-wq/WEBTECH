<?php
declare(strict_types=1);

function start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;

    session_set_cookie_params([
        'lifetime' => 86400,
        'path'     => '/',
        'domain'   => 'localhost',
        'secure'   => false,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_name('WELAUND_SESSION');
    session_start();
}
