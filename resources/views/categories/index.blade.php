<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>قائمة الأقسام - الصيدلية</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@500;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Tajawal', sans-serif; background-color: #f4f6f9; }</style>
</head>
<body class="py-4">
    <div class="container" style="max-width: 800px;">
        <!-- شريط التبديل إلى تطبيق React -->
        <div className="alert alert-info d-flex justify-content-between align-items-center mb-4 p-3 bg-white border shadow-sm rounded-3">
            <div>
                <strong class="text-primary">✨ متاح الآن:</strong> تطبيق الصيدلية التفاعلي بالكامل بـ React.js
            </div>
            <a href="/" class="btn btn-sm btn-primary">فتح تطبيق React &larr;</a>
        </div>

        <div class="card shadow-sm border-0 rounded-4">
            <div class="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                <h3 class="fw-bold mb-0 text-primary"><i class="bi bi-grid-fill me-2"></i>أقسام الصيدلية</h3>
                <a href="{{ route('categories.create') }}" class="btn btn-success btn-sm rounded-pill px-3">
                    <i class="bi bi-plus-lg me-1"></i> إضافة قسم جديد
                </a>
            </div>
            <div class="card-body p-4">
                @if(session('success'))
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        {{ session('success') }}
                    </div>
                @endif

                <div class="list-group list-group-flush border-top">
                    @forelse($categories as $category)
                        <div class="list-group-item d-flex justify-content-between align-items-center py-3">
                            <span class="fw-bold fs-6"><i class="bi bi-folder2 text-secondary me-2"></i>{{ $category->name }}</span>
                            <span class="badge bg-secondary-subtle text-dark border rounded-pill px-3 py-2">
                                {{ $category->medicines->count() ?? 0 }} دواء
                            </span>
                        </div>
                    @empty
                        <div class="text-center py-5 text-muted">
                            <i class="bi bi-inbox fs-1 mb-2 d-block"></i>
                            لا توجد أقسام مضافة بعد.
                        </div>
                    @endforelse
                </div>
            </div>
        </div>
    </div>
</body>
</html>
