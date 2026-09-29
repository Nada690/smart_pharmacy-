<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'active_ingredient',
        'description',
        'price',
        'stock_quantity',
        'expiry_date',
        'requires_prescription',
        'image'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'requires_prescription' => 'boolean',
        'expiry_date' => 'date:Y-m-d',
    ];

    protected $appends = ['is_expired', 'is_expiring_soon'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getIsExpiredAttribute(): bool
    {
        if (!$this->expiry_date) return false;
        return $this->expiry_date->isPast();
    }

    public function getIsExpiringSoonAttribute(): bool
    {
        if (!$this->expiry_date || $this->getIsExpiredAttribute()) return false;
        // تقترب الصلاحية إذا تبقت 90 يوماً أو أقل
        return $this->expiry_date->diffInDays(now()) <= 90;
    }
}
