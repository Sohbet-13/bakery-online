<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Неверный email или пароль'], 401);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Аккаунт заблокирован'], 403);
        }

        // Для простоты портфолио используем простой токен (в продакшене нужен Laravel Sanctum)
        $token = base64_encode($user->id . ':' . $user->email);

        return response()->json([
            'token' => $token,
            'user' => [
                'name' => $user->name,
                'role' => $user->role,
            ]
        ]);
    }
}