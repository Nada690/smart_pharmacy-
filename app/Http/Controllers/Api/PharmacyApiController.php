<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Medicine;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PharmacyApiController extends Controller
{
    // الإحصائيات العامة المتقدمة
    public function stats()
    {
        $totalCategories = Category::count();
        $totalMedicines = Medicine::count();
        $lowStockCount = Medicine::where('stock_quantity', '>', 0)
            ->where('stock_quantity', '<=', 5)
            ->count();
        $outOfStockCount = Medicine::where('stock_quantity', 0)->count();
        $expiringSoonCount = Medicine::whereNotNull('expiry_date')
            ->whereBetween('expiry_date', [now(), now()->addDays(90)])
            ->count();
        $expiredCount = Medicine::whereNotNull('expiry_date')
            ->where('expiry_date', '<', now())
            ->count();
        $prescriptionCount = Medicine::where('requires_prescription', true)->count();
        $totalOrders = Order::count();
        $completedSales = (float) Order::where('status', 'completed')->sum('total_price');
        $pendingPrescriptions = Prescription::where('status', 'pending')->count();
        $totalStockUnits = (int) Medicine::sum('stock_quantity');

        // الأدوية الأكثر مبيعاً
        $topSelling = OrderItem::select('medicine_name', DB::raw('SUM(quantity) as total_sold'), DB::raw('SUM(total_price) as total_revenue'))
            ->groupBy('medicine_name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        return response()->json([
            'total_categories' => $totalCategories,
            'total_medicines' => $totalMedicines,
            'low_stock_count' => $lowStockCount,
            'out_of_stock_count' => $outOfStockCount,
            'expiring_soon_count' => $expiringSoonCount,
            'expired_count' => $expiredCount,
            'prescription_count' => $prescriptionCount,
            'total_orders' => $totalOrders,
            'completed_sales' => $completedSales,
            'pending_prescriptions' => $pendingPrescriptions,
            'total_stock_units' => $totalStockUnits,
            'top_selling' => $topSelling,
        ]);
    }

    // جلب الأدوية مع الفلترة والبحث المتقدم
    public function getMedicines(Request $request)
    {
        $query = Medicine::with('category')->latest();

        // 1. البحث بالمادة الفعالة أو اسم الدواء أو الوصف
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('active_ingredient', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // 2. الفلترة حسب القسم
        if ($request->filled('category_id') && $request->category_id !== 'all') {
            $query->where('category_id', $request->category_id);
        }

        // 3. الفلترة حسب الروشتة
        if ($request->filled('prescription') && $request->prescription !== 'all') {
            $query->where('requires_prescription', filter_var($request->prescription, FILTER_VALIDATE_BOOLEAN));
        }

        // 4. الفلترة حسب حالة المخزون
        if ($request->filled('stock_status') && $request->stock_status !== 'all') {
            if ($request->stock_status === 'out_of_stock') {
                $query->where('stock_quantity', 0);
            } elseif ($request->stock_status === 'low_stock') {
                $query->where('stock_quantity', '>', 0)->where('stock_quantity', '<=', 5);
            } elseif ($request->stock_status === 'in_stock') {
                $query->where('stock_quantity', '>', 5);
            }
        }

        // 5. الفلترة حسب الصلاحية
        if ($request->filled('expiry_status') && $request->expiry_status !== 'all') {
            if ($request->expiry_status === 'expired') {
                $query->whereNotNull('expiry_date')->where('expiry_date', '<', now());
            } elseif ($request->expiry_status === 'expiring_soon') {
                $query->whereNotNull('expiry_date')->whereBetween('expiry_date', [now(), now()->addDays(90)]);
            }
        }

        $medicines = $query->get();
        return response()->json($medicines);
    }

    // جلب البدائل المتاحة للدواء (المتوفرة بالمخزن)
    public function getAlternatives($id)
    {
        $medicine = Medicine::findOrFail($id);

        $query = Medicine::with('category')
            ->where('id', '!=', $medicine->id)
            ->where('stock_quantity', '>', 0); // البدائل المتوفرة فقط

        if (!empty($medicine->active_ingredient)) {
            // البحث عن بدائل بنفس المادة الفعالة
            $ingredients = array_map('trim', explode('+', $medicine->active_ingredient));
            $query->where(function ($q) use ($ingredients, $medicine) {
                foreach ($ingredients as $ing) {
                    $q->orWhere('active_ingredient', 'like', "%{$ing}%");
                }
                $q->orWhere('category_id', $medicine->category_id);
            });
        } else {
            // إن لم توجد مادة فعالة، جلب بدائل من نفس القسم
            $query->where('category_id', $medicine->category_id);
        }

        $alternatives = $query->limit(6)->get();

        return response()->json([
            'medicine' => $medicine,
            'alternatives' => $alternatives,
        ]);
    }

    // تعديل كمية المخزون السريع فوراً
    public function adjustStock(Request $request, $id)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $medicine = Medicine::findOrFail($id);
        $medicine->update(['stock_quantity' => $validated['quantity']]);
        $medicine->load('category');

        return response()->json([
            'message' => 'تم تحديث المخزون بنجاح!',
            'medicine' => $medicine,
        ]);
    }

    // إضافة دواء جديد
    public function storeMedicine(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'active_ingredient' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'expiry_date' => 'nullable|date',
            'requires_prescription' => 'boolean',
            'image' => 'nullable|string',
        ]);

        $medicine = Medicine::create($validated);
        $medicine->load('category');

        return response()->json([
            'message' => 'تم إضافة الدواء بنجاح!',
            'medicine' => $medicine,
        ], 201);
    }

    // تعديل دواء
    public function updateMedicine(Request $request, $id)
    {
        $medicine = Medicine::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'name' => 'sometimes|required|string|max:255',
            'active_ingredient' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'stock_quantity' => 'sometimes|required|integer|min:0',
            'expiry_date' => 'nullable|date',
            'requires_prescription' => 'sometimes|boolean',
            'image' => 'nullable|string',
        ]);

        $medicine->update($validated);
        $medicine->load('category');

        return response()->json([
            'message' => 'تم تحديث بيانات الدواء بنجاح!',
            'medicine' => $medicine,
        ]);
    }

    // حذف دواء
    public function deleteMedicine($id)
    {
        $medicine = Medicine::findOrFail($id);
        $medicine->delete();

        return response()->json([
            'message' => 'تم حذف الدواء بنجاح!',
        ]);
    }

    // الأقسام
    public function getCategories()
    {
        $categories = Category::withCount('medicines')->orderBy('name')->get();
        return response()->json($categories);
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = Category::create($validated);
        $category->loadCount('medicines');

        return response()->json([
            'message' => 'تم إضافة القسم بنجاح!',
            'category' => $category,
        ], 201);
    }

    public function deleteCategory($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json([
            'message' => 'تم حذف القسم بنجاح!',
        ]);
    }

    // ==========================================
    // الطلبات والمبيعات وعربة التسوق (Orders & Cart)
    // ==========================================

    // جلب قائمة الطلبات
    public function getOrders()
    {
        $orders = Order::with('items')->latest()->get();
        return response()->json($orders);
    }

    // إنشاء طلب شراء جديد وتحديث المخزون
    public function storeOrder(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:50',
            'customer_address' => 'nullable|string',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.medicine_id' => 'required|exists:medicines,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($request) {
            $totalOrderPrice = 0;
            $itemsData = [];

            // التحقق من المخزون والأسعار
            foreach ($request->items as $item) {
                $medicine = Medicine::lockForUpdate()->findOrFail($item['medicine_id']);

                if ($medicine->stock_quantity < $item['quantity']) {
                    return response()->json([
                        'message' => "الكمية المطلوبة من الدواء '{$medicine->name}' غير متاحة في المخزن حالياً (المتاح: {$medicine->stock_quantity})",
                    ], 422);
                }

                $itemTotal = $medicine->price * $item['quantity'];
                $totalOrderPrice += $itemTotal;

                // إنقاص المخزون
                $medicine->decrement('stock_quantity', $item['quantity']);

                $itemsData[] = [
                    'medicine_id' => $medicine->id,
                    'medicine_name' => $medicine->name,
                    'quantity' => $item['quantity'],
                    'unit_price' => $medicine->price,
                    'total_price' => $itemTotal,
                ];
            }

            // إنشاء الطلب
            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'customer_address' => $request->customer_address,
                'total_price' => $totalOrderPrice,
                'status' => 'pending',
                'notes' => $request->notes,
            ]);

            foreach ($itemsData as $data) {
                $order->items()->create($data);
            }

            $order->load('items');

            return response()->json([
                'message' => 'تم إنشاء طلب الشراء بنجاح!',
                'order' => $order,
            ], 201);
        });
    }

    // تحديث حالة الطلب
    public function updateOrderStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,completed,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'تم تحديث حالة الطلب بنجاح!',
            'order' => $order->load('items'),
        ]);
    }

    // ==========================================
    // الروشتات الطبية (Prescriptions)
    // ==========================================

    // جلب قائمة الروشتات
    public function getPrescriptions()
    {
        $prescriptions = Prescription::latest()->get();
        return response()->json($prescriptions);
    }

    // رفع روشتة جديدة
    public function storePrescription(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:50',
            'notes' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // حتى 5MB
        ]);

        $imageFile = $request->file('image');
        $fileName = time() . '_' . uniqid() . '.' . $imageFile->getClientOriginalExtension();
        $imageFile->move(public_path('uploads/prescriptions'), $fileName);
        $imagePath = '/uploads/prescriptions/' . $fileName;

        $prescription = Prescription::create([
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'notes' => $request->notes,
            'image' => $imagePath,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'تم رفع الروشتة الطبية بنجاح! سيقوم الصيدلي بمراجعتها والتواصل معك.',
            'prescription' => $prescription,
        ], 201);
    }

    // تحديث حالة الروشتة من قِبل الصيدلي
    public function updatePrescriptionStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,dispensed,rejected',
        ]);

        $prescription = Prescription::findOrFail($id);
        $prescription->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'تم تحديث حالة الروشتة بنجاح!',
            'prescription' => $prescription,
        ]);
    }

    // ==========================================
    // تصدير البيانات (Export Inventory CSV)
    // ==========================================
    public function exportMedicines()
    {
        $medicines = Medicine::with('category')->orderBy('name')->get();

        $filename = 'تقرير_مخزون_الصيدلية_' . date('Y-m-d_H-i') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($medicines) {
            $output = fopen('php://output', 'w');
            // إضافة UTF-8 BOM للتوافق التام مع Excel باللغة العربية
            fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($output, [
                'كود الدواء',
                'اسم الدواء',
                'المادة الفعالة',
                'القسم الصيدلي',
                'السعر (ج.م)',
                'المخزون المتاح',
                'تاريخ الصلاحية',
                'حالة المخزون',
                'حالة الصلاحية',
                'يتطلب روشتة؟'
            ]);

            foreach ($medicines as $med) {
                $stockStatus = $med->stock_quantity == 0 ? 'نفذ' : ($med->stock_quantity <= 5 ? 'مخزون حرج' : 'متوفر');
                $expiryStatus = $med->is_expired ? 'منتهي الصلاحية' : ($med->is_expiring_soon ? 'قريب الانتهاء' : 'ساري');

                fputcsv($output, [
                    $med->id,
                    $med->name,
                    $med->active_ingredient ?? 'غير محدد',
                    $med->category->name ?? 'بدون قسم',
                    $med->price,
                    $med->stock_quantity,
                    $med->expiry_date ? $med->expiry_date->format('Y-m-d') : 'غير مسجل',
                    $stockStatus,
                    $expiryStatus,
                    $med->requires_prescription ? 'نعم' : 'لا',
                ]);
            }

            fclose($output);
        };

        return response()->stream($callback, 200, $headers);
    }
}
