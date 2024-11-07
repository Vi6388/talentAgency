import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import EstimateCardItem from "../../Component/EstimateCardItem";
import { EstimateApi } from "../../apis/EstimateApi";
import { toast, ToastContainer } from "react-toastify";
import { estimageStatusList } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { store } from "../../redux/store";
import { CHANGE_IS_LOADING } from "../../redux/actionTypes";
import { TalentApi } from "../../apis/TalentApi";

const EstimateKanban = () => {
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const [estimateList, setEstimateList] = useState([]);
  const [talentList, setTalentList] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReady(true);
    }

    store.dispatch({ type: CHANGE_IS_LOADING, payload: true });
    EstimateApi.list().then((res) => {
      if (res.data.status === 200) {
        const result = estimageStatusList.map(status => ({
          name: status.name,
          items: res.data.data.filter(item => item.jobStatus === status.statusIndex),
          sort: status.statusIndex
        })).sort((a, b) => a.sort - b.sort);
        setEstimateList(result)
      }
      store.dispatch({ type: CHANGE_IS_LOADING, payload: false });
    });

    TalentApi.getTalentList().then((res) => {
      if (res.data.status === 200) {
        setTalentList(res.data.data);
      }
    });
  }, []);

  const onDragEnd = (re) => {
    if (!re.destination) return;
    let newBoardData = estimateList;
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
    const job = estimateList?.filter((item, index) => index === parseInt(re.destination.droppableId))[0]?.items[0] || [];
    if (job) {
      const jobStatus = re.destination.droppableId + 1;
      EstimateApi.updateJobEstimateById(job._id, { jobStatus: jobStatus }).then((res) => {
        if (res.data.status === 200) {
          setEstimateList(newBoardData);
          toast.success(res.data.message, {
            position: "top-left",
          });
        }
      })
    }
  };

  return (
    <div className="p-5 flex flex-col h-full bg-main">
      <ToastContainer />
      <div className="filter-box mb-5 w-full md:w-fit mx-auto grid grid-cols-2 sm:grid-cols-5 gap-3">
        <select className="col-span-1 sm:col-span-2 bg-white text-kanban border-none outline-none text-sm rounded-lg w-52 text-input tracking-wider
                          focus:ring-neutral-500 focus:border-neutral-100 shadow-lg block w-full p-2">
          <option>Sort jobs by talent</option>
        </select>
        <select className="col-span-1 sm:col-span-2 bg-white text-kanban border-none outline-none text-sm rounded-lg w-52 text-input tracking-wider
                          focus:ring-neutral-500 focus:border-neutral-100 shadow-lg block w-full p-2">
          <option>Sort jobs by client</option>
        </select>
        <div className="col-span-2 sm:col-span-1 flex justify-end items-center">
          <button className="bg-white w-fit sm:w-full px-4 h-10 text-center rounded-[12px] text-input tracking-wider
                            block rounded-[16px] bg-white leading-normal shadow-md transition duration-150 ease-in-out 
                            hover:bg-neutral-200 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 text-sm">Show all</button>
        </div>
      </div>

      {ready && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 my-5">
            {estimateList.map((board, bIndex) => (
              <div key={board.name}>
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
                              <EstimateCardItem key={item._id} item={item} index={iIndex} talent={talentList.filter((talent) => talent.email === item.talent?.email)[0]}></EstimateCardItem>
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

export default EstimateKanban;