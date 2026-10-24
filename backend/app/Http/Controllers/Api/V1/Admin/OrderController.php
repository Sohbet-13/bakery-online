<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;

class OrderController extends Controller
{
    public function index()
    {
        // Получаем все заказы, сортируем по новизне
        $orders = Order::with('items')->orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:New,Confirmed,Preparing,Ready,Completed,Cancelled'
        ]);

        $order->update(['status' => $request->status]);
        return response()->json($order);
    }
}