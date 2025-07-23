<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function show(User $_user, User $user) {
        return $_user->is_admin || $_user->id == $user->id;
    }
}