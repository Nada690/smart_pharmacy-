import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ActivityLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            const res = await axios.get('/api/activity-logs');
            setLogs(res.data);
        } catch (err) {
            console.error('Error loading logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => {
        if (filter === 'all') return true;
        return log.action === filter;
    });

    const getActionIcon = (action) => {
        switch (action) {
            case 'أضاف': return 'bi-plus-circle-fill text-success';
            case 'عدّل': return 'bi-pencil-fill text-primary';
            case 'حذف': return 'bi-trash-fill text-danger';
            case 'طلب': return 'bi-cart-fill text-warning';
            default: return 'bi-info-circle-fill text-secondary';
        }
    };

    const getActionBadge = (action) => {
        switch (action) {
            case 'أضاف': return 'bg-success-subtle text-success';
            case 'عدّل': return 'bg-primary-subtle text-primary';
            case 'حذف': return 'bg-danger-subtle text-danger';
            case 'طلب': return 'bg-warning-subtle text-warning text-dark';
            default: return 'bg-secondary-subtle text-secondary';
        }
    };

    if (loading) {
        return (
            <div className="container pb-5">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">جاري التحميل...</span>
                    </div>
                    <p className="mt-3 text-muted fw-bold">جاري تحميل سجل الأنشطة...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container pb-5">
            <div className="card shadow-sm border-0 rounded-4">
                <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                        <i className="bi bi-clock-history text-primary"></i>
                        سجل الأنشطة (Activity Logs)
                    </h5>
                    <div className="d-flex gap-2">
                        <select
                            className="form-select form-select-sm"
                            style={{ width: 'auto' }}
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">جميع الأنشطة</option>
                            <option value="أضاف">إضافة</option>
                            <option value="عدّل">تعديل</option>
                            <option value="حذف">حذف</option>
                            <option value="طلب">طلبات</option>
                        </select>
                    </div>
                </div>
                <div className="card-body px-4 pt-2">
                    {filteredLogs.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            <i className="bi bi-inbox fs-1 mb-2 d-block"></i>
                            لا توجد أنشطة مسجلة حتى الآن.
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>الوقت</th>
                                        <th>المستخدم</th>
                                        <th>الإجراء</th>
                                        <th>العنصر</th>
                                        <th>التفاصيل</th>
                                        <th>IP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLogs.map((log) => (
                                        <tr key={log.id}>
                                            <td>
                                                <small className="text-muted">
                                                    {new Date(log.created_at).toLocaleString('ar-EG')}
                                                </small>
                                            </td>
                                            <td className="fw-bold">{log.user_name}</td>
                                            <td>
                                                <span className={`badge ${getActionBadge(log.action)}`}>
                                                    <i className={`bi ${getActionIcon(log.action)} me-1`}></i>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="fw-bold">{log.model_name}</div>
                                                <small className="text-muted">{log.model_type}</small>
                                            </td>
                                            <td className="text-muted small">{log.description}</td>
                                            <td>
                                                <code className="small text-muted">{log.ip_address}</code>
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
    );
}
