import React from "react";
import { Draggable } from "react-beautiful-dnd";

function JobCardItem({ item, index }) {
    return (
        <Draggable index={index} draggableId={item.id.toString()}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-4"
                >
                    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between">
                        <div className="client-name">
                            <span className="text-[8px] text-kanban font-bold">Client: {item.client}</span>
                        </div>
                        <div className="title py-2">
                            <span className="text-[12px] md:text-[14px] text-kanban font-semibold kanban-title-leading tracking-wide">{item.title}</span>
                        </div>
                        <div className="w-full pb-2">
                            <div className="text-success text-[11px] font-semibold flex items-center">
                                <span className="mr-2">Due Date: {item.dueDate}</span>
                                <div>
                                    <div className="w-2 h-2 bg-success rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center w-full">
                            <div className="mr-2 w-14">
                                <img src={item.avatar} alt={item.userName} className="w-7 h-7 rounded-full" />
                            </div>
                            <div className="flex flex-col justify-between w-full">
                                <div className="font-semibold text-[8px] leading-5 text-kanban">{item.userName}</div>
                                <div className="w-full h-1" style={{ backgroundColor: item.color }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}

export default JobCardItem;
