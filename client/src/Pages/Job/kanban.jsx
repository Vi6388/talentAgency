import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import JobCardItem from "../../Component/JobCardItem";
import { JobApi } from "../../apis/job";
import { statusList } from "../../utils/utils";
import { toast, ToastContainer } from "react-toastify";
import { TalentApi } from "../../apis/TalentApi";
import { CHANGE_IS_LOADING } from "../../redux/actionTypes";
import { store } from "../../redux/store";
import DownArrow from "../../svg/down-arrow.png";

const JobKanban = () => {
  const [ready, setReady] = useState(false);
  const [jobList, setJobList] = useState([]);
  const [talentList, setTalentList] = useState([]);
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReady(true);
    }

    TalentApi.getTalentList().then((res) => {
      if (res.data.status === 200) {
        setTalentList(res.data.data);
      }
    });
    getJobList();
  }, []);

  const getJobList = () => {
    store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
    JobApi.list(sort, order).then((res) => {
      if (res.data.status === 200) {
        const result = statusList.map(status => ({
          name: status.name,
          items: res.data.data.filter(item => item.jobStatus === status.statusIndex),
          sort: status.statusIndex
        })).sort((a, b) => a.sort - b.sort);
        setJobList(result)
      }
      store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
    });
  }

  const onDragEnd = (re) => {
    if (!re.destination) return;
    let newBoardData = jobList;
    var dragItem =
      newBoardData[parseInt(re.source.droppableId)].items[re.source.index];
    newBoardData[parseInt(re.source.droppableId)].items.splice(
      re.source.index,
      1
    );
    newBoardData[parseInt(re.destination.droppableId)].items.splice(
      re.destination.index,
      0,
      dragItem
    );
    const job = jobList?.filter((item, index) => index === parseInt(re.destination.droppableId))[0]?.items[0] || [];
    if (job) {
      const jobStatus = parseInt(re.destination.droppableId) + 1;
      JobApi.updateJobStatusById(job._id, { jobStatus: jobStatus }).then((res) => {
        if (res.data.status === 200) {
          setJobList(newBoardData);
          toast.success(res.data.message, {
            position: "top-left",
          });
        }
      })
    }
  };

  const sortByTalent = () => {
    setSort("talent");
    setOrder(order === "desc" ? "asc" : "desc");
    getJobList();
  }

  const sortByClient = () => {
    setSort("client");
    setOrder(order === "desc" ? "asc" : "desc");
    getJobList();
  }

  const showAll = () => {
    setSort("createdAt");
    setOrder("desc");
    getJobList();
  }

  return (
    <div className="p-5 flex flex-col h-full bg-main">
      <ToastContainer />
      <div className="filter-box mb-5 w-full md:w-fit mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button className="col-span-1 bg-white w-full px-2 h-10 text-center rounded-[12px] text-input font-gotham-bold tracking-wider
                            block rounded-[16px] bg-white leading-normal shadow-md transition duration-150 ease-in-out 
                            hover:bg-neutral-200 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm">Show urgent jobs
        </button>
        <button className="col-span-1 bg-white w-full px-2 h-10 text-center rounded-[12px] text-input font-gotham-bold tracking-wider
                            block rounded-[16px] bg-white leading-normal shadow-md transition duration-150 ease-in-out flex justify-center items-center
                            hover:bg-neutral-200 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm"
          onClick={sortByTalent}>
          Sort jobs by talent
          <img src={DownArrow} alt="down" className="w-4 h-3 ml-2" />
        </button>
        <button className="col-span-1 bg-white w-full px-2 h-10 text-center rounded-[12px] text-input font-gotham-bold tracking-wider
                            block rounded-[16px] bg-white leading-normal shadow-md transition duration-150 ease-in-out flex justify-center items-center
                            hover:bg-neutral-200 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm"
          onClick={sortByClient}>
          Sort jobs by client
          <img src={DownArrow} alt="down" className="w-4 h-3 ml-2" />
        </button>
        <button className="col-span-1 bg-white w-full px-2 h-10 text-center rounded-[12px] text-input font-gotham-bold tracking-wider
                            block rounded-[16px] bg-white leading-normal shadow-md transition duration-150 ease-in-out 
                            hover:bg-neutral-200 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm"
          onClick={showAll}>Show all</button>
      </div>
      {ready && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-5 my-5">
            {jobList.map((board, bIndex) => (
              <div key={bIndex}>
                <Droppable droppableId={`${bIndex}`}>
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      <div
                        className={`bg-kanban-item rounded-t-lg shadow-md h-[108vh]
                        flex flex-col relative overflow-hidden px-5`}
                      >
                        <div className="p-4 flex items-center justify-center">
                          <span className="font-semibold text-base leading-5 text-kanban text-center">
                            {board.name}
                          </span>
                        </div>
                        <div
                          className="mt-1 overflow-y-auto overflow-x-hidden h-auto"
                          style={{ maxHeight: "calc(100vh - 50px)" }}
                        >
                          {board.items.length > 0 &&
                            board.items.map((item, iIndex) => (
                              <JobCardItem key={item._id} item={item} index={iIndex} talent={talentList.filter((talent) => talent.email === item.talent?.email)[0]}></JobCardItem>
                            ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  )
};

export default JobKanban;