<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WeLaund — Modernizing Laundry Operations</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://unpkg.com/aos@2.3.4/dist/aos.css" rel="stylesheet">
    <link href="../assets/css/landing.css" rel="stylesheet">
</head>
<body>

<!-- ══════════════════════════════════════════
     NAVBAR — Glassmorphism → Solid on scroll
══════════════════════════════════════════ -->
<nav class="navbar navbar-expand-lg wl-navbar fixed-top" id="mainNav">
    <div class="container">
        <a class="navbar-brand wl-brand" href="#">
            <i class="bi bi-droplet-fill me-2"></i>WeLaund
        </a>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <i class="bi bi-list fs-4"></i>
        </button>
        <div class="collapse navbar-collapse" id="navMenu">
            <ul class="navbar-nav ms-auto align-items-center gap-1">
                <li class="nav-item"><a class="nav-link" href="#features">Features</a></li>
                <li class="nav-item"><a class="nav-link" href="#bento">Advantage</a></li>
                <li class="nav-item"><a class="nav-link" href="#payments">Payments</a></li>
                <li class="nav-item"><a class="nav-link" href="#how-it-works">How It Works</a></li>
                <li class="nav-item ms-2"><a class="nav-link wl-nav-login" href="index.php">Login</a></li>
                <li class="nav-item"><a class="btn wl-btn-primary px-4 ms-1" href="register.php">Get Started</a></li>
            </ul>
        </div>
    </div>
</nav>

<!-- ══════════════════════════════════════════
     HERO CAROUSEL
══════════════════════════════════════════ -->
<div id="heroCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">
    <div class="carousel-inner">

        <!-- SLIDE 1 -->
        <div class="carousel-item active">
            <div class="wl-slide wl-slide-1">
                <div class="wl-slide-overlay"></div>
                <div class="container h-100 d-flex align-items-center">
                    <div class="wl-slide-content" data-aos="fade-right" data-aos-duration="800">
                        <span class="wl-slide-badge">SaaS Laundry Platform</span>
                        <h1 class="wl-slide-title">Laundry Management<br><span class="wl-gradient-text">Reimagined.</span></h1>
                        <p class="wl-slide-sub">A multi-tenant platform connecting owners, staff, and customers with real-time order tracking and digital payments.</p>
                        <div class="d-flex gap-3 flex-wrap mt-4">
                            <a href="register.php" class="btn wl-btn-primary btn-lg px-5">Get Started Free</a>
                            <a href="#how-it-works" class="btn wl-btn-glass btn-lg px-5">See How It Works</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SLIDE 2 -->
        <div class="carousel-item">
            <div class="wl-slide wl-slide-2">
                <div class="wl-slide-overlay"></div>
                <div class="container h-100 d-flex align-items-center">
                    <div class="wl-slide-content">
                        <span class="wl-slide-badge wl-slide-badge--green">Secure Payments</span>
                        <h1 class="wl-slide-title">Secure GCash<br><span class="wl-gradient-text-green">Payments.</span></h1>
                        <p class="wl-slide-sub">Staff verify 13-digit GCash reference numbers in real-time. Every transaction is logged, encrypted, and traceable.</p>
                        <div class="d-flex gap-3 flex-wrap mt-4">
                            <a href="#payments" class="btn wl-btn-primary btn-lg px-5">Learn More</a>
                            <div class="d-flex align-items-center gap-2 ms-2">
                                <span class="wl-pay-pill"><i class="bi bi-phone-fill me-1"></i>GCash</span>
                                <span class="wl-pay-pill"><i class="bi bi-wallet2 me-1"></i>Maya</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SLIDE 3 -->
        <div class="carousel-item">
            <div class="wl-slide wl-slide-3">
                <div class="wl-slide-overlay"></div>
                <div class="container h-100 d-flex align-items-center">
                    <div class="wl-slide-content">
                        <span class="wl-slide-badge wl-slide-badge--purple">Enterprise Ready</span>
                        <h1 class="wl-slide-title">SaaS Multi-tenant<br><span class="wl-gradient-text-purple">Scalability.</span></h1>
                        <p class="wl-slide-sub">One platform, unlimited shops. Each owner gets their own isolated environment with full analytics and staff control.</p>
                        <div class="d-flex gap-3 flex-wrap mt-4">
                            <a href="register.php" class="btn wl-btn-primary btn-lg px-5">Start Your Shop</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Controls -->
    <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span class="wl-carousel-btn"><i class="bi bi-chevron-left"></i></span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span class="wl-carousel-btn"><i class="bi bi-chevron-right"></i></span>
    </button>

    <!-- Indicators -->
    <div class="carousel-indicators wl-indicators">
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
    </div>
