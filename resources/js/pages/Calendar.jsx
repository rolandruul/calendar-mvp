import { Component } from 'react';
import { Head } from '@inertiajs/react';
import moment from 'moment';
import CalendarTimeline from '../components/CalendarTimeline/CalendarTimeline';
import CalendarTimelineFilter from '../components/CalendarTimelineFilter/CalendarTimelineFilter';

const DATE_FORMAT = 'DD.MM.YYYY';

export default class Calendar extends Component {
    constructor(props) {
        super(props);
        const { groups, openGroups, items } = this.parseBookingsForTimeline();
        this.state = {
            groups,
            openGroups,
            items
        };
    }

    parseBookingsForTimeline = () => {
        const { bookings } = this.props;
        let openGroups = {};
        let newGroups = [];
        let address = null;
        let parentId = null;
        let items = [];

        if (bookings && bookings.length > 0) {
            bookings.map((booking, i) => {
                // 1. Parse groups from booking data (apartments).
                // Create new group for toggle (w/ address)
                if (booking.address !== address) {
                    parentId = `${i}-toggle`;
                    newGroups.push({
                        id: parentId,
                        root: true,
                        title: booking.address,
                    });
                    address = booking.address;
                }
                newGroups.push(
                    Object.assign({}, booking, {
                        root: false,
                        parent: parentId,
                        title: booking.name
                    })
                );
                // Keep group toggles open on load.
                openGroups[parentId] = true;
                // 2. Parse items from booking data (bookings related to apartment)
                booking.bookings.map(item => items.push({
                    id: item.id,
                    group: item.apartment_id,
                    title: this.createItemTitle(item),
                    start_time: moment(item.start_date).valueOf(),
                    end_time: moment(item.end_date).valueOf(),
                    canMove: false,
                    itemProps: {
                        style: {
                            background: '#c3c3c3',
                            border: '1px solid #adadad',
                            color: '#000'
                        }
                    }
                }));
                // Short-term bookings
                if (booking.short_term_start_date && booking.short_term_end_date) {
                    items.push({
                        id: `${i}-short-term`,
                        group: booking.id,
                        title: this.createItemTitle(booking),
                        start_time: moment(booking.short_term_start_date).valueOf(),
                        end_time: moment(booking.short_term_end_date).valueOf(),
                        canMove: false,
                        itemProps: {
                            style: {
                                background: '#e7b95d',
                                border: '1px solid #ddab47',
                                color: '#000'
                            }
                        }
                    });
                }
            });
        }
        return {
            groups: newGroups,
            openGroups: openGroups,
            items: items,
        };
    };

    createItemTitle = item => {
        if (item.client) {
            const startDate = moment(item.start_date).format(DATE_FORMAT);
            const endDate = moment(item.end_date).format(DATE_FORMAT);
            return `${item.client.first_name} ${item.client.last_name} (${startDate} - ${endDate})`;
        } else {
            const startDate = moment(item.short_term_start_date).format(DATE_FORMAT);
            const endDate = moment(item.short_term_end_date).format(DATE_FORMAT);
            return `Short-term (${startDate} - ${endDate})`;
        }
    };

    render() {
        const { groups, openGroups, items } = this.state;

        return (
            <>
                <Head title="Calendar MVP"/>
                <CalendarTimelineFilter />
                <CalendarTimeline
                    groups={groups}
                    items={items}
                    openGroups={openGroups}
                />
            </>
        );
    }
}
