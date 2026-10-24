<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // Получить все заказы
    public function index()
    {
        $orders = Order::with('items')->orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    // Изменить статус заказа
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:New,Confirmed,Preparing,Ready,Completed,Cancelled'
        ]);

        $order->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Статус обновлен',
            'order' => $order
        ]);
    }
}