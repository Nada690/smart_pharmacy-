import React from 'react';

export default function InvoiceModal({ isOpen, onClose, order }) {
    if (!isOpen || !order) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1065 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="modal-header bg-dark text-white d-print-none">
                        <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                            <i className="bi bi-printer-fill"></i>
                            فاتورة الشراء - {order.order_number}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    <div className="modal-body p-4 p-md-5 print-container" id="printableInvoice">
                        {/* رأس الفاتورة */}
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
                            <div>
                                <h3 className="fw-bold text-primary mb-1">
                                    <i className="bi bi-capsule me-2"></i>صيدليتي الذكية
                                </h3>
                                <p className="text-muted small mb-0">نظام إدارة وصرف الأدوية الإلكتروني</p>
                                <p className="text-muted small mb-0">هاتف: 01000000000 | العنوان: جمهورية مصر العربية</p>
                            </div>
                            <div className="text-end">
                                <span className="badge bg-primary fs-6 p-2 px-3 mb-1">فاتورة مبيعات</span>
                                <div className="fw-bold fs-5 text-dark">{order.order_number}</div>
                                <small className="text-muted">
                                    التاريخ: {new Date(order.created_at || Date.now()).toLocaleDateString('ar-EG')}
                                </small>
                            </div>
                        </div>

                        {/* بيانات العميل */}
                        <div className="bg-light p-3 rounded-3 mb-4">
                            <div className="row g-2">
                                <div className="col-sm-6">
                                    <div className="small text-muted">اسم العميل:</div>
                                    <div className="fw-bold text-dark">{order.customer_name}</div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="small text-muted">رقم الهاتف:</div>
                                    <div className="fw-bold text-dark">{order.customer_phone}</div>
                                </div>
                                {order.customer_address && (
                                    <div className="col-12 mt-2">
                                        <div className="small text-muted">عنوان التوصيل:</div>
                                        <div className="text-dark">{order.customer_address}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* جدول بنود الفاتورة */}
                        <div className="table-responsive mb-4">
                            <table className="table table-bordered align-middle">
                                <thead className="table-light">
                                    <tr className="text-center">
                                        <th>#</th>
                                        <th className="text-start">الصنف / الدواء</th>
                                        <th>الكمية</th>
                                        <th>سعر الوحدة</th>
                                        <th>الإجمالي</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(order.items || []).map((item, idx) => (
                                        <tr key={item.id || idx} className="text-center">
                                            <td>{idx + 1}</td>
                                            <td className="text-start fw-bold">{item.medicine_name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{parseFloat(item.unit_price).toFixed(2)} ج.م</td>
                                            <td className="fw-bold text-primary">
                                                {parseFloat(item.total_price).toFixed(2)} ج.م
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="4" className="text-end fw-bold fs-5 py-3">المجموع الكلي المطلوب:</td>
                                        <td className="text-center fw-bold fs-5 text-success py-3">
                                            {parseFloat(order.total_price).toFixed(2)} ج.م
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* التذييل والملاحظات */}
                        <div className="border-top pt-3 text-center text-muted small">
                            <p className="mb-1">نتمنى لكم دوام الصحة والعافية! 🩺</p>
                            <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                                الأدوية المستوردة أو المحفوظة في الثلاجة لا ترد ولا تستبدل حفاظاً على سلامة المرضى.
                            </p>
                        </div>
                    </div>

                    <div className="modal-footer bg-light border-0 d-print-none">
                        <button type="button" className="btn btn-secondary btn-pill px-4" onClick={onClose}>
                            إغلاق
                        </button>
                        <button type="button" className="btn btn-primary btn-pill px-4 fw-bold" onClick={handlePrint}>
                            <i className="bi bi-printer me-1"></i> طباعة الفاتورة
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
