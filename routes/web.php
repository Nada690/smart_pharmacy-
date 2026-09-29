<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('pharmacy');
});

Route::get('/pharmacy', function () {
    return view('pharmacy');
});

use App\Http\Controllers\TestController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MedicineController;

Route::get('/welcome', [TestController::class, 'showMessage']);

// المسارات العامة (Public)
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/medicines', [MedicineController::class, 'index'])->name('medicines.index');

// المسارات المحمية (Admin Only)
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');

    Route::get('/medicines/create', [MedicineController::class, 'create'])->name('medicines.create');
    Route::post('/medicines', [MedicineController::class, 'store'])->name('medicines.store');
});
