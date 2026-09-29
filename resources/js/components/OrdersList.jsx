import React, { useState } from 'react';

export default function OrdersList({ orders, onUpdateStatus, onOpenInvoice }) {
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredOrders = orders.filter(order => {
        if (statusFilter === 'all') return true;
        return order.status === statusFilter;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="badge bg-success-subtle text-success border px-3 py-2">مكتمل / تم التوصيل</span>;
            case 'cancelled':
                return <span className="badge bg-danger-subtle text-danger border px-3 py-2">ملغي</span>;
            default:
                return <span className="badge bg-warning-subtle text-warning-emphasis border px-3 py-2">قيد الانتظار</span>;
        }
    };

    return (
        <div className="container pb-5">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                <div>
                    <h4 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                        <i className="bi bi-receipt-cutoff text-primary"></i>
                        سجل الطلبات والمبيعات
                    </h4>
                    <p className="text-muted small mb-0">متابعة فواتير وطلبات العملاء وحالات التوصيل</p>
                </div>

                <div className="btn-group" role="group">
                    <button 
                        className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setStatusFilter('all')}
                    >
                        الكل ({orders.length})
                    </button>
                    <button 
                        className={`btn btn-sm ${statusFilter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setStatusFilter('pending')}
                    >
                        قيد الانتظار ({orders.filter(o => o.status === 'pending').length})
                    </button>
                    <button 
                        className={`btn btn-sm ${statusFilter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setStatusFilter('completed')}
                    >
                        المكتملة ({orders.filter(o => o.status === 'completed').length})
                    </button>
                    <button 
                        className={`btn btn-sm ${statusFilter === 'cancelled' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setStatusFilter('cancelled')}
                    >
                        الملغية ({orders.filter(o => o.status === 'cancelled').length})
                    </button>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="card shadow-sm border-0 rounded-4 p-5 text-center">
                    <div className="py-4">
                        <i className="bi bi-inbox fs-1 mb-2 d-block text-muted"></i>
                        <h5 className="fw-bold">لا توجد طلبات مطابقة</h5>
                        <p className="text-muted">لم يتم تسجيل أي طلبات بهذه الحالة حتى الآن.</p>
                    </div>
                </div>
            ) : (
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>رقم الطلب</th>
                                    <th>العميل</th>
                                    <th>رقم الهاتف</th>
                                    <th>عدد الأصناف</th>
                                    <th>إجمالي الفاتورة</th>
                                    <th>الحالة</th>
                                    <th>التاريخ</th>
                                    <th className="text-center">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order.id}>
                                        <td className="fw-bold text-primary">{order.order_number}</td>
                                        <td>{order.customer_name}</td>
                                        <td>{order.customer_phone}</td>
                                        <td>
                                            <span className="badge bg-light text-dark border">
                                                {order.items?.length || 0} أصناف
                                            </span>
                                        </td>
                                        <td className="fw-bold text-success fs-6">
                                            {parseFloat(order.total_price).toFixed(2)} ج.م
                                        </td>
                                        <td>{getStatusBadge(order.status)}</td>
                                        <td className="small text-muted">
                                            {new Date(order.created_at).toLocaleDateString('ar-EG')}
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex align-items-center justify-content-center gap-2">
                                                <button 
                                                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                                                    onClick={() => onOpenInvoice(order)}
                                                    title="طباعة الفاتورة"
                                                >
                                                    <i className="bi bi-printer"></i>
                                                    <span className="d-none d-md-inline">فاتورة</span>
                                                </button>

                                                <select 
                                                    className="form-select form-select-sm"
                                                    style={{ width: '130px' }}
                                                    value={order.status}
                                                    onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                                                >
                                                    <option value="pending">قيد الانتظار</option>
                                                    <option value="completed">تم التوصيل</option>
                                                    <option value="cancelled">إلغاء الطلب</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
