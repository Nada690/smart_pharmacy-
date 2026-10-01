import React from 'react';

export default function Navbar({
    activeTab,
    setActiveTab,
    stats,
    cartCount,
    onOpenMedicineModal,
    onOpenCategoryModal,
    darkMode,
    onToggleDark,
    lang,
    onToggleLang,
    user,
    onOpenLogin,
    onLogout,
}) {
    const t = lang === 'ar' ? {
        brand:       'صيدليتي الذكية',
        brandSub:    'نظام الإدارة والمخزون والمبيعات',
        dashboard:   'لوحة التحكم',
        medicines:   'دليل الأدوية',
        categories:  'الأقسام',
        cart:        'عربة التسوق',
        orders:      'سجل الطلبات',
        prescriptions:'الروشتات',
        logs:        'سجل الأنشطة',
        export:      'تصدير Excel',
        addMed:      'دواء جديد',
        newPending:  'جديدة',
    } : {
        brand:       'Smart Pharmacy',
        brandSub:    'Inventory & Sales Management',
        dashboard:   'Dashboard',
        medicines:   'Medicines',
        categories:  'Categories',
        cart:        'Cart',
        orders:      'Orders',
        prescriptions:'Prescriptions',
        logs:        'Activity Logs',
        export:      'Export Excel',
        addMed:      'New Medicine',
        newPending:  'new',
    };

    return (
        <nav className="navbar navbar-expand-xl sticky-top mb-4 d-print-none">
            <div className="container">
                <a className="navbar-brand d-flex align-items-center gap-2" href="#"
                   onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>
                    <div className="brand-logo">
                        <i className="bi bi-capsule"></i>
                    </div>
                    <div>
                        <div className="fw-bold fs-5 text-primary lh-1">{t.brand}</div>
                        <small className="text-muted" style={{ fontSize: '0.72rem' }}>{t.brandSub}</small>
                    </div>
                </a>

                <button className="navbar-toggler" type="button"
                    data-bs-toggle="collapse" data-bs-target="#navbarContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto mb-2 mb-xl-0 gap-1">
                        {[
                            { key: 'dashboard',     icon: 'bi-speedometer2',   label: t.dashboard },
                            { key: 'medicines',     icon: 'bi-prescription2',  label: t.medicines,     badge: stats?.total_medicines > 0 ? stats.total_medicines : null, badgeClass: 'bg-primary' },
                            { key: 'categories',    icon: 'bi-tags',           label: t.categories },
                            { key: 'cart',          icon: 'bi-cart3',          label: t.cart,          badge: cartCount > 0 ? cartCount : null, badgeClass: 'bg-danger' },
                            { key: 'orders',        icon: 'bi-receipt-cutoff', label: t.orders },
                            { key: 'prescriptions', icon: 'bi-camera',         label: t.prescriptions, badge: stats?.pending_prescriptions > 0 ? `${stats.pending_prescriptions} ${t.newPending}` : null, badgeClass: 'bg-warning text-dark' },
                            { key: 'logs',          icon: 'bi-activity',       label: t.logs },
                        ].map(item => (
                            <li className="nav-item" key={item.key}>
                                <button
                                    className={`nav-link border-0 bg-transparent position-relative ${activeTab === item.key ? 'active' : ''}`}
                                    onClick={() => setActiveTab(item.key)}
                                >
                                    <i className={`bi ${item.icon} me-1`}></i>
                                    {item.label}
                                    {item.badge != null && (
                                        <span className={`badge rounded-pill ms-1 ${item.badgeClass}`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="d-flex align-items-center gap-2 mt-2 mt-xl-0">
                        {/* زر تبديل اللغة */}
                        <button
                            className="lang-toggle-btn"
                            onClick={onToggleLang}
                            title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
                        >
                            {lang === 'ar' ? 'EN' : 'ع'}
                        </button>

                        {/* زر الوضع الداكن */}
                        <button
                            className="theme-toggle-btn"
                            onClick={onToggleDark}
                            title={darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
                        >
                            <i className={`bi ${darkMode ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill'}`}></i>
                        </button>

                        {user ? (
                            <>
                                <button
                                    className="btn btn-outline-danger btn-sm btn-pill d-flex align-items-center gap-1"
                                    onClick={onLogout}
                                >
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span>خروج</span>
                                </button>
                                <span className="badge bg-primary">
                                    {user.name}
                                </span>
                            </>
                        ) : (
                            <button
                                className="btn btn-outline-primary btn-sm btn-pill d-flex align-items-center gap-1"
                                onClick={onOpenLogin}
                            >
                                <i className="bi bi-person-circle"></i>
                                <span>دخول</span>
                            </button>
                        )}

                        <a href="/api/export/medicines"
                            className="btn btn-outline-success btn-sm btn-pill d-flex align-items-center gap-1"
                            download title={t.export}>
                            <i className="bi bi-file-earmark-excel"></i>
                            <span>{t.export}</span>
                        </a>

                        <button
                            className="btn btn-primary btn-sm d-flex align-items-center gap-1 btn-pill shadow-sm"
                            onClick={onOpenMedicineModal}
                        >
                            <i className="bi bi-plus-circle-fill"></i>
                            <span>{t.addMed}</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
