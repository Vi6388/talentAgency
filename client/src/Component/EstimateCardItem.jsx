import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";

function EstimateCardItem({ item, index, talent }) {
  const navigate = useNavigate();

  const editJobEstimate = (id) => {
    navigate(`/estimate/edit/${id}/jobDetails`);
  }
  return (
    <Draggable index={index} draggableId={`${item._id}`}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-4"
        >
          <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between" onClick={() => editJobEstimate(item._id)}>
            <div className="client-name">
              <span className="text-[8px] text-kanban font-gotham-bold">Client: {item.contactDetails?.firstname} {item.contactDetails?.surname}</span>
            </div>
            <div className="job-title py-1.5">
              <span className="text-[12px] md:text-[14px] text-kanban font-semibold kanban-title-leading tracking-wide" title={item.jobName}>{item.jobName}</span>
            </div>
            <div className="flex flex-col lg:flex-row w-full pb-2">
              <div className="text-estimateDate text-[11px] font-semibold mr-4">
                Estimate Date: {item.startDate}
              </div>
              <div className="text-success text-[11px] font-semibold flex items-center">
                <span className="mr-2">Estimate Delieverable Due Date: {item.endDate}</span>
                <div>
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center w-full">
              <div className="w-14">
                <img src={talent?.avatar ? talent?.avatar :
                  "https://static.vecteezy.com/system/resources/previews/022/123/337/non_2x/user-icon-profile-icon-account-icon-login-sign-line-vector.jpg"
                } alt={talent?.firstname} className="w-7 h-7 rounded-full" />
              </div>
              <div className="flex flex-col justify-between w-full">
                <div className="font-semibold text-[8px] leading-5 text-kanban">{talent?.firstname} {talent?.surname}</div>
                <div className="w-full h-1" style={{ backgroundColor: talent?.highlightColor }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default EstimateCardItem;
