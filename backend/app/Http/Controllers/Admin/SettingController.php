<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShopSetting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    // Получить все настройки в виде ключ-значение
    public function index()
    {
        $settings = ShopSetting::all()->pluck('setting_value', 'setting_key');
        return response()->json($settings);
    }

    // Обновить настройки
    public function update(Request $request)
    {
        $data = $request->validate([
            'shop_name' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'work_hours' => 'nullable|string',
        ]);

        foreach ($data as $key => $value) {
            ShopSetting::updateOrCreate(
                ['setting_key' => $key],
                ['setting_value' => $value]
            );
        }

        return response()->json(['message' => 'Настройки сохранены']);
    }
}