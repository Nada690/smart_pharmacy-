import React, { useState, useMemo } from 'react';

export default function MedicinesList({ 
    medicines, 
    categories, 
    onOpenMedicineModal, 
    onEditMedicine, 
    onDeleteMedicine, 
    onAdjustStock,
    onAddToCart,
    onOpenAlternatives,
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [prescriptionFilter, setPrescriptionFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');
    const [expiryFilter, setExpiryFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

    const filteredMedicines = useMemo(() => {
        return medicines.filter(med => {
            const term = searchTerm.toLowerCase();
            const matchesSearch = med.name.toLowerCase().includes(term) ||
                (med.active_ingredient && med.active_ingredient.toLowerCase().includes(term)) ||
                (med.description && med.description.toLowerCase().includes(term));
            
            const matchesCategory = selectedCategory === 'all' || 
                med.category_id.toString() === selectedCategory.toString();

            const matchesPrescription = prescriptionFilter === 'all' ||
                (prescriptionFilter === 'yes' && med.requires_prescription) ||
                (prescriptionFilter === 'no' && !med.requires_prescription);

            let matchesStock = true;
            if (stockFilter === 'out') {
                matchesStock = med.stock_quantity === 0;
            } else if (stockFilter === 'low') {
                matchesStock = med.stock_quantity > 0 && med.stock_quantity <= 5;
            } else if (stockFilter === 'available') {
                matchesStock = med.stock_quantity > 5;
            }

            let matchesExpiry = true;
            if (expiryFilter === 'expiring_soon') {
                matchesExpiry = Boolean(med.is_expiring_soon);
            } else if (expiryFilter === 'expired') {
                matchesExpiry = Boolean(med.is_expired);
            }

            return matchesSearch && matchesCategory && matchesPrescription && matchesStock && matchesExpiry;
        });
    }, [medicines, searchTerm, selectedCategory, prescriptionFilter, stockFilter, expiryFilter]);

    return (
        <div className="container pb-5">
            {/* بطاقة أدوات البحث والفلترة المتقدمة */}
            <div className="card p-3 mb-4 shadow-sm border-0 rounded-4">
                <div className="row g-3 align-items-center">
                    {/* البحث السريع بالمادة الفعالة أو الاسم */}
                    <div className="col-12 col-md-4">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="bi bi-search text-muted"></i>
                            </span>
                            <input 
                                type="text"
                                className="form-control border-start-0"
                                placeholder="ابحث باسم الدواء، المادة الفعالة، الوصف..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
                                    <i className="bi bi-x"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* فلتر حالة المخزون (تنبيهات انخفاض المخزون) */}
                    <div className="col-6 col-md-3">
                        <select 
                            className="form-select"
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                        >
                            <option value="all">كل حالات المخزون</option>
                            <option value="available">✅ متوفر (&gt; 5 علب)</option>
                            <option value="low">⚠️ مخزون حرج (&le; 5 علب)</option>
                            <option value="out">❌ نفذ من المخزن (0)</option>
                        </select>
                    </div>

                    {/* فلتر الروشتة */}
                    <div className="col-6 col-md-2">
                        <select 
                            className="form-select"
                            value={prescriptionFilter}
                            onChange={(e) => setPrescriptionFilter(e.target.value)}
                        >
                            <option value="all">الكل (روشتة / OTC)</option>
                            <option value="yes">🔒 روشتة طبية</option>
                            <option value="no">💊 متاح مباشر (OTC)</option>
                        </select>
                    </div>

                    {/* أزرار الإجراءات وتغيير العرض وتصدير Excel */}
                    <div className="col-12 col-md-3 text-md-end d-flex gap-2 justify-content-md-end align-items-center">
                        <a 
                            href="/api/export/medicines" 
                            className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
                            title="تصدير تقرير المخزون Excel / CSV"
                            download
                        >
                            <i className="bi bi-file-earmark-excel"></i>
                            <span className="d-none d-lg-inline">تصدير Excel</span>
                        </a>

                        <div className="btn-group btn-group-sm" role="group">
                            <button 
                                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setViewMode('grid')}
                                title="عرض كبطاقات"
                            >
                                <i className="bi bi-grid-3x3-gap-fill"></i>
                            </button>
                            <button 
                                className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setViewMode('table')}
                                title="عرض كجدول"
                            >
                                <i className="bi bi-table"></i>
                            </button>
                        </div>

                        <button 
                            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                            onClick={onOpenMedicineModal}
                        >
                            <i className="bi bi-plus-lg"></i>
                            <span>دواء جديد</span>
                        </button>
                    </div>
                </div>

                {/* شريط فلترة الأقسام والصلاحية */}
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                        <span className="small text-muted fw-bold me-1">الأقسام:</span>
                        <span 
                            className={`badge p-2 px-3 category-badge-filter ${selectedCategory === 'all' ? 'active' : 'bg-light text-dark'}`}
                            onClick={() => setSelectedCategory('all')}
                        >
                            الكل ({medicines.length})
                        </span>
                        {categories.map(cat => (
                            <span 
                                key={cat.id}
                                className={`badge p-2 px-3 category-badge-filter ${selectedCategory === cat.id.toString() ? 'active' : 'bg-light text-dark'}`}
                                onClick={() => setSelectedCategory(cat.id.toString())}
                            >
                                {cat.name} ({medicines.filter(m => m.category_id === cat.id).length})
                            </span>
                        ))}
                    </div>

                    <div className="d-flex gap-2 align-items-center">
                        <span className="small text-muted fw-bold">الصلاحية:</span>
                        <button 
                            className={`btn btn-sm ${expiryFilter === 'expiring_soon' ? 'btn-warning text-dark' : 'btn-outline-warning text-dark'}`}
                            onClick={() => setExpiryFilter(expiryFilter === 'expiring_soon' ? 'all' : 'expiring_soon')}
                        >
                            <i className="bi bi-clock-history me-1"></i>
                            أوشك على الانتهاء
                        </button>
                        <button 
                            className={`btn btn-sm ${expiryFilter === 'expired' ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => setExpiryFilter(expiryFilter === 'expired' ? 'all' : 'expired')}
                        >
                            <i className="bi bi-x-circle me-1"></i>
                            منتهي الصلاحية
                        </button>
                    </div>
                </div>
            </div>

            {/* حالة عدم وجود نتائج */}
            {filteredMedicines.length === 0 ? (
                <div className="card text-center p-5 border-0 shadow-sm rounded-4">
                    <div className="py-4">
                        <i className="bi bi-capsule text-muted" style={{ fontSize: '3.5rem' }}></i>
                        <h5 className="fw-bold mt-3">لم يتم العثور على أدوية مطابقة</h5>
                        <p className="text-muted">جرب البحث بالمادة الفعالة أو اسم آخر، أو قم بإضافة دواء جديد.</p>
                        <button className="btn btn-primary btn-pill mt-2" onClick={onOpenMedicineModal}>
                            + إضافة دواء جديد
                        </button>
                    </div>
                </div>
            ) : viewMode === 'grid' ? (
                /* عرض البطاقات (Grid View) */
                <div className="row g-3">
                    {filteredMedicines.map(med => {
                        const isOutOfStock = med.stock_quantity === 0;
                        const isLowStock = med.stock_quantity > 0 && med.stock_quantity <= 5;

                        return (
                            <div key={med.id} className="col-12 col-sm-6 col-lg-4">
                                <div className={`card medicine-card shadow-sm border-0 ${isOutOfStock ? 'bg-light' : ''}`}>
                                    <div className="card-body">
                                        {/* شارات الحالة العلوية */}
                                        <div className="d-flex flex-wrap justify-content-between align-items-start gap-1 mb-2">
                                            <span className="badge badge-soft-primary">
                                                {med.category?.name || 'عام'}
                                            </span>

                                            <div className="d-flex gap-1">
                                                {med.requires_prescription ? (
                                                    <span className="badge badge-soft-danger" title="يتطلب روشتة طبية معتمدة">
                                                        <i className="bi bi-file-medical me-1"></i> روشتة
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-soft-success">OTC</span>
                                                )}

                                                {med.is_expired ? (
                                                    <span className="badge bg-danger" title="انتهت صلاحية هذا الدواء!">منتهي</span>
                                                ) : med.is_expiring_soon ? (
                                                    <span className="badge bg-warning text-dark" title="تقترب الصلاحية من الانتهاء خلال 90 يوم">قريب الانتهاء</span>
                                                ) : null}
                                            </div>
                                        </div>

                                        <h5 className="card-title fw-bold mb-1 text-dark">{med.name}</h5>

                                        {/* المادة الفعالة */}
                                        {med.active_ingredient && (
                                            <div className="small text-primary mb-2">
                                                <i className="bi bi-capsule me-1"></i>
                                                <strong>المادة الفعالة:</strong> {med.active_ingredient}
                                            </div>
                                        )}

                                        <p className="card-text text-muted small flex-grow-1" style={{ minHeight: '38px' }}>
                                            {med.description || 'لا يوجد وصف تفصيلي مسجل.'}
                                        </p>

                                        {/* تنبيه المخزون الحرج أو النفاد */}
                                        {isOutOfStock ? (
                                            <div className="alert alert-danger py-2 px-3 small d-flex justify-content-between align-items-center mb-2 rounded-3">
                                                <span><i className="bi bi-x-circle-fill me-1"></i> نفذ من المخزن!</span>
                                                <button 
                                                    className="btn btn-sm btn-danger fw-bold"
                                                    style={{ fontSize: '0.75rem' }}
                                                    onClick={() => onOpenAlternatives(med)}
                                                >
                                                    🔍 البحث عن بدائل
                                                </button>
                                            </div>
                                        ) : isLowStock ? (
                                            <div className="alert alert-warning py-1 px-3 small d-flex justify-content-between align-items-center mb-2 rounded-3 text-dark">
                                                <span><i className="bi bi-exclamation-triangle-fill text-warning me-1"></i> مخزون حرج: <strong>{med.stock_quantity} علب</strong></span>
                                                <button 
                                                    className="btn btn-sm btn-outline-dark"
                                                    style={{ fontSize: '0.7rem' }}
                                                    onClick={() => onAdjustStock(med.id, med.stock_quantity + 10)}
                                                >
                                                    +10 علب
                                                </button>
                                            </div>
                                        ) : null}

                                        {/* السعر والتحكم في المخزون */}
                                        <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                                            <div>
                                                <div className="text-muted small">السعر</div>
                                                <div className="price-tag">{parseFloat(med.price).toFixed(2)} ج.م</div>
                                            </div>
                                            <div className="text-end">
                                                <div className="text-muted small">المخزون السريع</div>
                                                <div className="d-flex align-items-center gap-1">
                                                    <button 
                                                        className="btn btn-sm btn-outline-secondary stock-control-btn"
                                                        title="إنقاص وحدة واحدة"
                                                        disabled={med.stock_quantity <= 0}
                                                        onClick={() => onAdjustStock(med.id, Math.max(0, med.stock_quantity - 1))}
                                                    >
                                                        -
                                                    </button>
                                                    <span className={`badge ${isOutOfStock ? 'bg-danger' : (isLowStock ? 'bg-warning text-dark' : 'bg-light text-dark border')}`}>
                                                        {med.stock_quantity}
                                                    </span>
                                                    <button 
                                                        className="btn btn-sm btn-outline-secondary stock-control-btn"
                                                        title="زيادة وحدة واحدة"
                                                        onClick={() => onAdjustStock(med.id, med.stock_quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* شريط الإجراءات والسلة */}
                                    <div className="card-footer bg-white border-0 pt-0 pb-3 px-3 d-flex justify-content-between align-items-center">
                                        <button 
                                            className="btn btn-sm btn-success d-flex align-items-center gap-1 rounded-pill px-3"
                                            disabled={isOutOfStock}
                                            onClick={() => onAddToCart(med)}
                                        >
                                            <i className="bi bi-cart-plus-fill"></i>
                                            <span>إضافة للسلة</span>
                                        </button>

                                        <div className="d-flex gap-1">
                                            <button 
                                                className="btn btn-sm btn-outline-info"
                                                onClick={() => onOpenAlternatives(med)}
                                                title="البحث عن البدائل الدوائية"
                                            >
                                                <i className="bi bi-arrow-repeat"></i>
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => onEditMedicine(med)}
                                                title="تعديل الدواء"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => onDeleteMedicine(med.id, med.name)}
                                                title="حذف الدواء"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* عرض الجدول (Table View) */
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>اسم الدواء</th>
                                    <th>المادة الفعالة</th>
                                    <th>القسم</th>
                                    <th>السعر</th>
                                    <th>حالة المخزون</th>
                                    <th>تاريخ الصلاحية</th>
                                    <th>روشتة؟</th>
                                    <th className="text-center">إجراءات وسلة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMedicines.map(med => {
                                    const isOutOfStock = med.stock_quantity === 0;
                                    const isLowStock = med.stock_quantity > 0 && med.stock_quantity <= 5;

                                    return (
                                        <tr key={med.id}>
                                            <td className="fw-bold">{med.name}</td>
                                            <td className="text-primary small">{med.active_ingredient || '—'}</td>
                                            <td>
                                                <span className="badge badge-soft-primary">
                                                    {med.category?.name || '—'}
                                                </span>
                                            </td>
                                            <td className="fw-bold text-success">{parseFloat(med.price).toFixed(2)} ج.م</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-1">
                                                    <button 
                                                        className="btn btn-sm btn-outline-secondary stock-control-btn"
                                                        disabled={isOutOfStock}
                                                        onClick={() => onAdjustStock(med.id, Math.max(0, med.stock_quantity - 1))}
                                                    >
                                                        -
                                                    </button>
                                                    <span className={`badge ${isOutOfStock ? 'bg-danger' : (isLowStock ? 'bg-warning text-dark' : 'bg-light text-dark border')}`}>
                                                        {med.stock_quantity} علب
                                                    </span>
                                                    <button 
                                                        className="btn btn-sm btn-outline-secondary stock-control-btn"
                                                        onClick={() => onAdjustStock(med.id, med.stock_quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                {med.expiry_date ? (
                                                    <span className={`badge ${med.is_expired ? 'bg-danger' : (med.is_expiring_soon ? 'bg-warning text-dark' : 'bg-light text-dark border')}`}>
                                                        {med.expiry_date.substring(0, 10)}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted small">—</span>
                                                )}
                                            </td>
                                            <td>
                                                {med.requires_prescription ? (
                                                    <span className="badge badge-soft-danger">نعم</span>
                                                ) : (
                                                    <span className="badge badge-soft-success">لا</span>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                <div className="btn-group btn-group-sm">
                                                    <button 
                                                        className="btn btn-success"
                                                        disabled={isOutOfStock}
                                                        title="إضافة للسلة"
                                                        onClick={() => onAddToCart(med)}
                                                    >
                                                        <i className="bi bi-cart-plus"></i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-outline-info"
                                                        title="البدائل"
                                                        onClick={() => onOpenAlternatives(med)}
                                                    >
                                                        <i className="bi bi-arrow-repeat"></i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-outline-primary"
                                                        title="تعديل"
                                                        onClick={() => onEditMedicine(med)}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-outline-danger"
                                                        title="حذف"
                                                        onClick={() => onDeleteMedicine(med.id, med.name)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
