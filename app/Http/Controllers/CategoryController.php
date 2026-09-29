<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // عرض كل الأقسام
    public function index()
    {
        $categories = Category::all();
        return view('categories.index', compact('categories'));
    }

    // صفحة إضافة قسم جديد
    public function create()
    {
        return view('categories.create');
    }

    // حفظ القسم في قاعدة البيانات
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Category::create([
            'name' => $request->name,
        ]);

        return redirect()->route('categories.index')->with('success', 'تم إضافة القسم بنجاح!');
    }
}
