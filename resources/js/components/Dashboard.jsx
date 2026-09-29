import React from 'react';

export default function Dashboard({ 
    stats, 
    medicines, 
    setActiveTab, 
    onOpenMedicineModal, 
    onOpenCategoryModal, 
    onAdjustStock,
    onOpenAlternatives
}) {
    const lowStockMedicines = medicines.filter(m => m.stock_quantity > 0 && m.stock_quantity <= 5);
    const outOfStockMedicines = medicines.filter(m => m.stock_quantity === 0);
    const expiringSoonMedicines = medicines.filter(m => m.is_expiring_soon || m.is_expired);

    return (
        <div className="container pb-5">
            {/* بطاقات الإحصائيات الشاملة */}
            <div className="row g-3 mb-4">
                {/* إجمالي المبيعات المكتملة */}
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card h-100 p-3 shadow-sm border-0 rounded-4">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small fw-bold">إجمالي المبيعات المكتملة</span>
                                <h3 className="fw-bold my-1 text-success">
                                    {(stats?.completed_sales || 0).toFixed(2)} <small className="fs-6">ج.م</small>
                                </h3>
                                <small className="text-muted">{stats?.total_orders || 0} طلب شراء مسجل</small>
                            </div>
                            <div className="stat-icon bg-success-subtle text-success">
                                <i className="bi bi-cash-stack"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* إجمالي الأدوية والمنتجات */}
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card h-100 p-3 shadow-sm border-0 rounded-4">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small fw-bold">إجمالي الأدوية والمنتجات</span>
                                <h3 className="fw-bold my-1 text-primary">{stats?.total_medicines || 0}</h3>
                                <small className="text-muted">{stats?.total_categories || 0} أقسام صيدلية</small>
                            </div>
                            <div className="stat-icon bg-primary-subtle text-primary">
                                <i className="bi bi-capsule"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* تنبيهات المخزون الحرج والنواقص */}
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card h-100 p-3 shadow-sm border-0 rounded-4">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small fw-bold">مخزون حرج &le; 5 علب</span>
                                <h3 className={`fw-bold my-1 ${(stats?.low_stock_count || 0) > 0 ? 'text-danger' : 'text-secondary'}`}>
                                    {(stats?.low_stock_count || 0) + (stats?.out_of_stock_count || 0)}
                                </h3>
                                <small className="text-danger">
                                    {stats?.out_of_stock_count || 0} صنف نفذ تماماً
                                </small>
                            </div>
                            <div className="stat-icon bg-danger-subtle text-danger">
                                <i className="bi bi-exclamation-triangle-fill"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* الصلاحية والروشتات المعلقة */}
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card h-100 p-3 shadow-sm border-0 rounded-4">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small fw-bold">أوشكت على الانتهاء</span>
                                <h3 className={`fw-bold my-1 ${(stats?.expiring_soon_count || 0) > 0 ? 'text-warning' : 'text-secondary'}`}>
                                    {stats?.expiring_soon_count || 0}
                                </h3>
                                <small className="text-muted">خلال 90 يوم أو أقل</small>
                            </div>
                            <div className="stat-icon bg-warning-subtle text-warning">
                                <i className="bi bi-hourglass-split"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* شريط الإجراءات والتقارير */}
            <div className="card p-3 mb-4 shadow-sm border-0 rounded-4 text-white" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #032830 100%)' }}>
                <div className="row align-items-center">
                    <div className="col-md-7">
                        <h4 className="fw-bold mb-1">لوحة إدارة ومتابعة الصيدلية المتقدمة 🩺</h4>
                        <p className="mb-0 text-white-50">
                            تتبع حركات المخزون، إدارة تواريخ الصلاحية، مراجعة الروشتات، وإصدار الفواتير وطباعتها لحظياً.
                        </p>
                    </div>
                    <div className="col-md-5 text-md-end mt-3 mt-md-0 d-flex flex-wrap gap-2 justify-content-md-end">
                        <a 
                            href="/api/export/medicines" 
                            className="btn btn-success fw-bold d-flex align-items-center gap-1 shadow-sm"
                            download
                        >
                            <i className="bi bi-file-earmark-excel-fill"></i>
                            تصدير جرد المخزون (Excel)
                        </a>
                        <button className="btn btn-light fw-bold" onClick={onOpenMedicineModal}>
                            <i className="bi bi-plus-lg me-1"></i> دواء جديد
                        </button>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* تنبيهات النواقص والمخزون الحرج */}
                <div className="col-12 col-lg-6">
                    <div className="card h-100 shadow-sm border-0 rounded-4">
                        <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0 text-danger d-flex align-items-center gap-2">
                                <i className="bi bi-bell-fill"></i>
                                تنبيهات المخزون الحرج والنواقص
                            </h5>
                            <span className="badge bg-danger">
                                {lowStockMedicines.length + outOfStockMedicines.length} أدوية
                            </span>
                        </div>
                        <div className="card-body px-4 pt-2">
                            {lowStockMedicines.length === 0 && outOfStockMedicines.length === 0 ? (
                                <div className="text-center py-4 text-muted">
                                    <i className="bi bi-check-circle-fill text-success fs-1 mb-2 d-block"></i>
                                    المخزون ممتاز! لا توجد نواقص أو كميات حرجة أقل من 5 علب.
                                </div>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {outOfStockMedicines.map(med => (
                                        <div key={med.id} className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-bottom">
                                            <div>
                                                <div className="fw-bold text-danger">{med.name}</div>
                                                <small className="text-muted">{med.category?.name} | {med.active_ingredient || 'المادة الفعالة غير محددة'}</small>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="badge bg-danger">نفذ تماماً</span>
                                                <button 
                                                    className="btn btn-sm btn-outline-info"
                                                    style={{ fontSize: '0.75rem' }}
                                                    onClick={() => onOpenAlternatives(med)}
                                                >
                                                    البدائل
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-success"
                                                    style={{ fontSize: '0.75rem' }}
                                                    onClick={() => onAdjustStock(med.id, 20)}
                                                    title="إضافة 20 علبة شحنة جديدة"
                                                >
                                                    +20 علبة
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {lowStockMedicines.map(med => (
                                        <div key={med.id} className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-bottom">
                                            <div>
                                                <div className="fw-bold">{med.name}</div>
                                                <small className="text-muted">{med.category?.name}</small>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="badge bg-warning text-dark">
                                                    متبقي {med.stock_quantity} علب
                                                </span>
                                                <button 
                                                    className="btn btn-sm btn-outline-success"
                                                    style={{ fontSize: '0.75rem' }}
                                                    onClick={() => onAdjustStock(med.id, med.stock_quantity + 10)}
                                                    title="زيادة 10 علب فوراً"
                                                >
                                                    +10 علب
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* تنبيهات تواريخ الصلاحية */}
                <div className="col-12 col-lg-6">
                    <div className="card h-100 shadow-sm border-0 rounded-4">
                        <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0 text-warning text-dark d-flex align-items-center gap-2">
                                <i className="bi bi-calendar2-week-fill text-warning"></i>
                                تنبيهات تواريخ الصلاحية (Expiry Alerts)
                            </h5>
                            <span className="badge bg-warning text-dark">
                                {expiringSoonMedicines.length} أدوية
                            </span>
                        </div>
                        <div className="card-body px-4 pt-2">
                            {expiringSoonMedicines.length === 0 ? (
                                <div className="text-center py-4 text-muted">
                                    <i className="bi bi-shield-check text-success fs-1 mb-2 d-block"></i>
                                    جميع الأدوية صالحة ولا توجد أصناف قريبة الانتهاء خلال 90 يوم.
                                </div>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {expiringSoonMedicines.map(med => (
                                        <div key={med.id} className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-bottom">
                                            <div>
                                                <div className="fw-bold">{med.name}</div>
                                                <small className="text-muted">
                                                    تاريخ الانتهاء: <strong>{med.expiry_date?.substring(0, 10)}</strong>
                                                </small>
                                            </div>
                                            <div>
                                                {med.is_expired ? (
                                                    <span className="badge bg-danger">منتهي الصلاحية!</span>
                                                ) : (
                                                    <span className="badge bg-warning text-dark">أوشك على الانتهاء</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* قائمة الأدوية الأكثر طلباً ومبيعاً */}
                <div className="col-12">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                                <i className="bi bi-graph-up-arrow text-success"></i>
                                قائمة الأدوية الأكثر طلباً ومبيعاً
                            </h5>
                            <button className="btn btn-sm btn-link text-decoration-none" onClick={() => setActiveTab('orders')}>
                                سجل المبيعات والطلبات &larr;
                            </button>
                        </div>
                        <div className="card-body px-4 pt-2">
                            {(stats?.top_selling || []).length === 0 ? (
                                <div className="text-center py-4 text-muted">
                                    <i className="bi bi-bar-chart fs-1 mb-2 d-block"></i>
                                    لم يتم تسجيل مبيعات كافية لعرض الأكثر مبيعاً حتى الآن.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>#</th>
                                                <th>اسم الدواء</th>
                                                <th>إجمالي الكمية المباعة</th>
                                                <th>إجمالي الإيرادات</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.top_selling.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td className="fw-bold text-primary">{item.medicine_name}</td>
                                                    <td>
                                                        <span className="badge bg-primary-subtle text-primary border px-3 py-1">
                                                            {item.total_sold} علبة
                                                        </span>
                                                    </td>
                                                    <td className="fw-bold text-success">
                                                        {parseFloat(item.total_revenue).toFixed(2)} ج.م
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
