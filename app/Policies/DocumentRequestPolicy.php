<?php

namespace App\Policies;

use App\Models\DocumentRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DocumentRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->is_admin;
    }

    public function view(User $user, DocumentRequest $documentRequest): bool
    {
        return $user->is_admin || $user->id == $documentRequest->user_id;
    }

    public function update(User $user, DocumentRequest $documentRequest): bool
    {
        return $user->is_admin;
    }
    
    public function delete(User $user, DocumentRequest $documentRequest): bool
    {
        return $user->is_admin;
    }
}
