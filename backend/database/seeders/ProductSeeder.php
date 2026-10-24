<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['category_id' => 1, 'name' => 'Хлеб на закваске', 'weight' => '450г', 'price' => 180.00, 'is_featured' => true],
            ['category_id' => 2, 'name' => 'Круассан классический', 'weight' => '110г', 'price' => 110.00, 'is_featured' => true],
            ['category_id' => 2, 'name' => 'Булочка с корицей', 'weight' => '110г', 'price' => 145.00, 'is_featured' => true],
            ['category_id' => 1, 'name' => 'Французский багет', 'weight' => '250г', 'price' => 95.00, 'is_featured' => true],
        ];

        foreach ($products as $item) {
            Product::create([
                'category_id' => $item['category_id'],
                'name' => $item['name'],
                'slug' => Str::slug($item['name']) . '-' . rand(100, 999), // гарантируем уникальность
                'description' => 'Свежайшая выпечка, приготовленная с любовью по традиционным рецептам.',
                'ingredients' => 'Мука пшеничная, вода, соль, закваска.',
                'price' => $item['price'],
                'image_path' => 'images/' . Str::slug($item['name']) . '.jpg', // Путь для картинки
                'is_available' => true,
                'is_featured' => $item['is_featured'],
            ]);
        }
    }
}