</div>

<!-- ══════════════════════════════════════════
     ROLE FEATURES — 3 Cards
══════════════════════════════════════════ -->
<section id="features" class="wl-section bg-white">
    <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
            <span class="wl-badge">Built for Everyone</span>
            <h2 class="wl-section-title mt-2">One Platform, Three Roles</h2>
            <p class="wl-section-sub">WeLaund serves every stakeholder in the laundry ecosystem.</p>
        </div>
        <div class="row g-4">
            <div class="col-md-4" data-aos="fade-up" data-aos-delay="0">
                <div class="wl-feature-card h-100">
                    <div class="wl-feature-icon bg-primary-soft"><i class="bi bi-graph-up-arrow text-primary"></i></div>
                    <h5 class="mt-3 fw-bold">Shop Owners</h5>
                    <p class="text-muted">Real-time analytics, revenue tracking, staff management, and full service pricing control.</p>
                    <ul class="wl-feature-list">
                        <li><i class="bi bi-check2 text-primary me-2"></i>Monthly income reports</li>
                        <li><i class="bi bi-check2 text-primary me-2"></i>Staff & customer management</li>
                        <li><i class="bi bi-check2 text-primary me-2"></i>GCash payment configuration</li>
                    </ul>
                </div>
            </div>
            <div class="col-md-4" data-aos="fade-up" data-aos-delay="100">
                <div class="wl-feature-card wl-feature-card--highlight h-100">
                    <div class="wl-feature-icon bg-white-soft"><i class="bi bi-clipboard2-check text-white"></i></div>
                    <h5 class="mt-3 fw-bold text-white">Staff</h5>
                    <p style="color:rgba(255,255,255,.8)">Easy order tracking, weight-based billing calculator, and payment verification tools.</p>
                    <ul class="wl-feature-list wl-feature-list--light">
                        <li><i class="bi bi-check2 me-2"></i>Manual weight calculator</li>
                        <li><i class="bi bi-check2 me-2"></i>Order queue management</li>
                        <li><i class="bi bi-check2 me-2"></i>GCash reference verification</li>
                    </ul>
                </div>
            </div>
            <div class="col-md-4" data-aos="fade-up" data-aos-delay="200">
                <div class="wl-feature-card h-100">
                    <div class="wl-feature-icon bg-teal-soft"><i class="bi bi-phone text-teal"></i></div>
                    <h5 class="mt-3 fw-bold">Customers</h5>
                    <p class="text-muted">Seamless booking, real-time order status, and secure GCash & Maya payments from your phone.</p>
                    <ul class="wl-feature-list">
                        <li><i class="bi bi-check2 text-teal me-2"></i>Easy shop application</li>
                        <li><i class="bi bi-check2 text-teal me-2"></i>Live order status tracking</li>
                        <li><i class="bi bi-check2 text-teal me-2"></i>GCash & Maya payments</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ══════════════════════════════════════════
     BENTO GRID — WeLaund Advantage
