<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PharmacyApiController;
use App\Http\Controllers\AuthController;

// المصادقة
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth');

// الإحصائيات
Route::get('/stats', [PharmacyApiController::class, 'stats']);

// الأقسام
Route::get('/categories', [PharmacyApiController::class, 'getCategories']);
Route::post('/categories', [PharmacyApiController::class, 'storeCategory']);
Route::delete('/categories/{id}', [PharmacyApiController::class, 'deleteCategory']);

// الأدوية
Route::get('/medicines', [PharmacyApiController::class, 'getMedicines']);
Route::post('/medicines', [PharmacyApiController::class, 'storeMedicine']);
Route::put('/medicines/{id}', [PharmacyApiController::class, 'updateMedicine']);
Route::delete('/medicines/{id}', [PharmacyApiController::class, 'deleteMedicine']);
Route::get('/medicines/{id}/alternatives', [PharmacyApiController::class, 'getAlternatives']);
Route::put('/medicines/{id}/stock', [PharmacyApiController::class, 'adjustStock']);

// تصدير التقارير (Excel / CSV)
Route::get('/export/medicines', [PharmacyApiController::class, 'exportMedicines']);

// سلة الشراء والطلبات
Route::get('/orders', [PharmacyApiController::class, 'getOrders']);
Route::post('/orders', [PharmacyApiController::class, 'storeOrder']);
Route::put('/orders/{id}/status', [PharmacyApiController::class, 'updateOrderStatus']);

// الروشتات الطبية
Route::get('/prescriptions', [PharmacyApiController::class, 'getPrescriptions']);
Route::post('/prescriptions', [PharmacyApiController::class, 'storePrescription']);
Route::put('/prescriptions/{id}/status', [PharmacyApiController::class, 'updatePrescriptionStatus']);

// سجل الأنشطة
Route::get('/activity-logs', [PharmacyApiController::class, 'getActivityLogs']);

// الرسوم البيانية والمبيعات الشهرية
Route::get('/charts/monthly-sales', [PharmacyApiController::class, 'getMonthlySales']);
