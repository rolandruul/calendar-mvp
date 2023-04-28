<?php

namespace App\Services\Calendar;

use App\Services\BookingService;
use Carbon\Carbon;

class TimelineService
{
    /**
     * Constructor.
     */
    public function __construct(private BookingService $bookingService)
    {
        //
    }

    /**
     * Returns all the apartments w/ booking and client info.
     *
     * @param array|null $filter
     * @return mixed
     */
    public function getAllApartmentsWithBookings(array $filter = null): mixed
    {
        $bookings = $this->bookingService->getAllWithRelations();

        if ($filter && ($filter['start_date'] || $filter['end_date'])) {
            $filteredBookings = $bookings->filter(function ($row) use ($filter) {
                $startDate = $filter['start_date'] ? $this->parseDate($filter['start_date']) : null;
                $endDate = $filter['end_date'] ? $this->parseDate($filter['end_date']) : null;

                return $this->allowedDate($startDate, $endDate, $row);
            })->toArray();
            return array_values($filteredBookings);
        }

        return $bookings;
    }

    /**
     * Check if date is allowed by the filters.
     * TODO: refactor...
     *
     * @param $startDate
     * @param $endDate
     * @param $row
     * @return bool
     */
    private function allowedDate($startDate, $endDate, $row): bool
    {
        // Short-time
        if (
            $startDate
            && $row->short_term_start_date
            && $this->parseDate($row->short_term_start_date)->eq($startDate)
        ) {
            return true;
        }
        if (
            $endDate
            && $row->short_term_end_date
            && $this->parseDate($row->short_term_end_date)->eq($endDate)
        ) {
            return true;
        }

        // Regular bookings
        $bookings = $row->bookings()->get()->filter(function ($booking) use ($startDate, $endDate) {
            if (
                $startDate
                && $booking->start_date
                && $this->parseDate($booking->start_date)->eq($startDate)
            ) {
                return true;
            }
            if (
                $endDate
                && $booking->end_date
                && $this->parseDate($booking->end_date)->eq($endDate)
            ) {
                return true;
            }
        });

        return count($bookings) > 0;
    }

    /**
     * Parses dates to same time format.
     *
     * @param $date
     * @return Carbon
     */
    private function parseDate($date): Carbon
    {
        return Carbon::parse($date)
            ->setHours(0)
            ->setMinutes(0)
            ->setSeconds(0);
    }
}
