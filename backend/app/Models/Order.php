<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number', 'customer_name', 'customer_phone', 'customer_email', 
        'pickup_at', 'comment', 'status', 'payment_method', 'total_amount'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}