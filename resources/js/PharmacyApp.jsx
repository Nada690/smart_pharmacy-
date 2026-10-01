import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import MedicinesList from './components/MedicinesList';
import CategoriesList from './components/CategoriesList';
import CartView from './components/CartView';
import OrdersList from './components/OrdersList';
import PrescriptionsView from './components/PrescriptionsView';
import ActivityLogs from './components/ActivityLogs';
import LoginModal from './components/LoginModal';
import MedicineModal from './components/MedicineModal';
import CategoryModal from './components/CategoryModal';
import AlternativesModal from './components/AlternativesModal';
import InvoiceModal from './components/InvoiceModal';

export default function PharmacyApp() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [medicines, setMedicines] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    // حالة المصادقة (موقفة مؤقتاً للتجربة)
    const [user, setUser] = useState({ name: 'Admin', email: 'admin@pharmacy.com', role: 'admin' });
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    // إعدادات اللغة والوضع الداكن
    const [darkMode, setDarkMode] = useState(() => {
        try {
            return localStorage.getItem('pharmacy_dark_mode') === 'true';
        } catch {
            return false;
        }
    });

    const [lang, setLang] = useState(() => {
        try {
            return localStorage.getItem('pharmacy_lang') || 'ar';
        } catch {
            return 'ar';
        }
    });

    useEffect(() => {
        localStorage.setItem('pharmacy_dark_mode', darkMode);
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('pharmacy_lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
    }, [lang]);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem('pharmacy_user', JSON.stringify(userData));
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (err) {
            console.error('Logout error:', err);
        }
        setUser(null);
        localStorage.removeItem('pharmacy_user');
    };

    // سلة المشتريات (مع الحفظ في LocalStorage)
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('pharmacy_cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('pharmacy_cart', JSON.stringify(cart));
    }, [cart]);

    // حالات النوافذ المنبثقة
    const [alert, setAlert] = useState(null);
    const [medicineModalOpen, setMedicineModalOpen] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState(null);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

    // البدائل الدوائية
    const [alternativesModalOpen, setAlternativesModalOpen] = useState(false);
    const [originalMedicineForAlt, setOriginalMedicineForAlt] = useState(null);
    const [alternativesList, setAlternativesList] = useState([]);

    const showAlert = (message, type = 'success') => {
        setAlert({ message, type });
        setTimeout(() => {
            setAlert(null);
        }, 4500);
    };

    const loadAllData = useCallback(async () => {
        try {
            const [statsRes, medsRes, catsRes, ordersRes, presRes] = await Promise.all([
                axios.get('/api/stats'),
                axios.get('/api/medicines'),
                axios.get('/api/categories'),
                axios.get('/api/orders'),
                axios.get('/api/prescriptions'),
            ]);
            setStats(statsRes.data);
            setMedicines(medsRes.data);
            setCategories(catsRes.data);
            setOrders(ordersRes.data);
            setPrescriptions(presRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
            showAlert('حدث خطأ أثناء تحميل بيانات الصيدلية', 'danger');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    // ==========================================
    // إدارة الأدوية والمخزون
    // ==========================================
    const handleSaveMedicine = async (formData, id) => {
        if (id) {
            await axios.put(`/api/medicines/${id}`, formData);
            showAlert('تم تعديل بيانات الدواء بنجاح!');
        } else {
            await axios.post('/api/medicines', formData);
            showAlert('تمت إضافة الدواء الجديد إلى الصيدلية بنجاح!');
        }
        await loadAllData();
    };

    const handleAdjustStock = async (id, newQuantity) => {
        try {
            const res = await axios.put(`/api/medicines/${id}/stock`, { quantity: newQuantity });
            // تحديث فوري في الحالة المحلية
            setMedicines(prev => prev.map(m => m.id === id ? { ...m, stock_quantity: newQuantity } : m));
            
            // تحديث الإحصائيات في الخلفية
            const statsRes = await axios.get('/api/stats');
            setStats(statsRes.data);
            showAlert(`تم تحديث مخزون الدواء بنجاح (${newQuantity} علب)`);
        } catch (err) {
            console.error(err);
            showAlert('فشل تحديث المخزون', 'danger');
        }
    };

    const handleDeleteMedicine = async (id, name) => {
        if (!window.confirm(`هل أنت متأكد من حذف الدواء "${name}"؟`)) return;

        try {
            await axios.delete(`/api/medicines/${id}`);
            showAlert(`تم حذف الدواء "${name}" بنجاح.`);
            await loadAllData();
        } catch (err) {
            console.error(err);
            showAlert('حدث خطأ أثناء حذف الدواء', 'danger');
        }
    };

    const handleEditMedicine = (med) => {
        setEditingMedicine(med);
        setMedicineModalOpen(true);
    };

    // جلب وفتح البدائل الدوائية
    const handleOpenAlternatives = async (medicine) => {
        setOriginalMedicineForAlt(medicine);
        try {
            const res = await axios.get(`/api/medicines/${medicine.id}/alternatives`);
            setAlternativesList(res.data.alternatives || []);
            setAlternativesModalOpen(true);
        } catch (err) {
            console.error(err);
            showAlert('فشل جلب البدائل الدوائية', 'danger');
        }
    };

    // ==========================================
    // إدارة الأقسام
    // ==========================================
    const handleAddCategory = async (name) => {
        await axios.post('/api/categories', { name });
        showAlert(`تمت إضافة القسم "${name}" بنجاح!`);
        await loadAllData();
    };

    const handleDeleteCategory = async (id, name, count) => {
        const warning = count > 0 
            ? `تنبيه: هذا القسم يحتوي على ${count} دواء. سيؤدي حذفه إلى حذف كافة الأدوية المرتبطة به. هل تريد المتابعة؟`
            : `هل أنت متأكد من حذف القسم "${name}"؟`;

        if (!window.confirm(warning)) return;

        try {
            await axios.delete(`/api/categories/${id}`);
            showAlert(`تم حذف القسم "${name}" بنجاح.`);
            await loadAllData();
        } catch (err) {
            console.error(err);
            showAlert('حدث خطأ أثناء حذف القسم', 'danger');
        }
    };

    // ==========================================
    // عربة التسوق والطلبات
    // ==========================================
    const handleAddToCart = (medicine) => {
        if (medicine.stock_quantity <= 0) {
            showAlert(`عفواً، الدواء "${medicine.name}" غير متوفر في المخزن حالياً.`, 'danger');
            return;
        }

        setCart(prev => {
            const existing = prev.find(item => item.id === medicine.id);
            if (existing) {
                if (existing.quantity >= medicine.stock_quantity) {
                    showAlert(`تم الوصول لأقصى كمية متاحة في المخزن (${medicine.stock_quantity} علب)`, 'warning');
                    return prev;
                }
                showAlert(`تمت زيادة كمية "${medicine.name}" في السلة`);
                return prev.map(item => item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            showAlert(`تمت إضافة "${medicine.name}" إلى عربة التسوق`);
            return [...prev, { ...medicine, quantity: 1 }];
        });
    };

    const handleUpdateQuantity = (medicineId, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveFromCart(medicineId);
            return;
        }
        setCart(prev => prev.map(item => item.id === medicineId ? { ...item, quantity: newQuantity } : item));
    };

    const handleRemoveFromCart = (medicineId) => {
        setCart(prev => prev.filter(item => item.id !== medicineId));
        showAlert('تم حذف الصنف من السلة');
    };

    const handleClearCart = () => {
        setCart([]);
    };

    const handleSubmitOrder = async (orderPayload) => {
        try {
            const res = await axios.post('/api/orders', orderPayload);
            showAlert('تم إنشاء طلب الشراء بنجاح!');
            await loadAllData();
            return res.data.order;
        } catch (err) {
            const msg = err.response?.data?.message || 'حدث خطأ أثناء إتمام الطلب';
            showAlert(msg, 'danger');
            throw err;
        }
    };

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            await axios.put(`/api/orders/${orderId}/status`, { status });
            showAlert('تم تحديث حالة الطلب بنجاح!');
            await loadAllData();
        } catch (err) {
            console.error(err);
            showAlert('فشل تحديث حالة الطلب', 'danger');
        }
    };

    const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* الشريط العلوي */}
            <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                stats={stats}
                cartCount={totalCartCount}
                onOpenMedicineModal={() => { setEditingMedicine(null); setMedicineModalOpen(true); }}
                onOpenCategoryModal={() => setCategoryModalOpen(true)}
                darkMode={darkMode}
                onToggleDark={() => setDarkMode(!darkMode)}
                lang={lang}
                onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                user={user}
                onOpenLogin={() => setLoginModalOpen(true)}
                onLogout={handleLogout}
            />

            {/* رسائل التنبيهات المنبثقة */}
            {alert && (
                <div className="container mb-3">
                    <div className={`alert alert-${alert.type} alert-dismissible fade show shadow-sm border-0 d-flex align-items-center gap-2`} role="alert">
                        <i className={`bi ${alert.type === 'success' ? 'bi-check-circle-fill' : alert.type === 'warning' ? 'bi-exclamation-triangle-fill' : 'bi-x-circle-fill'} fs-5`}></i>
                        <div>{alert.message}</div>
                        <button type="button" className="btn-close ms-auto" onClick={() => setAlert(null)}></button>
                    </div>
                </div>
            )}

            {/* المحتوى الرئيسي */}
            <main className="flex-grow-1">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">جاري التحميل...</span>
                        </div>
                        <p className="mt-3 text-muted fw-bold">جاري تحميل نظام الصيدلية الذكية المتكامل...</p>
                    </div>
                ) : (
                    <>
                        {activeTab === 'dashboard' && (
                            <Dashboard 
                                stats={stats}
                                medicines={medicines}
                                setActiveTab={setActiveTab}
                                onOpenMedicineModal={() => { setEditingMedicine(null); setMedicineModalOpen(true); }}
                                onOpenCategoryModal={() => setCategoryModalOpen(true)}
                                onAdjustStock={handleAdjustStock}
                                onOpenAlternatives={handleOpenAlternatives}
                            />
                        )}

                        {activeTab === 'medicines' && (
                            <MedicinesList 
                                medicines={medicines}
                                categories={categories}
                                onOpenMedicineModal={() => { setEditingMedicine(null); setMedicineModalOpen(true); }}
                                onEditMedicine={handleEditMedicine}
                                onDeleteMedicine={handleDeleteMedicine}
                                onAdjustStock={handleAdjustStock}
                                onAddToCart={handleAddToCart}
                                onOpenAlternatives={handleOpenAlternatives}
                            />
                        )}

                        {activeTab === 'categories' && (
                            <CategoriesList 
                                categories={categories}
                                medicines={medicines}
                                onAddCategory={handleAddCategory}
                                onDeleteCategory={handleDeleteCategory}
                            />
                        )}

                        {activeTab === 'cart' && (
                            <CartView 
                                cart={cart}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemoveFromCart={handleRemoveFromCart}
                                onClearCart={handleClearCart}
                                onSubmitOrder={handleSubmitOrder}
                                onOpenInvoice={(order) => setSelectedInvoiceOrder(order)}
                            />
                        )}

                        {activeTab === 'orders' && (
                            <OrdersList 
                                orders={orders}
                                onUpdateStatus={handleUpdateOrderStatus}
                                onOpenInvoice={(order) => setSelectedInvoiceOrder(order)}
                            />
                        )}

                        {activeTab === 'prescriptions' && (
                            <PrescriptionsView
                                prescriptions={prescriptions}
                                onRefresh={loadAllData}
                                showAlert={showAlert}
                            />
                        )}

                        {activeTab === 'logs' && (
                            <ActivityLogs />
                        )}
                    </>
                )}
            </main>

            {/* مودال الدواء */}
            <MedicineModal 
                isOpen={medicineModalOpen}
                onClose={() => { setMedicineModalOpen(false); setEditingMedicine(null); }}
                onSave={handleSaveMedicine}
                editingMedicine={editingMedicine}
                categories={categories}
            />

            {/* مودال القسم */}
            <CategoryModal 
                isOpen={categoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                onAddCategory={handleAddCategory}
            />

            {/* مودال البدائل الدوائية */}
            <AlternativesModal 
                isOpen={alternativesModalOpen}
                onClose={() => { setAlternativesModalOpen(false); setOriginalMedicineForAlt(null); }}
                originalMedicine={originalMedicineForAlt}
                alternatives={alternativesList}
                onAddToCart={handleAddToCart}
            />

            {/* مودال طباعة الفاتورة */}
            <InvoiceModal
                isOpen={Boolean(selectedInvoiceOrder)}
                onClose={() => setSelectedInvoiceOrder(null)}
                order={selectedInvoiceOrder}
            />

            {/* مودال تسجيل الدخول */}
            <LoginModal
                isOpen={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />

            {/* التذييل (Footer) */}
            <footer className="bg-white border-top py-4 mt-auto d-print-none">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
                            <span className="fw-bold text-primary">صيدليتي الذكية (Smart Pharmacy)</span> &copy; 2026
                        </div>

                    </div>
                </div>
            </footer>
        </div>
    );
}
