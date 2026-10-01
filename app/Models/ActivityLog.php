<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_name',
        'action',
        'model_type',
        'model_name',
        'description',
        'ip_address',
    ];

    // تسجيل نشاط جديد بسهولة
    public static function log(string $action, string $modelType, string $modelName, string $description = '', string $userName = 'المدير'): void
    {
        static::create([
            'user_name'  => $userName,
            'action'     => $action,
            'model_type' => $modelType,
            'model_name' => $modelName,
            'description'=> $description,
            'ip_address' => request()->ip(),
        ]);
    }
}
