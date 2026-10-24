<?php

namespace Database\Seeders;

use App\Models\ShopSetting;
use Illuminate\Database\Seeder;

class ShopSettingSeeder extends Seeder
{
    public function run(): void
    {
        ShopSetting::create(['setting_key' => 'shop_name', 'setting_value' => 'Пекарня Онлайн']);
        ShopSetting::create(['setting_key' => 'phone', 'setting_value' => '+7 (900) 123-45-67']);
        ShopSetting::create(['setting_key' => 'address', 'setting_value' => 'г. Воронеж, ул. Пушкина, д. 15']);
    }
}