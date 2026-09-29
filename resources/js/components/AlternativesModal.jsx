import React from 'react';

export default function AlternativesModal({ isOpen, onClose, originalMedicine, alternatives, onAddToCart }) {
    if (!isOpen || !originalMedicine) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="modal-header bg-info-subtle border-0 py-3">
                        <div className="d-flex align-items-center gap-2">
                            <div className="stat-icon bg-info text-white" style={{ width: '40px', height: '40px' }}>
                                <i className="bi bi-arrow-repeat"></i>
                            </div>
                            <div>
                                <h5 className="modal-title fw-bold text-dark mb-0">البدائل الدوائية المتاحة</h5>
                                <small className="text-muted">أدوية بديلة بنفس المادة الفعالة متوفرة حالياً في المخزن</small>
                            </div>
                        </div>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body p-4">
                        {/* معلومات الدواء الأصلي المطلوب */}
                        <div className="card bg-light border p-3 mb-4 rounded-3">
                            <div className="row align-items-center">
                                <div className="col-md-8">
                                    <span className="badge bg-secondary mb-1">الدواء المطلوب</span>
                                    <h5 className="fw-bold mb-1 text-dark">{originalMedicine.name}</h5>
                                    <div className="text-muted small">
                                        <i className="bi bi-capsule me-1 text-primary"></i>
                                        المادة الفعالة: <strong className="text-primary">{originalMedicine.active_ingredient || 'غير محددة'}</strong>
                                    </div>
                                </div>
                                <div className="col-md-4 text-md-end mt-2 mt-md-0">
                                    <span className="badge bg-danger p-2 px-3 fs-6">
                                        {originalMedicine.stock_quantity === 0 ? 'غير متوفر في المخزن' : `متبقي ${originalMedicine.stock_quantity} علب فقط`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <h6 className="fw-bold mb-3 text-secondary d-flex align-items-center gap-2">
                            <i className="bi bi-check-circle-fill text-success"></i>
                            قائمة البدائل المتوفرة فوراً في الصيدلية ({alternatives.length}):
                        </h6>

                        {alternatives.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                <i className="bi bi-search fs-1 mb-2 d-block text-warning"></i>
                                للأسف، لا توجد بدائل متوفرة حالياً بنفس المادة الفعالة في المخزن.
                            </div>
                        ) : (
                            <div className="row g-3">
                                {alternatives.map(alt => (
                                    <div key={alt.id} className="col-12 col-md-6">
                                        <div className="card h-100 border shadow-sm p-3">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h6 className="fw-bold mb-0 text-primary">{alt.name}</h6>
                                                <span className="badge bg-success-subtle text-success border">
                                                    متوفر ({alt.stock_quantity} علبة)
                                                </span>
                                            </div>

                                            <p className="text-muted small mb-2 flex-grow-1">
                                                {alt.description || 'بديل فعال يحتوي على نفس التركيبة الدوائية.'}
                                            </p>

                                            <div className="small text-secondary mb-3">
                                                <strong>المادة الفعالة:</strong> {alt.active_ingredient || alt.category?.name}
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                                                <span className="fw-bold text-success fs-5">{parseFloat(alt.price).toFixed(2)} ج.م</span>
                                                <button 
                                                    className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                                                    onClick={() => { onAddToCart(alt); onClose(); }}
                                                >
                                                    <i className="bi bi-cart-plus"></i>
                                                    إضافة للسلة
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="modal-footer bg-light border-0">
                        <button type="button" className="btn btn-secondary btn-pill px-4" onClick={onClose}>
                            إغلاق
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
