<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;


class UserFriendSeeder extends Seeder
{
    public function run()
    {
        // Crear 10 usuarios
        $users = User::factory(10)->create();

        $userIds = $users->pluck('id')->toArray();

        // Crear relaciones de amistad random (sin duplicados y no reflexivas)
        foreach ($userIds as $userId) {
            $possibleFriends = array_diff($userIds, [$userId]);

            // Cada usuario tendrá de 2 a 5 amigos
            $friendCount = rand(2, 5);

            $friends = (array)array_rand(array_flip($possibleFriends), $friendCount);

            foreach ($friends as $friendId) {
                // Evitar duplicados: sólo insertar si no existe
                $exists = DB::table('user_friends')
                    ->where('user_id', $userId)
                    ->where('friend_id', $friendId)
                    ->exists();

                if (!$exists) {
                    DB::table('user_friends')->insert([
                        'user_id' => $userId,
                        'friend_id' => $friendId,
                        'status' => 'accepted',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}