<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Medicine;

class PharmacyDemoSeeder extends Seeder
{
    public function run(): void
    {
        $cat1 = Category::firstOrCreate(['name' => 'أدوية ومسكنات']);
        $cat2 = Category::firstOrCreate(['name' => 'فيتامينات ومكملات']);
        $cat3 = Category::firstOrCreate(['name' => 'مستحضرات عناية']);

        Medicine::firstOrCreate(['name' => 'بانادول إكسترا'], [
            'category_id' => $cat1->id,
            'description' => 'مسكن فعال للصداع وخافض للحرارة مع كافيين',
            'price' => 35.00,
            'stock_quantity' => 45,
            'requires_prescription' => false,
        ]);

        Medicine::firstOrCreate(['name' => 'أوجمنتين 1 جم'], [
            'category_id' => $cat1->id,
            'description' => 'مضاد حيوي واسع المجال لعلاج الالتهابات البكتيرية',
            'price' => 110.00,
            'stock_quantity' => 8,
            'requires_prescription' => true,
        ]);

        Medicine::firstOrCreate(['name' => 'فيتامين C + زنك'], [
            'category_id' => $cat2->id,
            'description' => 'أقراص فوارة لتقوية المناعة ومقاومة نزلات البرد',
            'price' => 55.50,
            'stock_quantity' => 20,
            'requires_prescription' => false,
        ]);

        Medicine::firstOrCreate(['name' => 'كونجستال'], [
            'category_id' => $cat1->id,
            'description' => 'علاج أعراض نزلات البرد والإنفلونزا والرشح',
            'price' => 27.00,
            'stock_quantity' => 5,
            'requires_prescription' => false,
        ]);
    }
}
