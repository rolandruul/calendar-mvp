import './CalendarTimelineFilter.scss';
import { router } from '@inertiajs/react';
import {useState} from 'react';

export default function CalendarTimelineFilter() {

    const [moveInDate, setMoveInDate] = useState('');
    const [moveOutDate, setMoveOutDate] = useState('');

    const resetFilters = () => {
        router.get('/');
    };

    const applyFilters = () => {
        router.get('/', {
            filter: {
                start_date: moveInDate,
                end_date: moveOutDate
            }
        });
    };

    const toggleFilters = () => {
        //
    };

    return (
        <div className="calendar-timeline-filter">
            <h3 className="calendar-timeline-filter__title">
                Filters
                {/*<button type="button" onClick={toggleFilters} className="calendar-timeline-filter__toggle" />*/}
            </h3>
            <section className="calendar-timeline-filter__group direction-col">
                <label>Move in date</label>
                <input type="date" onChange={(e) => setMoveInDate(e.target.value)}/>
            </section>
            <section className="calendar-timeline-filter__group direction-col">
                <label>Move out date</label>
                <input type="date" onChange={(e) => setMoveOutDate(e.target.value)} />
            </section>
            <section className="calendar-timeline-filter__group direction-row space-between">
                <button type="button" onClick={resetFilters} className="secondary">Reset</button>
                <button type="button" onClick={applyFilters} className="primary">Apply</button>
            </section>
        </div>
    );
}
