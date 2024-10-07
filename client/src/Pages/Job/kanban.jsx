import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import JobBoardData from "../../data/job_board.json";
import JobCardItem from "../../Component/JobCardItem";

const JobKanban = () => {
  const [ready, setReady] = useState(false);
  const [boardData, setBoardData] = useState(JobBoardData);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReady(true);
    }
  }, []);

  const onDragEnd = (re) => {
    if (!re.destination) return;
    let newBoardData = boardData;
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
    setBoardData(newBoardData);
  };

  return (
    <div className="p-5 flex flex-col h-full bg-main">
      <div className="filter-box mb-5 w-full md:w-fit mx-auto grid grid-cols-3 sm:grid-cols-6 gap-3">
        <input className="col-span-1 rounded-[16px] text-kanban shadow-md shadow-500 h-10 w-full tracking-wider text-sm text-center px-4 py-2
                      outline-none focus:border-[#d4d5d6] border-none placeholder:text-kanban placeholder:font-bold"
          placeholder="Show urgent jobs" type="text" />
        <select className="col-span-1 bg-white text-kanban border-none outline-none text-sm rounded-lg w-52 text-input font-bold tracking-wider
                          focus:ring-neutral-500 focus:border-neutral-100 shadow-lg block w-full p-2">
          <option>Sort jobs by talent</option>
        </select>
        <select className="col-span-1 bg-white text-kanban border-none outline-none text-sm rounded-lg w-52 text-input font-bold tracking-wider
                          focus:ring-neutral-500 focus:border-neutral-100 shadow-lg block w-full p-2">
          <option>Sort jobs by client</option>
        </select>
        <input className="col-span-2 rounded-[16px] text-sm text-input shadow-md shadow-500 h-10 w-full tracking-wider text-center px-4 py-2
                          outline-none focus:border-[#d4d5d6] border-none placeholder:text-input placeholder:font-bold"
          placeholder="Search" type="text" />
        <button className="col-span-1 bg-white w-full px-2 h-10 text-center rounded-[12px] text-input font-bold tracking-wider
                            block rounded-[16px] bg-white leading-normal shadow-md transition duration-150 ease-in-out 
                            hover:bg-neutral-200 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 
                            active:bg-neutral-100 active:shadow-lg text-sm">Show all</button>
      </div>
      {ready && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-5 my-5">
            {boardData.map((board, bIndex) => (
              <div key={board.name}>
                <Droppable droppableId={bIndex.toString()}>
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      <div
                        className={`bg-kanban-item rounded-t-lg shadow-md h-[108vh]
                        flex flex-col relative overflow-hidden px-5`}
                      >
                        <div className="p-4 flex items-center justify-center">
                          <span className="font-semibold text-base leading-5 text-kanban">
                            {board.name}
                          </span>
                        </div>
                        <div
                          className="mt-1 overflow-y-auto overflow-x-hidden h-auto"
                          style={{ maxHeight: "calc(100vh - 50px)" }}
                        >
                          {board.items.length > 0 &&
                            board.items.map((item, iIndex) => (
                              <JobCardItem key={item.id} item={item} index={iIndex}></JobCardItem>
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