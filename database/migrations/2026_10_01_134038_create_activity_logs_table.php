<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->string('user_name')->default('النظام'); // اسم المستخدم
            $table->string('action');                        // نوع الفعل (أضاف، عدّل، حذف)
            $table->string('model_type');                   // (دواء، قسم، طلب)
            $table->string('model_name')->nullable();       // اسم العنصر
            $table->text('description')->nullable();        // وصف تفصيلي
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
