<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Администратор',
            'email' => 'admin@pekarnya.ru',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Сотрудник',
            'email' => 'employee@pekarnya.ru',
            'password' => Hash::make('password123'),
            'role' => 'employee',
            'is_active' => true,
        ]);
    }
}