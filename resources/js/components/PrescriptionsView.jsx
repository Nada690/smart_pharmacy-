import React, { useState } from 'react';
import axios from 'axios';

export default function PrescriptionsView({ prescriptions, onRefresh, showAlert }) {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [viewingImage, setViewingImage] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            showAlert('يرجى اختيار صورة الروشتة أولاً', 'danger');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('customer_name', customerName);
        formData.append('customer_phone', customerPhone);
        formData.append('notes', notes);
        formData.append('image', imageFile);

        try {
            await axios.post('/api/prescriptions', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            showAlert('تم رفع صورة الروشتة بنجاح! سيقوم الصيدلي بمراجعتها قريباً.');
            setCustomerName('');
            setCustomerPhone('');
            setNotes('');
            setImageFile(null);
            setImagePreview(null);
            onRefresh();
        } catch (err) {
            console.error(err);
            showAlert('حدث خطأ أثناء رفع الروشتة', 'danger');
        } finally {
            setUploading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`/api/prescriptions/${id}/status`, { status: newStatus });
            showAlert('تم تحديث حالة الروشتة بنجاح!');
            onRefresh();
        } catch (err) {
            console.error(err);
            showAlert('فشل تحديث حالة الروشتة', 'danger');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="badge bg-info-subtle text-info border">تم القبول والتجهيز</span>;
            case 'dispensed':
                return <span className="badge bg-success-subtle text-success border">تم الصرف والتسليم</span>;
            case 'rejected':
                return <span className="badge bg-danger-subtle text-danger border">مرفوضة / غير واضحة</span>;
            default:
                return <span className="badge bg-warning-subtle text-warning-emphasis border">قيد المراجعة</span>;
        }
    };

    return (
        <div className="container pb-5">
            <div className="row g-4">
                {/* قسم رفع الروشتة للعميل */}
                <div className="col-12 col-lg-5">
                    <div className="card shadow-sm border-0 rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                            <i className="bi bi-camera-fill text-primary"></i>
                            رفع روشتة طبية جديدة
                        </h5>
                        <p className="text-muted small">
                            قم بتصوير الروشتة الطبية بوضوح وسيقوم الصيدلي بمراجعتها وتجهيز الأدوية والتواصل معك.
                        </p>

                        <form onSubmit={handleUpload}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">اسم العميل: <span className="text-danger">*</span></label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="الاسم ثلاثي"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    required 
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">رقم الهاتف: <span className="text-danger">*</span></label>
                                <input 
                                    type="tel" 
                                    className="form-control" 
                                    placeholder="01XXXXXXXXX"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    required 
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">صورة الروشتة: <span className="text-danger">*</span></label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required 
                                />
                                {imagePreview && (
                                    <div className="mt-2 text-center p-2 border rounded-3 bg-light">
                                        <img 
                                            src={imagePreview} 
                                            alt="معاينة الروشتة" 
                                            style={{ maxHeight: '140px', maxWidth: '100%', objectFit: 'contain' }} 
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">ملاحظات للمريض أو الصيدلي:</label>
                                <textarea 
                                    className="form-control" 
                                    rows="2" 
                                    placeholder="مثال: يرجى توفير البديل إذا كان الصنف غير متاح..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary btn-lg w-100 btn-pill fw-bold"
                                disabled={uploading || !imageFile}
                            >
                                {uploading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        جاري رفع الروشتة...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-cloud-arrow-up-fill me-2"></i>
                                        إرسال الروشتة للصيدلي
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* قسم لوحة تحكم الصيدلي لمراجعة الروشتات */}
                <div className="col-12 col-lg-7">
                    <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                        <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                                <i className="bi bi-clipboard2-pulse-fill text-primary"></i>
                                لوحة مراجعة الروشتات الطبية
                            </h5>
                            <span className="badge bg-primary rounded-pill px-3 py-2">
                                {prescriptions.length} روشتة
                            </span>
                        </div>

                        <div className="card-body p-4 pt-2">
                            {prescriptions.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-file-earmark-medical fs-1 mb-2 d-block"></i>
                                    لا توجد روشتات مرفوعة حالياً.
                                </div>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {prescriptions.map(p => (
                                        <div key={p.id} className="list-group-item px-0 py-3 border-bottom">
                                            <div className="row align-items-center">
                                                <div className="col-3 col-sm-2 text-center">
                                                    <img 
                                                        src={p.image} 
                                                        alt="روشتة" 
                                                        className="img-thumbnail rounded-3 shadow-sm"
                                                        style={{ width: '70px', height: '70px', objectFit: 'cover', cursor: 'pointer' }}
                                                        onClick={() => setViewingImage(p.image)}
                                                        title="انقر لتكبير صورة الروشتة"
                                                    />
                                                </div>
                                                <div className="col-9 col-sm-6">
                                                    <div className="fw-bold fs-6">{p.customer_name}</div>
                                                    <div className="small text-muted">
                                                        <i className="bi bi-telephone me-1"></i> {p.customer_phone}
                                                    </div>
                                                    {p.notes && (
                                                        <div className="small text-secondary mt-1 bg-light p-1 px-2 rounded">
                                                            "{p.notes}"
                                                        </div>
                                                    )}
                                                    <small className="text-muted d-block mt-1">
                                                        {new Date(p.created_at).toLocaleDateString('ar-EG')}
                                                    </small>
                                                </div>
                                                <div className="col-12 col-sm-4 text-sm-end mt-2 mt-sm-0">
                                                    <div className="mb-2">{getStatusBadge(p.status)}</div>
                                                    <select 
                                                        className="form-select form-select-sm"
                                                        value={p.status}
                                                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                                                    >
                                                        <option value="pending">قيد المراجعة</option>
                                                        <option value="approved">تم القبول والتجهيز</option>
                                                        <option value="dispensed">تم الصرف</option>
                                                        <option value="rejected">مرفوضة</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* مودال تكبير صورة الروشتة لمراجعة خط الطبيب بدقة */}
            {viewingImage && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1070 }}>
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                        <div className="modal-content bg-transparent border-0 text-center">
                            <div className="text-end mb-2">
                                <button className="btn btn-light rounded-circle" onClick={() => setViewingImage(null)}>
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <img 
                                src={viewingImage} 
                                alt="تكبير الروشتة" 
                                className="img-fluid rounded-4 shadow-lg mx-auto" 
                                style={{ maxHeight: '85vh', objectFit: 'contain' }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
