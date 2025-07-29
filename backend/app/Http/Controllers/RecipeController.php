<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RecipeController extends Controller
{
    
    /*
    public function index()
{
    $recipes = Recipe::select(
        'recipes.*',
        'categories.name as category_name',
        'users.name as user_name',
        'users.id as user_id'
    )
    ->join('categories', 'recipes.category_id', '=', 'categories.id')
    ->join('users', 'recipes.user_id', '=', 'users.id')
    ->get();

    return response()->json($recipes, 200);
}
/*
    public function index(){
        $recipes = Recipe::all();
        return response()->json($recipes,200);
    }
*/

public function index(Request $request, $userId)
{
   $search = $request->input('search');

    // Construir la query base con joins
    $query = Recipe::where('user_id', $userId)
        ->select(
            'recipes.*',
            'categories.name as category_name',
            'users.name as user_name'
        )
        ->join('categories', 'recipes.category_id', '=', 'categories.id')
        ->join('users', 'recipes.user_id', '=', 'users.id');

    // Si hay término de búsqueda, aplicar filtros
    if (!empty($search)) {
        $query->where(function($q) use ($search) {
            $q->where('recipes.title', 'like', "%{$search}%")
              ->orWhere('recipes.description', 'like', "%{$search}%")
              ->orWhere('recipes.instructions', 'like', "%{$search}%");
        });
    }

    // Obtener recetas (todas o filtradas)
    $recipes = $query->get();

    return response()->json($recipes, 200);
}


    public function searchWord(Request $request)
    {
        // Get the search term from the query parameter
        $search = $request->input('search');

        // Initialize the query
        $query = Recipe::query();

        // Apply search filters if provided
        if ($search) {
            $query->where('title', 'like', '%' . $search . '%')
                ->orWhere('description', 'like', '%' . $search . '%')
                ->orWhere('instructions', 'like', '%' . $search . '%');
        }

        // Get the filtered recipes
        $recipes = $query->get();

        return response()->json($recipes, 200);
        
    }

    public function show($id)
    {
        // Find the recipe by ID with a join to get the category name
        $recipe = Recipe::select(
            'recipes.*',
            'categories.name as category_name',
            'users.name as user_name',
            'users.id as user_id'
        )
        ->join('categories', 'recipes.category_id', '=', 'categories.id')
        ->join('users', 'recipes.user_id', '=', 'users.id')
        ->where('recipes.id', $id)
        ->first();

        // Check if recipe exists
        if (!$recipe) {
            return response()->json(['message' => 'Not found'], 404);
        }

        // Return recipes as JSON response
        return response()->json($recipe, 200);
    }


    public function latest(): JsonResponse
    {
        $recipe = Recipe::latest()->first();
        return response()->json($recipe);
    }

    public function store(Request $request)
{
    $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'instructions' => 'nullable|string',
        'cooking_time' => 'nullable|string',
        'servings' => 'nullable|integer',
        'user_id' => 'required|exists:users,id',
        'category_id' => 'required|exists:categories,id',
        'ingredients' => 'required|array',
        'ingredients.*.id' => 'required|exists:ingredients,id',
        'ingredients.*.quantity' => 'required|string|max:100',
    ]);

    $recipe = Recipe::create([
        'title' => $request->title,
        'description' => $request->description,
        'instructions' => $request->instructions,
        'cooking_time' => $request->cooking_time,
        'servings' => $request->servings,
        'user_id' => $request->user_id,
        'category_id' => $request->category_id,
        'cover_photo_url' => $request->file('cover_photo_url')?->store('cover_photos', 'public'),
    ]);

    foreach ($request->ingredients as $ingredient) {
        $recipe->ingredients()->attach($ingredient['id'], ['quantity' => $ingredient['quantity']]);
    }

    return response()->json($recipe->load('ingredients'), 201);
}


    public function update(Request $request, $id)
    {
        // Validar los datos de entrada
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'cover_photo_url' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'description' => 'required|string',
            'instructions' => 'required|string',
            'cooking_time' => 'required|integer|min:1',
            'servings' => 'nullable|integer|min:1|max:10',
            'category_id' => 'required|integer',
            'user_id' => 'required|integer', // Agrega la validación para user_id
        ]);

        // Encontrar la receta existente
        $recipe = Recipe::find($id);

        // Verificar si la receta existe
        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }

        // Actualizar los atributos de la receta
        $recipe->title = $validated['title'];
        $recipe->description = $validated['description'];
        $recipe->instructions = $validated['instructions'];
        $recipe->cooking_time = $validated['cooking_time'];
        $recipe->servings = $validated['servings'];
        $recipe->category_id = $validated['category_id'];
        $recipe->user_id = $validated['user_id']; // Usa el user_id de la solicitud

        // Manejar la carga de una nueva imagen si se proporciona
        if ($request->hasFile('cover_photo_url')) {
            // Eliminar la imagen anterior si existe
            if ($recipe->cover_photo_url && file_exists(public_path($recipe->cover_photo_url))) {
                unlink(public_path($recipe->cover_photo_url));
            }

            $file = $request->file('cover_photo_url');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('upload'), $filename);
            $recipe->cover_photo_url = 'upload/' . $filename;
        }

        // Guardar la receta actualizada
        $recipe->save();

        // Retornar la respuesta
        return response()->json($recipe, 200);
    }

    
    




    public function destroy($id)
    {
        // Verificar si el usuario está autenticado
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Obtener la receta por ID
        $recipe = Recipe::find($id);

        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }

        // Verificar si el usuario autenticado es el propietario de la receta
        if ($recipe->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Eliminar la receta
        $recipe->delete();

        return response()->json(['message' => 'Recipe deleted successfully'], 200);
    }

