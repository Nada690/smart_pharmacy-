import React, { useState } from 'react';
import axios from 'axios';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isRegister ? '/api/register' : '/api/login';
            const data = isRegister ? formData : { email: formData.email, password: formData.password };

            const res = await axios.post(endpoint, data);

            if (res.data.success) {
                onLoginSuccess(res.data.user);
                onClose();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ، يرجى المحاولة مرة أخرى');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {isRegister ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {isRegister && (
                                <div className="mb-3">
                                    <label className="form-label">الاسم</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="form-label">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">كلمة المرور</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={8}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : null}
                                {isRegister ? 'إنشاء الحساب' : 'تسجيل الدخول'}
                            </button>
                        </form>

                        <div className="text-center mt-3">
                            <button
                                className="btn btn-link"
                                onClick={() => {
                                    setIsRegister(!isRegister);
                                    setError('');
                                }}
                            >
                                {isRegister
                                    ? 'لديك حساب بالفعل؟ سجل دخول'
                                    : 'ليس لديك حساب؟ أنشئ حساباً جديداً'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