══════════════════════════════════════════ -->
<section id="bento" class="wl-section wl-section--gray">
    <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
            <span class="wl-badge">The WeLaund Advantage</span>
            <h2 class="wl-section-title mt-2">Everything You Need, Nothing You Don't</h2>
        </div>
        <div class="wl-bento-grid" data-aos="fade-up" data-aos-delay="100">

            <!-- Large: Weight Calculator -->
            <div class="wl-bento-cell wl-bento-large wl-bento-blue">
                <div class="wl-bento-icon"><i class="bi bi-calculator-fill"></i></div>
                <h4 class="fw-bold text-white mt-3">Manual Weight Calculator</h4>
                <p style="color:rgba(255,255,255,.75)">Staff enter item weights and the system auto-calculates the total bill per service type — no manual math needed.</p>
                <div class="wl-calc-demo mt-3">
                    <div class="wl-calc-row"><span>Wash & Dry (3.5 kg)</span><span>₱175.00</span></div>
                    <div class="wl-calc-row"><span>Fold Service (3.5 kg)</span><span>₱52.50</span></div>
                    <div class="wl-calc-row wl-calc-total"><span>Total</span><span>₱227.50</span></div>
                </div>
            </div>

            <!-- Monthly Income -->
            <div class="wl-bento-cell wl-bento-dark">
                <div class="wl-bento-icon"><i class="bi bi-bar-chart-line-fill"></i></div>
                <h5 class="fw-bold text-white mt-3">Monthly Income Reports</h5>
                <p style="color:rgba(255,255,255,.65);font-size:.85rem">Owners see revenue trends, top services, and payment breakdowns at a glance.</p>
                <div class="wl-mini-chart mt-3">
                    <div class="wl-bar" style="height:40%"></div>
                    <div class="wl-bar" style="height:65%"></div>
                    <div class="wl-bar" style="height:50%"></div>
                    <div class="wl-bar" style="height:80%"></div>
                    <div class="wl-bar wl-bar-active" style="height:95%"></div>
                </div>
            </div>

            <!-- Real-time Order Status -->
            <div class="wl-bento-cell wl-bento-white">
                <div class="wl-bento-icon wl-bento-icon--teal"><i class="bi bi-arrow-repeat"></i></div>
                <h5 class="fw-bold mt-3">Real-time Order Status</h5>
                <p class="text-muted" style="font-size:.85rem">Customers track their laundry from Requested → Ongoing → Done in real-time.</p>
                <div class="wl-status-track mt-3">
                    <div class="wl-track-step done"><i class="bi bi-check-circle-fill"></i><span>Requested</span></div>
                    <div class="wl-track-line done"></div>
                    <div class="wl-track-step active"><i class="bi bi-arrow-repeat"></i><span>Ongoing</span></div>
                    <div class="wl-track-line"></div>
                    <div class="wl-track-step"><i class="bi bi-circle"></i><span>Done</span></div>
                </div>
            </div>

            <!-- Super Admin -->
            <div class="wl-bento-cell wl-bento-white">
                <div class="wl-bento-icon wl-bento-icon--purple"><i class="bi bi-shield-fill-check"></i></div>
                <h5 class="fw-bold mt-3">Super Admin Control</h5>
                <p class="text-muted" style="font-size:.85rem">Full platform oversight — manage all shops, owners, and system-wide settings from one control center.</p>
                <div class="wl-admin-pills mt-3">
                    <span class="wl-admin-pill">Manage Shops</span>
                    <span class="wl-admin-pill">Manage Owners</span>
                    <span class="wl-admin-pill">System Config</span>
                </div>
            </div>

            <!-- Multi-tenant -->
            <div class="wl-bento-cell wl-bento-teal">
                <div class="wl-bento-icon"><i class="bi bi-diagram-3-fill"></i></div>
                <h5 class="fw-bold text-white mt-3">Multi-tenant Architecture</h5>
                <p style="color:rgba(255,255,255,.75);font-size:.85rem">Each shop is fully isolated. One platform, unlimited businesses — all sharing zero data.</p>
            </div>

        </div>
    </div>
</section>

<!-- ══════════════════════════════════════════
     PAYMENT HANDSHAKE SECTION
