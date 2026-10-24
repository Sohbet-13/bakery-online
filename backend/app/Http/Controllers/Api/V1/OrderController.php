<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        // 1. Валидация входных данных
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email|max:255',
            'pickup_at' => 'required|date|after:now',
            'comment' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            // Генерируем уникальный номер заказа
            $orderNumber = 'ORD-' . strtoupper(Str::random(6));
            $totalAmount = 0;

                        // Создаем заказ
            $order = Order::create([
                'order_number' => $orderNumber,
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'customer_email' => $validated['customer_email'] ?? null,
                // Вот наша исправленная строка:
                'pickup_at' => \Carbon\Carbon::parse($validated['pickup_at'])->format('Y-m-d H:i:s'),
                'comment' => $validated['comment'] ?? null,
                'status' => 'New',
                'total_amount' => 0, 
            ]);
            // Обрабатываем позиции
            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['id']);
                
                if (!$product->is_available) {
                    throw new \Exception("Товар {$product->name} недоступен");
                }

                $lineTotal = $product->price * $item['quantity'];
                $totalAmount += $lineTotal;

                $order->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit_price' => $product->price,
                    'quantity' => $item['quantity'],
                    'line_total' => $lineTotal,
                ]);
            }

            // Обновляем итоговую сумму заказа
            $order->update(['total_amount' => $totalAmount]);

            DB::commit();

            return response()->json([
                'message' => 'Заказ успешно создан',
                'order' => $order->load('items'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Ошибка при создании заказа',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}