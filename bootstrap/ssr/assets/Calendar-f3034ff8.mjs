var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Component, useState } from "react";
import { router, Head } from "@inertiajs/react";
import moment from "moment";
import Timeline$1, { TimelineHeaders, SidebarHeader, DateHeader, CursorMarker } from "react-calendar-timeline";
const Timeline = "";
const CalendarTimeline$1 = "";
const Logo = "/build/assets/site-logo-0e5e1048.svg";
class CalendarTimeline extends Component {
  constructor(props) {
    super(props);
    __publicField(this, "toggleGroup", (id) => {
      const { openGroups } = this.state;
      this.setState({
        openGroups: {
          ...openGroups,
          [id]: !openGroups[id]
        }
      });
    });
    this.state = {
      openGroups: this.props.openGroups ?? {}
    };
  }
  render() {
    const { groups, items } = this.props;
    const { openGroups } = this.state;
    const newGroups = groups.filter((group) => group.root || openGroups[group.parent]).map((group) => {
      return Object.assign({}, group, {
        title: group.root ? /* @__PURE__ */ jsx("div", { className: "group-toggle", onClick: () => this.toggleGroup(group.id), children: group.title }) : /* @__PURE__ */ jsx("div", { children: group.title })
      });
    });
    return /* @__PURE__ */ jsx("div", { className: "calendar-timeline", children: /* @__PURE__ */ jsxs(
      Timeline$1,
      {
        groups: newGroups,
        items,
        sidebarWidth: 200,
        defaultTimeStart: moment().add(-5, "months"),
        defaultTimeEnd: moment().add(9, "months"),
        children: [
          /* @__PURE__ */ jsxs(TimelineHeaders, { className: "sticky", children: [
            /* @__PURE__ */ jsx(SidebarHeader, { children: ({ getRootProps }) => {
              return /* @__PURE__ */ jsx("div", { className: "logo", ...getRootProps(), children: /* @__PURE__ */ jsx("img", { src: Logo, alt: "Larsen" }) });
            } }),
            /* @__PURE__ */ jsx(DateHeader, { unit: "primaryHeader" }),
            /* @__PURE__ */ jsx(DateHeader, {})
          ] }),
          /* @__PURE__ */ jsx(CursorMarker, { children: ({ styles }) => {
            const customStyles = {
              ...styles,
              background: "#f1f1f1"
            };
            return /* @__PURE__ */ jsx("div", { style: customStyles });
          } })
        ]
      }
    ) });
  }
}
const CalendarTimelineFilter$1 = "";
function CalendarTimelineFilter() {
  const [moveInDate, setMoveInDate] = useState("");
  const [moveOutDate, setMoveOutDate] = useState("");
  const resetFilters = () => {
    router.get("/");
  };
  const applyFilters = () => {
    router.get("/", {
      filter: {
        start_date: moveInDate,
        end_date: moveOutDate
      }
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "calendar-timeline-filter", children: [
    /* @__PURE__ */ jsx("h3", { className: "calendar-timeline-filter__title", children: "Filters" }),
    /* @__PURE__ */ jsxs("section", { className: "calendar-timeline-filter__group direction-col", children: [
      /* @__PURE__ */ jsx("label", { children: "Move in date" }),
      /* @__PURE__ */ jsx("input", { type: "date", onChange: (e) => setMoveInDate(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "calendar-timeline-filter__group direction-col", children: [
      /* @__PURE__ */ jsx("label", { children: "Move out date" }),
      /* @__PURE__ */ jsx("input", { type: "date", onChange: (e) => setMoveOutDate(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "calendar-timeline-filter__group direction-row space-between", children: [
      /* @__PURE__ */ jsx("button", { type: "button", onClick: resetFilters, className: "secondary", children: "Reset" }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: applyFilters, className: "primary", children: "Apply" })
    ] })
  ] });
}
const DATE_FORMAT = "DD.MM.YYYY";
class Calendar extends Component {
  constructor(props) {
    super(props);
    __publicField(this, "parseBookingsForTimeline", () => {
      const { bookings } = this.props;
      let openGroups = {};
      let newGroups = [];
      let address = null;
      let parentId = null;
      let items = [];
      if (bookings && bookings.length > 0) {
        bookings.map((booking, i) => {
          if (booking.address !== address) {
            parentId = `${i}-toggle`;
            newGroups.push({
              id: parentId,
              root: true,
              title: booking.address
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
          openGroups[parentId] = true;
          booking.bookings.map((item) => items.push({
            id: item.id,
            group: item.apartment_id,
            title: this.createItemTitle(item),
            start_time: moment(item.start_date).valueOf(),
            end_time: moment(item.end_date).valueOf(),
            canMove: false,
            itemProps: {
              style: {
                background: "#c3c3c3",
                border: "1px solid #adadad",
                color: "#000"
              }
            }
          }));
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
                  background: "#e7b95d",
                  border: "1px solid #ddab47",
                  color: "#000"
                }
              }
            });
          }
        });
      }
      return {
        groups: newGroups,
        openGroups,
        items
      };
    });
    __publicField(this, "createItemTitle", (item) => {
      if (item.client) {
        const startDate = moment(item.start_date).format(DATE_FORMAT);
        const endDate = moment(item.end_date).format(DATE_FORMAT);
        return `${item.client.first_name} ${item.client.last_name} (${startDate} - ${endDate})`;
      } else {
        const startDate = moment(item.short_term_start_date).format(DATE_FORMAT);
        const endDate = moment(item.short_term_end_date).format(DATE_FORMAT);
        return `Short-term (${startDate} - ${endDate})`;
      }
    });
    const { groups, openGroups, items } = this.parseBookingsForTimeline();
    this.state = {
      groups,
      openGroups,
      items
    };
  }
  render() {
    const { groups, openGroups, items } = this.state;
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Head, { title: "Calendar MVP" }),
      /* @__PURE__ */ jsx(CalendarTimelineFilter, {}),
      /* @__PURE__ */ jsx(
        CalendarTimeline,
        {
          groups,
          items,
          openGroups
        }
      )
    ] });
  }
}
export {
  Calendar as default
};
