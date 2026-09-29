import React, { useState } from 'react';

export default function CategoryModal({ isOpen, onClose, onAddCategory }) {
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setSaving(true);
        setError('');
        try {
            await onAddCategory(name.trim());
            setName('');
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ أثناء إضافة القسم');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="modal-header bg-success text-white">
                        <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                            <i className="bi bi-folder-plus"></i>
                            إضافة قسم صيدلي جديد
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            {error && <div className="alert alert-danger py-2">{error}</div>}

                            <div className="mb-3">
                                <label className="form-label fw-bold small text-muted">اسم القسم: <span className="text-danger">*</span></label>
                                <input 
                                    type="text"
                                    className="form-control"
                                    placeholder="مثال: فيتامينات ومكملات غذائية"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>
                        </div>

                        <div className="modal-footer bg-light border-0 px-4 py-3">
                            <button type="button" className="btn btn-outline-secondary btn-pill" onClick={onClose} disabled={saving}>
                                إلغاء
                            </button>
                            <button type="submit" className="btn btn-success btn-pill px-4 fw-bold" disabled={saving || !name.trim()}>
                                {saving ? 'جاري الحفظ...' : 'حفظ القسم'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
