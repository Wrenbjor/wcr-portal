<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('name')->get()->map(fn($u) => [
            'id'         => $u->id,
            'name'       => $u->name,
            'email'      => $u->email,
            'role'       => $u->role,
            'created_at' => $u->created_at->format('M j, Y'),
        ]);

        return Inertia::render('System/Users/Index', ['users' => $users]);
    }

    public function create()
    {
        return Inertia::render('System/Users/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => ['required', Password::min(8)],
            'role'     => 'required|in:admin,sales',
        ]);

        User::create($data);

        return redirect()->route('system.users.index')->with('success', 'User created.');
    }

    public function edit(User $user)
    {
        return Inertia::render('System/Users/Edit', [
            'user' => $user->only('id', 'name', 'email', 'role'),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'role'     => 'required|in:admin,sales',
            'password' => ['nullable', Password::min(8)],
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        return redirect()->route('system.users.index')->with('success', 'User updated.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['user' => 'You cannot delete your own account.']);
        }

        $user->delete();

        return redirect()->route('system.users.index')->with('success', 'User deleted.');
    }
}
