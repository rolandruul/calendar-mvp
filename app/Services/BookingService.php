<?php

namespace App\Services;

use App\Models\Apartment;

class BookingService
{
    /**
     * Constructor.
     */
    public function __construct(private Apartment $apartment)
    {
        //
    }

    /**
     * Get all bookings with relations.
     * @return mixed
     */
    public function getAllWithRelations(): mixed
    {
        return $this
            ->apartment
            ->select('id', 'name', 'addresss as address', 'short_term_start_date', 'short_term_end_date')
            ->with([
                'bookings' => function ($query) {
                    $query->select('id', 'apartment_id', 'client_id', 'start_date', 'end_date');
                },
                'bookings.client' => function ($query) {
                    $query->select('id', 'first_name', 'last_name');
                }
            ])
            ->whereNot('name', 'like', '%käts%')
            ->orderBy('name')
            ->get();
    }
}
