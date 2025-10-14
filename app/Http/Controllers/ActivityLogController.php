<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreActivityLogRequest;
use App\Http\Requests\UpdateActivityLogRequest;
use App\Models\ActivityLog;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index()
    {
        $all_logs =  ActivityLog::all();

        $all_logs->load('user');
        $all_logs->load('admin');

        $mapped = collect($all_logs)->map(function ($log) {
            $log->admin_name = $log->admin->name;
            $log->user_name = $log->user->name;
            return $log;
        });
        
        return Inertia::render('activity-logs/index', [
            'activityLogs' => $mapped, 
        ]);
    }
}
