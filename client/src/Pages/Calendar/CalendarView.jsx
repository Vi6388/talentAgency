import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { TalentApi } from "../../apis/TalentApi";
import { JobApi } from "../../apis/job";
import { combineDateAndTime } from "../../utils/utils";
import { store } from "../../redux/store";
import { CHANGE_IS_LOADING } from "../../redux/actionTypes";

const localizer = momentLocalizer(moment)

const CalendarView = () => {
  const [originalEventList, setOriginalEventList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [talentList, setTalentList] = useState([]);
  const [selectedTaletUser, setSelectedTalentUser] = useState(null);

  useEffect(() => {
    getTalentList();
  }, []);

  useEffect(() => {
    if (talentList.length > 0) {
      getCalendarEventList();
    }
  }, [talentList]);

  const getCalendarEventList = () => {
    store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
    JobApi.getCalendarEventList().then((res) => {
      if (res.data.status === 200) {
        const list = res.data.list;

        // Grouping eventList by talent
        const groupedEvents = list.reduce((acc, event) => {
          const talentEmail = event.talent.email;
          if (!acc[talentEmail]) {
            acc[talentEmail] = {
              talent: event.talent,
              events: []
            };
          }
          acc[talentEmail].events.push(...event.eventList);
          return acc;
        }, {});

        // Convert the object to an array if needed
        const groupedEventsArray = Object.values(groupedEvents);
        setOriginalEventList(groupedEventsArray);

        const formattedList = formatEventList(groupedEventsArray);
        setEventList(formattedList);
      }
      store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
    });
  }

  const formatEventList = (data) => {
    let list = [];
    if (data?.length > 0) {
      data?.forEach(item => {
        if (item?.events?.length > 0) {
          const talent = talentList.filter(talent => talent?.email === item.talent?.email)[0];
          item?.events?.forEach((event) => {
            const data = {
              title: talent?.firstname + " " + talent?.surname + " - " + event.jobTitle,
              start: event?.eventDate ? combineDateAndTime(new Date(event?.eventDate), event?.eventStartTime) : new Date(event?.liveDate),
              end: event?.eventDate ? combineDateAndTime(new Date(event?.eventDate), event?.eventEndTime) : new Date(event?.liveDate),
              hexColor: talent?.highlightColor || "#ddd",
            };
            list.push(data);
          })
        }
      });
    }
    return list;
  }

  const getTalentList = () => {
    TalentApi.getTalentList().then((res) => {
      if (res.data.status === 200) {
        setTalentList(res.data.data);
      }
    })
  }

  const eventStyleGetter = (event, start, end, isSelected) => {
    var style = {
      backgroundColor: event.hexColor
    };
    return {
      style: style
    };
  }

  const selectEvent = (event) => {
    console.log(event);
  }

  const selectedTalent = (item) => {
    setSelectedTalentUser(item);
    const eventByTalent = originalEventList?.filter(original => original?.talent?.email === item.email);
    const formattedList = formatEventList(eventByTalent);
    setEventList(formattedList);
  }

  const showAll = () => {
    const formattedList = formatEventList(originalEventList);
    setEventList(formattedList);
    setSelectedTalentUser(null);
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-9">
        <div className="md:col-span-2 col-span-1 px-4 h-full flex flex-col">
          <div className="flex justify-between items-center">
            <div className="text-base text-title-2 font-gotham-bold py-3">Filter By Talent</div>
            <button className="bg-white w-fit px-4 h-8 text-center rounded-[12px] text-input font-gotham-bold tracking-wider
                                block rounded-[16px] bg-white leading-normal shadow-md transition duration-150 ease-in-out 
                                hover:bg-neutral-200 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-xs"
              onClick={showAll}>
              Show all
            </button>
          </div>
          <div className="w-full h-full bg-white shadow-lg rounded-2xl mt-3 py-1">
            {
              talentList?.map((item, index) => {
                return (
                  <div className={`border-b last:border-none border-[#b99e8b] flex items-center justify-start gap-2 p-3 hover:bg-[#f9f6f4] cursor-pointer 
                      ${selectedTaletUser?._id === item?._id ? 'bg-[#f9f6f4]' : 'bg-transparent'}`}
                    key={index}
                    onClick={() => selectedTalent(item)}>
                    <div className="w-4 h-4 rounded-full" style={{ background: item.highlightColor }}></div>
                    <div className="font-gotham-book tracking-wider">{item.firstname} {item.surname}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="md:col-span-7 col-span-1 px-4 mt-8 md:mt-2">
          <Calendar
            localizer={localizer}
            events={eventList}
            startAccessor="start"
            endAccessor="end"
            eventPropGetter={eventStyleGetter}
            onSelectEvent={event => selectEvent(event)}
            style={{ height: 750 }}
          />
        </div>
      </div>
    </div>
  )
}

export default CalendarView;