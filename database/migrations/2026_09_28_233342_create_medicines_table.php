<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade'); // ربط الدواء بالقسم
            $table->string('name'); // اسم الدواء/المنتج
            $table->text('description')->nullable(); // الوصف والجرعة
            $table->decimal('price', 8, 2); // السعر
            $table->integer('stock_quantity')->default(0); // المخزون المتاح
            $table->boolean('requires_prescription')->default(false); // هل يحتاج روشتة؟
            $table->string('image')->nullable(); // صورة المنتج
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};