══════════════════════════════════════════ -->
<section id="payments" class="wl-section bg-white">
    <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
            <span class="wl-badge">Payment Security</span>
            <h2 class="wl-section-title mt-2">The Payment Verification Handshake</h2>
            <p class="wl-section-sub">Every payment goes through a secure 3-step verification loop before it's marked as confirmed.</p>
        </div>
        <div class="row g-4 align-items-center">
            <div class="col-lg-6" data-aos="fade-right">
                <div class="wl-handshake-flow">
                    <!-- Step A -->
                    <div class="wl-hs-step">
                        <div class="wl-hs-icon wl-hs-gcash"><i class="bi bi-phone-fill"></i></div>
                        <div class="wl-hs-body">
                            <h6 class="fw-bold mb-1">Customer Pays via GCash / Maya</h6>
                            <p class="text-muted small mb-0">Customer sends payment and receives a 13-digit reference number from GCash or Maya.</p>
                        </div>
                    </div>
                    <div class="wl-hs-connector"><i class="bi bi-arrow-down"></i></div>
                    <!-- Step B -->
                    <div class="wl-hs-step">
                        <div class="wl-hs-icon wl-hs-staff"><i class="bi bi-clipboard2-check-fill"></i></div>
                        <div class="wl-hs-body">
                            <h6 class="fw-bold mb-1">Staff Enters Reference Number</h6>
                            <p class="text-muted small mb-0">Staff logs the 13-digit reference number into WeLaund and submits for verification.</p>
                            <div class="wl-ref-input mt-2">
                                <span class="wl-ref-digit">4</span><span class="wl-ref-digit">7</span><span class="wl-ref-digit">2</span>
                                <span class="wl-ref-sep">—</span>
                                <span class="wl-ref-digit">8</span><span class="wl-ref-digit">1</span><span class="wl-ref-digit">9</span><span class="wl-ref-digit">0</span>
                                <span class="wl-ref-sep">—</span>
                                <span class="wl-ref-digit">5</span><span class="wl-ref-digit">5</span><span class="wl-ref-digit">2</span><span class="wl-ref-digit">4</span><span class="wl-ref-digit">1</span>
                            </div>
                        </div>
                    </div>
                    <div class="wl-hs-connector"><i class="bi bi-arrow-down"></i></div>
                    <!-- Step C -->
                    <div class="wl-hs-step">
                        <div class="wl-hs-icon wl-hs-verified"><i class="bi bi-shield-check"></i></div>
                        <div class="wl-hs-body">
                            <h6 class="fw-bold mb-1">Transaction Verified & Logged</h6>
                            <p class="text-muted small mb-0">Payment is marked <strong class="text-success">Verified</strong> in PostgreSQL. Order status updates to <strong>Done</strong> automatically.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6" data-aos="fade-left" data-aos-delay="100">
                <div class="wl-payment-card">
                    <div class="wl-payment-card-header">
                        <span class="fw-bold">Payment Methods Accepted</span>
                    </div>
                    <div class="wl-payment-methods">
                        <div class="wl-pay-method">
                            <div class="wl-pay-logo wl-pay-logo--gcash"><i class="bi bi-phone-fill"></i></div>
                            <div>
                                <div class="fw-bold">GCash</div>
                                <div class="text-muted small">13-digit reference verification</div>
                            </div>
                            <span class="wl-pay-status">Active</span>
                        </div>
                        <div class="wl-pay-method">
                            <div class="wl-pay-logo wl-pay-logo--maya"><i class="bi bi-wallet2"></i></div>
                            <div>
                                <div class="fw-bold">Maya</div>
                                <div class="text-muted small">Digital wallet payment</div>
                            </div>
                            <span class="wl-pay-status">Active</span>
                        </div>
                        <div class="wl-pay-method">
                            <div class="wl-pay-logo wl-pay-logo--manual"><i class="bi bi-cash-coin"></i></div>
                            <div>
                                <div class="fw-bold">Manual / Cash</div>
                                <div class="text-muted small">In-person cash payment</div>
                            </div>
                            <span class="wl-pay-status">Active</span>
                        </div>
                    </div>
                    <div class="wl-security-row mt-3">
                        <span><i class="bi bi-shield-lock-fill text-primary me-1"></i>PostgreSQL Encrypted</span>
                        <span><i class="bi bi-arrow-repeat text-success me-1"></i>Real-time Verification</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ══════════════════════════════════════════
     HOW IT WORKS — 4 Steps
