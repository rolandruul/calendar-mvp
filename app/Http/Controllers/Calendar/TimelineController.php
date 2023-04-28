<?php

namespace App\Http\Controllers\Calendar;

use App\Http\Controllers\Controller;
use App\Services\Calendar\TimelineService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TimelineController extends Controller
{
    /**
     * Constructor.
     */
    public function __construct(private TimelineService $timelineService)
    {
        //
    }

    /**
     * Calendar timeline listing.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        return Inertia::render('Calendar', [
            'bookings' => $this->timelineService->getAllApartmentsWithBookings($request->input('filter'))
        ]);
    }
}
