import React, { useState, useEffect } from 'react';

export default function MedicineModal({ isOpen, onClose, onSave, editingMedicine, categories }) {
    const [formData, setFormData] = useState({
        category_id: '',
        name: '',
        active_ingredient: '',
        description: '',
        price: '',
        stock_quantity: 0,
        expiry_date: '',
        requires_prescription: false,
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editingMedicine) {
            setFormData({
                category_id: editingMedicine.category_id || '',
                name: editingMedicine.name || '',
                active_ingredient: editingMedicine.active_ingredient || '',
                description: editingMedicine.description || '',
                price: editingMedicine.price || '',
                stock_quantity: editingMedicine.stock_quantity ?? 0,
                expiry_date: editingMedicine.expiry_date ? editingMedicine.expiry_date.substring(0, 10) : '',
                requires_prescription: Boolean(editingMedicine.requires_prescription),
            });
        } else {
            setFormData({
                category_id: categories.length > 0 ? categories[0].id : '',
                name: '',
                active_ingredient: '',
                description: '',
                price: '',
                stock_quantity: 0,
                expiry_date: '',
                requires_prescription: false,
            });
        }
        setErrors({});
    }, [editingMedicine, isOpen, categories]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        try {
            await onSave(formData, editingMedicine?.id);
            onClose();
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: 'حدث خطأ غير متوقع أثناء حفظ البيانات' });
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                            <i className="bi bi-capsule"></i>
                            {editingMedicine ? 'تعديل بيانات الدواء والمخزون' : 'إضافة دواء جديد للصيدلية'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            {errors.general && (
                                <div className="alert alert-danger py-2">{errors.general}</div>
                            )}

                            <div className="row g-3">
                                {/* القسم */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-bold small text-muted">القسم الصيدلي: <span className="text-danger">*</span></label>
                                    <select 
                                        className={`form-select ${errors.category_id ? 'is-invalid' : ''}`}
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                        required
                                    >
                                        <option value="">اختر القسم...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <div className="invalid-feedback">{errors.category_id[0]}</div>}
                                </div>

                                {/* اسم الدواء */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-bold small text-muted">اسم الدواء التجاري: <span className="text-danger">*</span></label>
                                    <input 
                                        type="text"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        placeholder="مثال: بانادول إكسترا 500 ملجم"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                                </div>

                                {/* المادة الفعالة */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-bold small text-muted">
                                        <i className="bi bi-radioactive text-info me-1"></i>
                                        المادة الفعالة (Active Ingredient):
                                    </label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        placeholder="مثال: باراسيتامول + كافيين (Paracetamol)"
                                        value={formData.active_ingredient}
                                        onChange={(e) => setFormData({ ...formData, active_ingredient: e.target.value })}
                                    />
                                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                        تستخدم لاقتراح البدائل الدوائية عند نفاد المخزون
                                    </small>
                                </div>

                                {/* تاريخ الصلاحية */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-bold small text-muted">
                                        <i className="bi bi-calendar-event text-warning me-1"></i>
                                        تاريخ انتهاء الصلاحية (Expiry Date):
                                    </label>
                                    <input 
                                        type="date"
                                        className="form-control"
                                        value={formData.expiry_date}
                                        onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                                    />
                                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                        يظهر تنبيهاً تلقائياً عند اقتراب انتهاء الصلاحية
                                    </small>
                                </div>

                                {/* السعر */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-bold small text-muted">السعر (بالجنيه): <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input 
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                            placeholder="0.00"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            required
                                        />
                                        <span className="input-group-text">ج.م</span>
                                    </div>
                                    {errors.price && <div className="invalid-feedback">{errors.price[0]}</div>}
                                </div>

                                {/* المخزون */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-bold small text-muted">الكمية المتاحة بالمخزن: <span className="text-danger">*</span></label>
                                    <input 
                                        type="number"
                                        min="0"
                                        className={`form-control ${errors.stock_quantity ? 'is-invalid' : ''}`}
                                        value={formData.stock_quantity}
                                        onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                                        required
                                    />
                                    {errors.stock_quantity && <div className="invalid-feedback">{errors.stock_quantity[0]}</div>}
                                </div>

                                {/* الوصف */}
                                <div className="col-12">
                                    <label className="form-label fw-bold small text-muted">الوصف والجرعة ودواعي الاستعمال:</label>
                                    <textarea 
                                        className="form-control"
                                        rows="2"
                                        placeholder="مثال: يؤخذ قرص واحد كل 8 ساعات بعد الأكل..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>

                                {/* يتطلب روشتة */}
                                <div className="col-12">
                                    <div className="form-check form-switch p-0 pt-2 d-flex align-items-center gap-3">
                                        <input 
                                            className="form-check-input ms-0 me-2"
                                            type="checkbox"
                                            role="switch"
                                            id="prescriptionSwitch"
                                            checked={formData.requires_prescription}
                                            onChange={(e) => setFormData({ ...formData, requires_prescription: e.target.checked })}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <label className="form-check-label fw-bold" htmlFor="prescriptionSwitch" style={{ cursor: 'pointer' }}>
                                            يتطلب هذا الدواء روشتة طبية معتمدة للصرف (Prescription Only)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer bg-light border-0 px-4 py-3">
                            <button type="button" className="btn btn-outline-secondary btn-pill" onClick={onClose} disabled={saving}>
                                إلغاء
                            </button>
                            <button type="submit" className="btn btn-primary btn-pill px-4 fw-bold" disabled={saving}>
                                {saving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        جاري الحفظ...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-circle me-1"></i>
                                        {editingMedicine ? 'تحديث البيانات' : 'حفظ الدواء'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
