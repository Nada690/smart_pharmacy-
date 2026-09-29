<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('medicines', function (Blueprint $table) {
            $table->string('active_ingredient')->nullable()->after('name'); // المادة الفعالة
            $table->date('expiry_date')->nullable()->after('stock_quantity'); // تاريخ الصلاحية
        });
    }

    public function down(): void
    {
        Schema::table('medicines', function (Blueprint $table) {
            $table->dropColumn(['active_ingredient', 'expiry_date']);
        });
    }
};