══════════════════════════════════════════ -->
<section id="how-it-works" class="wl-section wl-section--gray">
    <div class="container">
        <div class="text-center mb-5" data-aos="fade-up">
            <span class="wl-badge">Simple Process</span>
            <h2 class="wl-section-title mt-2">From Sign-Up to Clean Laundry</h2>
        </div>
        <div class="row g-4 align-items-start">
            <?php
            $steps = [
                ['1','bi-person-plus-fill','Customer Application','Register and select your preferred laundry shop to apply.'],
                ['2','bi-shop-window','Shop Approval','Staff reviews and approves your account to access the platform.'],
                ['3','bi-basket2-fill','Laundry Processing','Place your order and track it in real-time as staff processes it.'],
                ['4','bi-credit-card-2-front-fill','Secure Payment','Pay via GCash or Maya with real-time transaction verification.'],
            ];
            foreach ($steps as $i => $s): ?>
            <div class="col-6 col-md-3 text-center" data-aos="fade-up" data-aos-delay="<?= $i * 80 ?>">
                <div class="wl-step">
                    <div class="wl-step-num"><?= $s[0] ?></div>
                    <div class="wl-step-icon"><i class="bi <?= $s[1] ?>"></i></div>
                    <h6 class="fw-bold mt-3"><?= $s[2] ?></h6>
                    <p class="text-muted small"><?= $s[3] ?></p>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- ══════════════════════════════════════════
     CTA BANNER
══════════════════════════════════════════ -->
<section class="wl-cta-section" data-aos="fade-up">
    <div class="container text-center">
        <h2 class="fw-bold text-white mb-3">Ready to Modernize Your Laundry Business?</h2>
        <p class="text-white-50 mb-4">Join WeLaund today — free for customers, powerful for owners.</p>
        <a href="register.php" class="btn btn-light btn-lg px-5 fw-semibold text-primary">Create Your Account</a>
    </div>
</section>

<!-- ══════════════════════════════════════════
     FOOTER
══════════════════════════════════════════ -->
<footer class="wl-footer">
    <div class="container">
        <div class="row g-4 mb-4">
            <div class="col-md-4">
                <div class="wl-brand text-white mb-2 fs-5 fw-bold"><i class="bi bi-droplet-fill me-2 text-info"></i>WeLaund</div>
                <p class="text-muted small">A modern SaaS Laundry Management System. Secure, fast, and built for the digital age.</p>
                <div class="d-flex gap-2 mt-3">
                    <span class="wl-payment-badge"><i class="bi bi-phone-fill me-1"></i>GCash</span>
                    <span class="wl-payment-badge"><i class="bi bi-wallet2 me-1"></i>Maya</span>
                </div>
            </div>
            <div class="col-md-4">
                <h6 class="text-white fw-semibold mb-3">Platform</h6>
                <ul class="list-unstyled wl-footer-links">
                    <li><a href="index.php">Login</a></li>
                    <li><a href="register.php">Register as Customer</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#how-it-works">How It Works</a></li>
                </ul>
            </div>
            <div class="col-md-4">
                <h6 class="text-white fw-semibold mb-3">Security & Trust</h6>
                <ul class="list-unstyled wl-footer-links">
                    <li><i class="bi bi-shield-check me-2 text-info"></i>PostgreSQL Secure Data Encryption</li>
                    <li><i class="bi bi-arrow-repeat me-2 text-info"></i>Real-time Transaction Verification</li>
                    <li><i class="bi bi-lock-fill me-2 text-info"></i>Bcrypt Password Hashing</li>
                    <li><i class="bi bi-people-fill me-2 text-info"></i>Role-Based Access Control</li>
                </ul>
            </div>
        </div>
        <hr class="border-secondary">
        <p class="text-center text-muted small mb-0">© <?= date('Y') ?> WeLaund. All rights reserved. Built with PostgreSQL &amp; PHP.</p>
    </div>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>
<script>
    AOS.init({ once: true, offset: 60 });

    // Navbar: transparent glass → solid on scroll
    const nav = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('wl-navbar--scrolled', window.scrollY > 60);
    });
</script>
</body>
</html>
