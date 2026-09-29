import React, { useState } from 'react';

export default function CategoriesList({ categories, medicines, onAddCategory, onDeleteCategory }) {
    const [name, setName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setSubmitting(true);
        await onAddCategory(name.trim());
        setName('');
        setSubmitting(false);
    };

    return (
        <div className="container pb-5">
            <div className="row g-4">
                {/* فورم إضافة قسم جديد */}
                <div className="col-12 col-lg-4">
                    <div className="card p-4 sticky-top" style={{ top: '90px' }}>
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                            <i className="bi bi-folder-plus text-primary"></i>
                            إضافة قسم جديد
                        </h5>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-bold small text-muted">اسم القسم:</label>
                                <input 
                                    type="text"
                                    className="form-control"
                                    placeholder="مثال: أدوية أطفال، مسكنات، عناية بالبشرة..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <small className="text-muted">
                                    يساعد تنظيم الأدوية في أقسام على سهولة البحث والوصول.
                                </small>
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-primary w-100 btn-pill fw-bold"
                                disabled={submitting || !name.trim()}
                            >
                                {submitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        جاري الحفظ...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-lg me-1"></i> حفظ القسم
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* قائمة الأقسام الحالية */}
                <div className="col-12 col-lg-8">
                    <div className="card">
                        <div className="card-header bg-white border-0 pt-3 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                                <i className="bi bi-tags-fill text-primary"></i>
                                أقسام الصيدلية الحالية
                            </h5>
                            <span className="badge bg-primary rounded-pill px-3 py-2">
                                {categories.length} أقسام
                            </span>
                        </div>
                        <div className="card-body p-4 pt-2">
                            {categories.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-folder-x fs-1 mb-2 d-block"></i>
                                    لا توجد أقسام مضافة بعد. ابدأ بإضافة قسمك الأول من النموذج الجانبي!
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {categories.map(cat => {
                                        const count = medicines.filter(m => m.category_id === cat.id).length;
                                        return (
                                            <div key={cat.id} className="col-12 col-sm-6">
                                                <div className="card border bg-light h-100 p-3">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="stat-icon bg-white text-primary border" style={{ width: '42px', height: '42px' }}>
                                                                <i className="bi bi-grid"></i>
                                                            </div>
                                                            <div>
                                                                <h6 className="fw-bold mb-0">{cat.name}</h6>
                                                                <small className="text-muted">{count} أدوية مسجلة</small>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger"
                                                            title="حذف القسم"
                                                            onClick={() => onDeleteCategory(cat.id, cat.name, count)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
