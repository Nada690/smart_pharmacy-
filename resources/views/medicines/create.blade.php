<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إضافة دواء جديد - الصيدلية</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@500;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Tajawal', sans-serif; background-color: #f4f6f9; }</style>
</head>
<body class="py-5">
    <div class="container" style="max-width: 650px;">
        <div class="card shadow-sm border-0 rounded-4">
            <div class="card-body p-4">
                <div class="d-flex align-items-center justify-content-between mb-4">
                    <h4 class="fw-bold mb-0 text-primary">
                        <i class="bi bi-capsule me-2"></i>إضافة دواء جديد للصيدلية
                    </h4>
                    <a href="{{ route('medicines.index') }}" class="btn btn-sm btn-outline-secondary rounded-pill">
                        &rarr; رجوع
                    </a>
                </div>

                <form action="{{ route('medicines.store') }}" method="POST">
                    @csrf

                    <div class="mb-3">
                        <label class="form-label fw-bold text-muted small">القسم الصيدلي: <span class="text-danger">*</span></label>
                        <select name="category_id" class="form-select" required>
                            <option value="">اختر القسم المناسب</option>
                            @foreach($categories as $category)
                                <option value="{{ $category->id }}">{{ $category->name }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold text-muted small">اسم الدواء / المنتج: <span class="text-danger">*</span></label>
                        <input type="text" name="name" class="form-control" placeholder="مثال: بانادول إكسترا" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold text-muted small">الوصف والجرعة ودواعي الاستعمال:</label>
                        <textarea name="description" rows="3" class="form-control" placeholder="مثال: مسكن فعال وخافض للحرارة..."></textarea>
                    </div>

                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label class="form-label fw-bold text-muted small">السعر (بالجنيه): <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <input type="number" step="0.01" min="0" name="price" class="form-control" placeholder="0.00" required>
                                <span class="input-group-text">ج.م</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold text-muted small">الكمية في المخزن: <span class="text-danger">*</span></label>
                            <input type="number" min="0" name="stock_quantity" class="form-control" placeholder="0" required>
                        </div>
                    </div>

                    <div class="form-check form-switch mb-4">
                        <input class="form-check-input ms-0 me-2" type="checkbox" name="requires_prescription" value="1" id="prescriptionCheck" style="cursor: pointer;">
                        <label class="form-check-label fw-bold" for="prescriptionCheck" style="cursor: pointer;">
                            يتطلب هذا الدواء روشتة طبية معتمدة للصرف
                        </label>
                    </div>

                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-primary btn-lg rounded-pill fw-bold">
                            <i class="bi bi-check-circle me-1"></i> حفظ الدواء
                        </button>
                        <a href="/" class="btn btn-link text-decoration-none text-muted text-center small">
                            أو فتح تطبيق React التفاعلي &larr;
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
