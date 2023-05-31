import React from "react";

const CreateChallangeNavbar = ({ selection, setSelection }) => {
  const DETAILS = "DETAILS";
  const QUESTIONS = "QUESTIONS";
  const CALCULATION_FORMULA = "CALCULATION_FORMULA";
  const MODERATORS = "MODERATORS";
  const NOTIFICATIONS = "NOTIFICATIONS";
  const ADD_PARTICIPANTS = "ADD_PARTICIPANTS";

  return (
    <section className="grid grid-cols-4 lg:grid-cols-6 place-items-center gap-y-4 bg-gray-50 border border-b-0 p-4 pb-0 text-gray-500">
      <p
        className={`h-14 w-36 flex justify-center place-items-center mx-auto text-center cursor-pointer select-none ${
          selection === DETAILS && "border border-b-0 border-gray-600 bg-white"
        }`}
        onClick={() => setSelection(DETAILS)}
      >
        Details
      </p>
      <p
        className={`h-14 w-36 flex justify-center place-items-center mx-auto text-center cursor-pointer select-none ${
          selection === QUESTIONS &&
          "border border-b-0 border-gray-600 bg-white"
        }`}
        onClick={() => setSelection(QUESTIONS)}
      >
        Questions
      </p>
      <p
        className={`h-14 w-36 flex justify-center place-items-center mx-auto text-center cursor-pointer select-none ${
          selection === ADD_PARTICIPANTS &&
          "border border-b-0 border-gray-600 bg-white"
        }`}
        onClick={() => setSelection(ADD_PARTICIPANTS)}
      >
        Add Participants
      </p>
      <p
        className={`h-14 w-36 flex justify-center place-items-center mx-auto text-center cursor-pointer select-none ${
          selection === CALCULATION_FORMULA &&
          "border border-b-0 border-gray-600 bg-white"
        }`}
        onClick={() => setSelection(CALCULATION_FORMULA)}
      >
        Calculation Formula
      </p>
      <p
        className={`h-14 w-36 flex justify-center place-items-center mx-auto text-center cursor-pointer select-none ${
          selection === MODERATORS &&
          "border border-b-0 border-gray-600 bg-white"
        }`}
        onClick={() => setSelection(MODERATORS)}
      >
        Moderators
      </p>
      <p
        className={`h-14 w-36 flex justify-center place-items-center mx-auto text-center cursor-pointer select-none ${
          selection === NOTIFICATIONS &&
          "border border-b-0 border-gray-600 bg-white"
        }`}
        onClick={() => setSelection(NOTIFICATIONS)}
      >
        Notifications
      </p>
    </section>
  );
};

export default CreateChallangeNavbar;
