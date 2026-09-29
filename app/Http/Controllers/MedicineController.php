<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\Category;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    // عرض قائمة الأدوية
    public function index()
    {
        $medicines = Medicine::with('category')->get();
        return view('medicines.index', compact('medicines'));
    }

    // صفحة إضافة دواء جديد
    public function create()
    {
        $categories = Category::all();
        return view('medicines.create', compact('categories'));
    }

    // حفظ الدواء في قاعدة البيانات
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
        ]);

        Medicine::create([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock_quantity' => $request->stock_quantity,
            'requires_prescription' => $request->has('requires_prescription'),
        ]);

        return redirect()->route('medicines.index')->with('success', 'تم إضافة الدواء بنجاح!');
    }
}
