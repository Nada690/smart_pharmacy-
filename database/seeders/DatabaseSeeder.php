<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Medicine;
use App\Models\Order;
use App\Models\OrderItem;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $cat1 = Category::firstOrCreate(['name' => 'أدوية ومسكنات']);
        $cat2 = Category::firstOrCreate(['name' => 'فيتامينات ومكملات']);
        $cat3 = Category::firstOrCreate(['name' => 'مستحضرات عناية']);
        $cat4 = Category::firstOrCreate(['name' => 'مضادات حيوية']);

        // دواء 1
        Medicine::updateOrCreate(['name' => 'بانادول إكسترا'], [
            'category_id' => $cat1->id,
            'active_ingredient' => 'باراسيتامول + كافيين',
            'description' => 'مسكن فعال للصداع الشديد وخافض للحرارة مع كافيين لتعزيز التأثير',
            'price' => 35.00,
            'stock_quantity' => 45,
            'expiry_date' => now()->addMonths(18)->format('Y-m-d'),
            'requires_prescription' => false,
        ]);

        // دواء 2 (مخزون حرج + اقترب انتهاء الصلاحية)
        Medicine::updateOrCreate(['name' => 'أوجمنتين 1 جم'], [
            'category_id' => $cat4->id,
            'active_ingredient' => 'أموكسيسيلين + كلافولانيك أسيد',
            'description' => 'مضاد حيوي واسع المجال لعلاج التهابات الجهاز التنفسي',
            'price' => 110.00,
            'stock_quantity' => 4, // أقل من 5
            'expiry_date' => now()->addDays(45)->format('Y-m-d'), // ينتهي خلال 45 يوم
            'requires_prescription' => true,
        ]);

        // دواء 3 (بديل نفد من المخزون لتجربة زر البدائل)
        Medicine::updateOrCreate(['name' => 'أدول 500 ملجم'], [
            'category_id' => $cat1->id,
            'active_ingredient' => 'باراسيتامول',
            'description' => 'أقراص باراسيتامول مسكنة للألم والصداع وخافضة للحرارة',
            'price' => 18.00,
            'stock_quantity' => 0, // نفد لتجربة البدائل
            'expiry_date' => now()->addMonths(12)->format('Y-m-d'),
            'requires_prescription' => false,
        ]);

        // دواء 4 (بديل متاح)
        Medicine::updateOrCreate(['name' => 'سيتال 500 ملجم'], [
            'category_id' => $cat1->id,
            'active_ingredient' => 'باراسيتامول',
            'description' => 'مسكن للألم وخافض للحرارة مناسب للكبار',
            'price' => 15.00,
            'stock_quantity' => 30,
            'expiry_date' => now()->addMonths(20)->format('Y-m-d'),
            'requires_prescription' => false,
        ]);

        // دواء 5 (مخزون حرج)
        Medicine::updateOrCreate(['name' => 'كونجستال'], [
            'category_id' => $cat1->id,
            'active_ingredient' => 'باراسيتامول + كلورفينيرامين + سودوإيفيدرين',
            'description' => 'علاج أعراض نزلات البرد والإنفلونزا والرشح واحتقان الجيوب الأنفية',
            'price' => 27.00,
            'stock_quantity' => 3, // أقل من 5
            'expiry_date' => now()->addMonths(14)->format('Y-m-d'),
            'requires_prescription' => false,
        ]);

        // دواء 6 (فيتامينات)
        Medicine::updateOrCreate(['name' => 'فيتامين C + زنك'], [
            'category_id' => $cat2->id,
            'active_ingredient' => 'حمض الأسكوربيك + زنك',
            'description' => 'أقراص فوارة لتقوية المناعة ومقاومة نزلات البرد',
            'price' => 55.50,
            'stock_quantity' => 22,
            'expiry_date' => now()->addMonths(24)->format('Y-m-d'),
            'requires_prescription' => false,
        ]);

        // إنشاء طلب تجريبي للمبيعات
        if (Order::count() === 0) {
            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'customer_name' => 'أحمد محمود',
                'customer_phone' => '01012345678',
                'customer_address' => 'القاهرة - المعادي - شارع 9',
                'total_price' => 90.50,
                'status' => 'completed',
                'notes' => 'توصيل سريع للمنزل',
            ]);

            $panadol = Medicine::where('name', 'بانادول إكسترا')->first();
            $c_zinc = Medicine::where('name', 'فيتامين C + زنك')->first();

            OrderItem::create([
                'order_id' => $order->id,
                'medicine_id' => $panadol ? $panadol->id : null,
                'medicine_name' => 'بانادول إكسترا',
                'quantity' => 1,
                'unit_price' => 35.00,
                'total_price' => 35.00,
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'medicine_id' => $c_zinc ? $c_zinc->id : null,
                'medicine_name' => 'فيتامين C + زنك',
                'quantity' => 1,
                'unit_price' => 55.50,
                'total_price' => 55.50,
            ]);
        }
    }
}