public function getRelatedRecipes($id)
{
    $recipe = Recipe::findOrFail($id);

    $relatedRecipes = Recipe::select(
            'recipes.*',
            'categories.name as category_name',
            'users.name as user_name',
            'users.id as user_id'
        )
        ->join('categories', 'recipes.category_id', '=', 'categories.id')
        ->join('users', 'recipes.user_id', '=', 'users.id')
        ->where('recipes.category_id', $recipe->category_id)
        ->where('recipes.id', '!=', $id)
        ->take(4)
        ->get();

    return response()->json($relatedRecipes);
}

    /** FAVORITES */
    public function getAverageRating($id)
    {
        $average = DB::table('votes')
            ->where('recipe_id', $id)
            ->avg('rating');

        $count = DB::table('votes')
            ->where('recipe_id', $id)
            ->count();

        return response()->json([
            'recipe_id' => $id,
            'average_rating' => round($average, 2), // Redondea a 2 decimales
            'total_votes' => $count,
        ]);
    }

    public function toggleFavorite($id)
    {
        $user = Auth::user();

        $recipe = Recipe::findOrFail($id);

        // Verifica si ya está marcado como favorito
        $existingFavorite = Favorite::where('user_id', $user->id)
            ->where('recipe_id', $recipe->id)
            ->first();

        if ($existingFavorite) {
            // Si ya existe, lo elimina (toggle OFF)
            $existingFavorite->delete();
            return response()->json(['message' => 'Removed from favorites']);
        } else {
            // Si no existe, lo crea (toggle ON)
            Favorite::create([
                'user_id' => $user->id,
                'recipe_id' => $recipe->id
            ]);
            return response()->json(['message' => 'Added to favorites']);
        }
    }


    public function getFavorites()
    {
        $user = Auth::user();
        $favorites = $user->favorites()->with('user', 'category')->get();
        return response()->json($favorites);
    }


    
public function getAllRecipes(Request $request)
{
    $search = $request->input('search');

    // Construir la query base con joins
    $query = Recipe::select(
            'recipes.*',
            'categories.name as category_name',
            'users.name as user_name',
            'users.id as user_id'
        )
        ->join('categories', 'recipes.category_id', '=', 'categories.id')
        ->join('users', 'recipes.user_id', '=', 'users.id');

    // Si hay término de búsqueda, aplicar filtros
    if (!empty($search)) {
        $query->where(function($q) use ($search) {
            $q->where('recipes.title', 'like', "%{$search}%")
              ->orWhere('recipes.description', 'like', "%{$search}%")
              ->orWhere('recipes.instructions', 'like', "%{$search}%");
        });
    }

    // Obtener recetas (todas o filtradas)
    $recipes = $query->get();

    return response()->json($recipes, 200);
}


}
