<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إضافة قسم جديد - الصيدلية</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@500;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Tajawal', sans-serif; background-color: #f4f6f9; }</style>
</head>
<body class="py-5">
    <div class="container" style="max-width: 550px;">
        <div class="card shadow-sm border-0 rounded-4">
            <div class="card-body p-4">
                <div class="d-flex align-items-center justify-content-between mb-4">
                    <h4 class="fw-bold mb-0 text-primary">
                        <i class="bi bi-folder-plus me-2"></i>إضافة قسم صيدلي جديد
                    </h4>
                    <a href="{{ route('categories.index') }}" class="btn btn-sm btn-outline-secondary rounded-pill">
                        &rarr; رجوع
                    </a>
                </div>

                <form action="{{ route('categories.store') }}" method="POST">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label fw-bold text-muted small">اسم القسم:</label>
                        <input type="text" name="name" class="form-control form-control-lg" placeholder="مثال: أدوية، فيتامينات، مستحضرات تجميل..." required>
                    </div>
                    <div class="d-grid gap-2 mt-4">
                        <button type="submit" class="btn btn-success btn-lg rounded-pill fw-bold">
                            <i class="bi bi-check-circle me-1"></i> حفظ القسم
                        </button>
                        <a href="/" class="btn btn-link text-decoration-none text-muted text-center small">
                            أو الذهاب إلى تطبيق React التفاعلي &larr;
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
