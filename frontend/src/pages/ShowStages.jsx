import React from "react";

const ShowStages = () => {
  return (
    <div className="w-full flex flex-col">
      <div className="w-2/3 text-center flex">
        <div className="bg-gray-200 p-4 rounded-lg">
          <h2 className="text-xl mb-2">Online Assessment</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
      <div className="w-2/3 text-center place-self-end">
        <div className=" bg-gray-200 p-4 rounded-lg">
          <h2 className="text-xl mb-2">Interview</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
      <div className="w-2/3">
        <div className="bg-gray-200 p-4 rounded-lg">
          <h2 className="text-xl mb-2">Offer Letter</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
    </div>
  );
};

export default ShowStages;
