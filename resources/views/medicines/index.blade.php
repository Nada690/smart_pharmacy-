<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>قائمة الأدوية - الصيدلية</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@500;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Tajawal', sans-serif; background-color: #f4f6f9; }</style>
</head>
<body class="py-4">
    <div class="container">
        <!-- شريط التبديل إلى تطبيق React -->
        <div class="alert alert-info d-flex justify-content-between align-items-center mb-4 p-3 bg-white border shadow-sm rounded-3">
            <div>
                <strong class="text-primary">✨ متاح الآن:</strong> تطبيق الصيدلية التفاعلي بالكامل بـ React.js مع بحث لحظي وإحصائيات مباشرة
            </div>
            <a href="/" class="btn btn-sm btn-primary">فتح تطبيق React &larr;</a>
        </div>

        <div class="card shadow-sm border-0 rounded-4">
            <div class="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                <h3 class="fw-bold mb-0 text-primary"><i class="bi bi-capsule me-2"></i>قائمة الأدوية المتاحة</h3>
                <a href="{{ route('medicines.create') }}" class="btn btn-primary btn-sm rounded-pill px-3">
                    <i class="bi bi-plus-lg me-1"></i> إضافة دواء جديد
                </a>
            </div>
            <div class="card-body p-4">
                @if(session('success'))
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        {{ session('success') }}
                    </div>
                @endif

                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>اسم الدواء</th>
                                <th>القسم</th>
                                <th>السعر</th>
                                <th>المخزون المتاح</th>
                                <th>روشتة؟</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($medicines as $medicine)
                                <tr>
                                    <td class="fw-bold">{{ $medicine->name }}</td>
                                    <td>
                                        <span class="badge bg-primary-subtle text-primary border">
                                            {{ $medicine->category->name ?? '—' }}
                                        </span>
                                    </td>
                                    <td class="fw-bold text-success">{{ number_format($medicine->price, 2) }} ج.م</td>
                                    <td>
                                        <span class="badge {{ $medicine->stock_quantity <= 10 ? 'bg-danger' : 'bg-light text-dark border' }}">
                                            {{ $medicine->stock_quantity }} علب
                                        </span>
                                    </td>
                                    <td>
                                        @if($medicine->requires_prescription)
                                            <span class="badge bg-danger-subtle text-danger border">نعم (روشتة)</span>
                                        @else
                                            <span class="badge bg-success-subtle text-success border">لا (OTC)</span>
                                        @endif
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="5" class="text-center py-5 text-muted">
                                        <i class="bi bi-inbox fs-1 mb-2 d-block"></i>
                                        لا توجد أدوية مضافة بعد.
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
