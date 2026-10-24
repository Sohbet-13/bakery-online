<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    // Получить всех пользователей (кроме самого себя)
    public function index(Request $request)
    {
        $users = User::where('id', '!=', $request->user()->id)
                     ->orderBy('created_at', 'desc')
                     ->get();
        return response()->json($users);
    }

    // Создать нового сотрудника
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::min(6)],
            'role' => 'required|in:admin,employee',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['is_active'] = true; // По умолчанию активен

        $user = User::create($validated);

        return response()->json([
            'message' => 'Сотрудник успешно создан',
            'user' => $user
        ], 201);
    }

    // Заблокировать/Разблокировать сотрудника
    public function toggle(User $user)
    {
        // Нельзя заблокировать самого себя
        if ($user->id === request()->user()->id) {
            return response()->json(['message' => 'Вы не можете заблокировать себя'], 403);
        }

        $user->update(['is_active' => !$user->is_active]);

        return response()->json([
            'message' => $user->is_active ? 'Доступ разрешен' : 'Доступ заблокирован',
            'user' => $user
        ]);
    }
}