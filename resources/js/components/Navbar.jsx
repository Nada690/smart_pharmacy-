import React from 'react';

export default function Navbar({ 
    activeTab, 
    setActiveTab, 
    stats, 
    cartCount,
    onOpenMedicineModal, 
    onOpenCategoryModal 
}) {
    return (
        <nav className="navbar navbar-expand-xl navbar-light sticky-top mb-4">
            <div className="container">
                <a className="navbar-brand d-flex align-items-center gap-2" href="#" onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>
                    <div className="brand-logo">
                        <i className="bi bi-capsule"></i>
                    </div>
                    <div>
                        <div className="fw-bold fs-5 text-primary lh-1">صيدليتي الذكية</div>
                        <small className="text-muted" style={{ fontSize: '0.72rem' }}>نظام الإدارة والمخزون والمبيعات</small>
                    </div>
                </a>

                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto mb-2 mb-xl-0 gap-1">
                        <li className="nav-item">
                            <button 
                                className={`nav-link border-0 bg-transparent ${activeTab === 'dashboard' ? 'active' : ''}`}
                                onClick={() => setActiveTab('dashboard')}
                            >
                                <i className="bi bi-speedometer2 me-1"></i> لوحة التحكم
                            </button>
                        </li>

                        <li className="nav-item">
                            <button 
                                className={`nav-link border-0 bg-transparent position-relative ${activeTab === 'medicines' ? 'active' : ''}`}
                                onClick={() => setActiveTab('medicines')}
                            >
                                <i className="bi bi-prescription2 me-1"></i> دليل الأدوية
                                {stats?.total_medicines > 0 && (
                                    <span className="badge rounded-pill bg-primary ms-1">
                                        {stats.total_medicines}
                                    </span>
                                )}
                            </button>
                        </li>

                        <li className="nav-item">
                            <button 
                                className={`nav-link border-0 bg-transparent ${activeTab === 'categories' ? 'active' : ''}`}
                                onClick={() => setActiveTab('categories')}
                            >
                                <i className="bi bi-tags me-1"></i> الأقسام
                            </button>
                        </li>

                        <li className="nav-item">
                            <button 
                                className={`nav-link border-0 bg-transparent position-relative ${activeTab === 'cart' ? 'active' : ''}`}
                                onClick={() => setActiveTab('cart')}
                            >
                                <i className="bi bi-cart3 me-1"></i> عربة التسوق
                                {cartCount > 0 && (
                                    <span className="badge rounded-pill bg-danger ms-1 animate__animated animate__pulse">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </li>

                        <li className="nav-item">
                            <button 
                                className={`nav-link border-0 bg-transparent ${activeTab === 'orders' ? 'active' : ''}`}
                                onClick={() => setActiveTab('orders')}
                            >
                                <i className="bi bi-receipt-cutoff me-1"></i> سجل الطلبات
                            </button>
                        </li>

                        <li className="nav-item">
                            <button 
                                className={`nav-link border-0 bg-transparent position-relative ${activeTab === 'prescriptions' ? 'active' : ''}`}
                                onClick={() => setActiveTab('prescriptions')}
                            >
                                <i className="bi bi-camera me-1"></i> الروشتات
                                {stats?.pending_prescriptions > 0 && (
                                    <span className="badge rounded-pill bg-warning text-dark ms-1">
                                        {stats.pending_prescriptions} جديدة
                                    </span>
                                )}
                            </button>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center gap-2 mt-2 mt-xl-0">
                        <a 
                            href="/api/export/medicines" 
                            className="btn btn-outline-success btn-sm btn-pill d-flex align-items-center gap-1"
                            download
                            title="تصدير تقرير المخزون كملف Excel"
                        >
                            <i className="bi bi-file-earmark-excel"></i>
                            <span>تصدير Excel</span>
                        </a>

                        <button 
                            className="btn btn-primary btn-sm d-flex align-items-center gap-1 btn-pill shadow-sm"
                            onClick={onOpenMedicineModal}
                        >
                            <i className="bi bi-plus-circle-fill"></i>
                            <span>دواء جديد</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
