<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\CatalogController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\SettingController;

Route::prefix('v1')->group(function () {
    // Публичные маршруты
    Route::get('/catalog', [CatalogController::class, 'index']);
    Route::get('/catalog/{slug}', [CatalogController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
    
    // Публичные настройки магазина (для футера и контактов)
    Route::get('/settings', [SettingController::class, 'index']);

    // Админка
    Route::prefix('admin')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            
            // Заказы
            Route::get('/orders', [AdminOrderController::class, 'index']);
            Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus']);
            
            // Товары (CRUD)
            Route::apiResource('products', AdminProductController::class)->only(['index', 'store', 'update']);

            // Настройки (Админские)
            Route::post('/settings', [SettingController::class, 'update']);

            // УПРАВЛЕНИЕ СОТРУДНИКАМИ (ДОБАВИТЬ ЭТИ СТРОКИ)
            Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index']);
            Route::post('/users', [\App\Http\Controllers\Admin\UserController::class, 'store']);
            Route::patch('/users/{user}/toggle', [\App\Http\Controllers\Admin\UserController::class, 'toggle']);
        });
    });
});