<?php

namespace App;

enum StatusEnum: string
{
    case PENDING = 'Pending';
    case UNDER_REVIEW = 'Under Review';
    case APPROVED = 'Approved';
    case READY_FOR_PICKUP = 'Ready for Pickup';
    case DECLINED = 'Declined';
    case COMPLETED = 'Completed';
}
