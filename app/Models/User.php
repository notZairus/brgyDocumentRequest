<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use App\Models\DocumentRequest;
use App\Models\ActivityLog;
use App\Models\Penalty;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'sitio',
        'password',
        'verified_at',
        'is_admin',
        'status'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function document_requests() {
        return $this->hasMany(DocumentRequest::class);
    }

    public function activity_logs() {
        return $this->hasMany(ActivityLogs::class);
    }

    public function penalties() {
        return $this->hasMany(Penalty::class);
    }

    public function appeals() {
        return $this->hasManyThrough(Appeal::class, Penalty::class);
    }
}
