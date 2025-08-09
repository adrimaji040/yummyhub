<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Recipe;
Use App\Models\Favorite;
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
        
    $user = User::findOrFail($id);
    return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'profile_picture' => $user->profile_picture,
    ]);
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
    public function profile(Request $request)
{
    $user = $request->user();

    $favorites = \App\Models\Recipe::select('recipes.*', 'categories.name as category_name')
        ->join('favorites', 'recipes.id', '=', 'favorites.recipe_id')
        ->join('categories', 'recipes.category_id', '=', 'categories.id')
        ->where('favorites.user_id', $user->id)
        ->get();

    return response()->json([
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ],
        'favorites' => $favorites,
    ]);
}   
    //recipes by user ID
    public function recipes($id, Request $request)
    {
        $search = $request->input('search');

        $query = Recipe::select(
                'recipes.*',
                'categories.name as category_name',
                'users.name as user_name'
            )
            ->join('categories', 'recipes.category_id', '=', 'categories.id')
            ->join('users', 'recipes.user_id', '=', 'users.id')
            ->where('recipes.user_id', $id);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('recipes.title', 'like', "%{$search}%")
                  ->orWhere('recipes.description', 'like', "%{$search}%")
                  ->orWhere('recipes.instructions', 'like', "%{$search}%");
            });
        }

        return response()->json($query->get(), 200);
    }
    //favorites by user ID
    public function favorites($id)
    {
        $favorites = Recipe::select(
                'recipes.*',
                'categories.name as category_name',
                'users.name as user_name'
            )
            ->join('favorites', 'recipes.id', '=', 'favorites.recipe_id')
            ->join('categories', 'recipes.category_id', '=', 'categories.id')
            ->join('users', 'recipes.user_id', '=', 'users.id')
            ->where('favorites.user_id', $id)
            ->get();

        return response()->json($favorites, 200);
    }
    
}
