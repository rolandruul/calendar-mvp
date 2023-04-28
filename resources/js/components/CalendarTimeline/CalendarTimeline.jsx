import 'react-calendar-timeline/lib/Timeline.css';
import './CalendarTimeline.scss';
import {Component} from 'react';
import moment from 'moment';
import Timeline, { TimelineHeaders, SidebarHeader, DateHeader, CursorMarker } from 'react-calendar-timeline';
import Logo from './../../../img/site-logo.svg';

export default class CalendarTimeline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openGroups: this.props.openGroups ?? {}
        };
    }

    toggleGroup = id => {
        const { openGroups } = this.state;
        this.setState({
            openGroups: {
                ...openGroups,
                [id]: !openGroups[id]
            }
        });
    };

    render() {
        const { groups, items } = this.props;
        const { openGroups } = this.state;

        const newGroups = groups
            .filter(group => group.root || openGroups[group.parent])
            .map(group => {
                return Object.assign({}, group, {
                    title: group.root ? (
                        <div className="group-toggle" onClick={() => this.toggleGroup(group.id)}>
                            {group.title}
                        </div>
                    ) : (
                        <div>{group.title}</div>
                    )
                })
            });

        return (
            <div className="calendar-timeline">
                <Timeline
                    groups={newGroups}
                    items={items}
                    sidebarWidth={200}
                    defaultTimeStart={moment().add(-5, 'months')}
                    defaultTimeEnd={moment().add(9, 'months')}
                >
                    <TimelineHeaders className="sticky">
                        <SidebarHeader>
                            {({ getRootProps }) => {
                                return (
                                    <div className="logo" {...getRootProps()}>
                                        <img src={Logo} alt="Larsen" />
                                    </div>
                                );
                            }}
                        </SidebarHeader>
                        <DateHeader unit="primaryHeader" />
                        <DateHeader />
                    </TimelineHeaders>
                    <CursorMarker>
                        {({ styles }) => {
                            const customStyles = {
                                ...styles,
                                background: '#f1f1f1',
                            }
                            return <div style={customStyles} />
                        }}
                    </CursorMarker>
                </Timeline>
            </div>
        );
    };
}
