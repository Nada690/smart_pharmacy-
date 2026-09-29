import React, { useState } from 'react';

export default function CartView({ 
    cart, 
    onUpdateQuantity, 
    onRemoveFromCart, 
    onClearCart, 
    onSubmitOrder, 
    onOpenInvoice 
}) {
    const [customer, setCustomer] = useState({
        name: '',
        phone: '',
        address: '',
        notes: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);

    const hasPrescriptionMedicine = cart.some(item => item.requires_prescription);

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        setSubmitting(true);
        try {
            const order = await onSubmitOrder({
                customer_name: customer.name,
                customer_phone: customer.phone,
                customer_address: customer.address,
                notes: customer.notes,
                items: cart.map(item => ({
                    medicine_id: item.id,
                    quantity: item.quantity,
                })),
            });
            setLastOrder(order);
            onClearCart();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (lastOrder) {
        return (
            <div className="container py-5">
                <div className="card shadow-sm border-0 rounded-4 text-center p-5 mx-auto" style={{ maxWidth: '650px' }}>
                    <div className="mb-3">
                        <div className="stat-icon bg-success text-white mx-auto shadow-sm" style={{ width: '70px', height: '70px', fontSize: '2rem' }}>
                            <i className="bi bi-check-lg"></i>
                        </div>
                    </div>
                    <h3 className="fw-bold text-success mb-2">تم إنشاء طلب الشراء بنجاح!</h3>
                    <p className="text-muted">
                        رقم الطلب الخاص بك هو: <span className="fw-bold text-dark fs-5">{lastOrder.order_number}</span>
                    </p>

                    <div className="bg-light p-4 rounded-3 text-start mb-4">
                        <div className="row g-2">
                            <div className="col-6"><span className="text-muted">العميل:</span> <strong>{lastOrder.customer_name}</strong></div>
                            <div className="col-6"><span className="text-muted">الهاتف:</span> <strong>{lastOrder.customer_phone}</strong></div>
                            <div className="col-12 mt-2"><span className="text-muted">إجمالي الفاتورة:</span> <strong className="text-success fs-5">{parseFloat(lastOrder.total_price).toFixed(2)} ج.م</strong></div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center gap-3">
                        <button 
                            className="btn btn-primary btn-pill px-4 fw-bold"
                            onClick={() => onOpenInvoice(lastOrder)}
                        >
                            <i className="bi bi-printer me-2"></i> طباعة الفاتورة الآن
                        </button>
                        <button 
                            className="btn btn-outline-secondary btn-pill px-4"
                            onClick={() => setLastOrder(null)}
                        >
                            متابعة التسوق
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="container py-5 text-center">
                <div className="card p-5 border-0 shadow-sm rounded-4 mx-auto" style={{ maxWidth: '600px' }}>
                    <div className="py-4">
                        <i className="bi bi-cart-x text-muted" style={{ fontSize: '4rem' }}></i>
                        <h4 className="fw-bold mt-3 mb-2">سلة المشتريات فارغة</h4>
                        <p className="text-muted">لم تقم بإضافة أي أدوية إلى السلة بعد. تصفح دليل الأدوية وأضف ما تحتاجه.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container pb-5">
            <h4 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                <i className="bi bi-cart3 text-primary"></i>
                سلة المشتريات وإنهاء الطلب
            </h4>

            {hasPrescriptionMedicine && (
                <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center gap-2 mb-4 p-3 rounded-3">
                    <i className="bi bi-exclamation-triangle-fill fs-4 text-warning"></i>
                    <div>
                        <strong>تنبيه صيدلي:</strong> سلتك تحتوي على أدوية تتطلب روشتة طبية معتمدة عند الاستلام.
                    </div>
                </div>
            )}

            <div className="row g-4">
                {/* قائمة الأصناف بالسلة */}
                <div className="col-12 col-lg-7">
                    <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-3">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>الدواء</th>
                                        <th>السعر</th>
                                        <th style={{ width: '140px' }}>الكمية</th>
                                        <th>الإجمالي</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map(item => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="fw-bold">{item.name}</div>
                                                <small className="text-muted">{item.category?.name}</small>
                                                {item.requires_prescription && (
                                                    <span className="badge badge-soft-danger ms-2" style={{ fontSize: '0.7rem' }}>
                                                        روشتة
                                                    </span>
                                                )}
                                            </td>
                                            <td className="fw-bold text-success">{parseFloat(item.price).toFixed(2)} ج.م</td>
                                            <td>
                                                <div className="input-group input-group-sm" style={{ width: '110px' }}>
                                                    <button 
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="form-control text-center fw-bold bg-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button 
                                                        className="btn btn-outline-secondary"
                                                        disabled={item.quantity >= item.stock_quantity}
                                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="fw-bold text-primary">
                                                {(item.price * item.quantity).toFixed(2)} ج.م
                                            </td>
                                            <td>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger border-0"
                                                    onClick={() => onRemoveFromCart(item.id)}
                                                    title="حذف من السلة"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={onClearCart}>
                            <i className="bi bi-trash me-1"></i> إفراغ السلة
                        </button>
                        <div className="text-end">
                            <span className="text-muted me-2">الإجمالي الكلي:</span>
                            <span className="fs-4 fw-bold text-success">{totalAmount.toFixed(2)} ج.م</span>
                        </div>
                    </div>
                </div>

                {/* فورم إتمام الشراء */}
                <div className="col-12 col-lg-5">
                    <div className="card shadow-sm border-0 rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                            <i className="bi bi-person-check text-primary"></i>
                            بيانات العميل والتوصيل
                        </h5>

                        <form onSubmit={handleCheckout}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">اسم العميل: <span className="text-danger">*</span></label>
                                <input 
                                    type="text"
                                    className="form-control"
                                    placeholder="الاسم ثلاثي"
                                    value={customer.name}
                                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">رقم الهاتف للتواصل: <span className="text-danger">*</span></label>
                                <input 
                                    type="tel"
                                    className="form-control"
                                    placeholder="01XXXXXXXXX"
                                    value={customer.phone}
                                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">عنوان التوصيل:</label>
                                <textarea 
                                    className="form-control"
                                    rows="2"
                                    placeholder="المدينة، الحي، رقم العمارة والشقة..."
                                    value={customer.address}
                                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">ملاحظات إضافية للصيدلي:</label>
                                <input 
                                    type="text"
                                    className="form-control"
                                    placeholder="مثال: يرجى التوصيل بعد الساعة 5"
                                    value={customer.notes}
                                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                                />
                            </div>

                            <div className="border-top pt-3 mb-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">عدد الأصناف:</span>
                                    <span className="fw-bold">{cart.length} أصناف</span>
                                </div>
                                <div className="d-flex justify-content-between fs-5 fw-bold text-primary">
                                    <span>المبلغ المستحق:</span>
                                    <span>{totalAmount.toFixed(2)} ج.م</span>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary btn-lg w-100 btn-pill fw-bold shadow-sm"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        جاري تأكيد الطلب...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-bag-check-fill me-2"></i>
                                        تأكيد الطلب الآن
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
