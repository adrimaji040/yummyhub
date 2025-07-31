<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;


class UserController extends Controller
{
    
    public function index(){
        $users = User::all();
        return response()->json($users,200);
    }

    public function show($id){
        
        $user = User::find($id);
        return response()->json($user,200);
    }

    public function store(){
        $user = new User();

        $user->name=request('name');
        $user->email=request('email');        
        $user->password=request('password');

        $user->save();

        return response()->json($user,201);
    }

    public function update($id){
        $user = User::find($id);

        $user->name=request('name');
        $user->email=request('email');        
        $user->password=request('password');
        $user->save();

        return response()->json($user,200);
    }

    public function destroy($id){
        $user = User::find($id);
        $user->delete();

        return response()->json($user,200);
    }

    public function register(Request $request)
    {

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
    
    public function updatePassword(Request $request, $id)
{
    $request->validate([
        'name' => 'sometimes|required|string|max:255',
        'email' => 'sometimes|required|email|unique:users,email,' . $id,
        'password' => 'sometimes|required|string|min:8|confirmed',
    ]);

    $user = User::find($id);

    if (!$user) {
        return response()->json(['error' => 'Usuario no encontrado.'], 404);
    }

    // Depuración
    if ($request->filled('name')) {
        $user->name = $request->name;
    }
    if ($request->filled('email')) {
        $user->email = $request->email;
    }
    if ($request->filled('password')) {
        $user->password = Hash::make($request->password);
    }

    // Intentar guardar el usuario
    try {
        $user->save();
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al guardar el usuario: ' . $e->getMessage()], 500);
    }

    return response()->json($user, 200);
}



    
}
