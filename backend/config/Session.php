<?php
declare(strict_types=1);

function start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;

    $isProd = (getenv('RAILWAY_ENVIRONMENT') || getenv('DATABASE_URL'));

    session_set_cookie_params([
        'lifetime' => 86400,
        'path'     => '/',
        'domain'   => '', // Allow browser to set correct domain
        'secure'   => $isProd, // true in production
        'httponly' => true,
        'samesite' => $isProd ? 'None' : 'Lax',
    ]);

    session_name('WELAUND_SESSION');
    session_start();
}
