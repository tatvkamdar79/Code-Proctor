import React from "react";

const CreateChallangeNavbar = ({ selection, setSelection }) => {
  const DETAILS = "DETAILS";
  const QUESTIONS = "QUESTIONS";
  const CALCULATION_FORMULA = "CALCULATION_FORMULA";
  const NOTIFICATIONS = "NOTIFICATIONS";
  const ADD_PARTICIPANTS = "ADD_PARTICIPANTS";
  const LEADERBOARD = "LEADERBOARD";

  return (
    <section className="grid grid-cols-4 lg:grid-cols-5 place-items-center gap-y-4 bg-gray-50 border border-b-0 p-4 pb-0 text-gray-500">
      <p
        className={`h-14 w-36 flex justify-center place-items-center mx-auto text-center cursor-pointer select-none rounded-t-md ${
          selection === DETAILS &&
          "border-2 border-b-0 border-gray-200 bg-white"
        }`}
        onClick={() => setSelection(DETAILS)}
      >
        Details
      </p>
      <p
        className={`h-14 w-36 flex justify-center place-items-center mx-auto text-center cursor-pointer select-none rounded-t-md ${
          selection === QUESTIONS &&
          "border-2 border-b-0 border-gray-200 bg-white"
        }`}
        onClick={() => setSelection(QUESTIONS)}
      >
        Questions
      </p>
      <p
        className={`h-14 w-36 flex justify-center place-items-center mx-auto text-center cursor-pointer select-none rounded-t-md ${
          selection === ADD_PARTICIPANTS &&
          "border-2 border-b-0 border-gray-200 bg-white"
        }`}
        onClick={() => setSelection(ADD_PARTICIPANTS)}
      >
        Add Participants
      </p>
      <p
        className={`h-14 w-36 flex justify-center place-items-center mx-auto text-center cursor-pointer select-none rounded-t-md ${
          selection === CALCULATION_FORMULA &&
          "border-2 border-b-0 border-gray-200 bg-white"
        }`}
        onClick={() => setSelection(CALCULATION_FORMULA)}
      >
        Calculation Formula
      </p>
      <p
        className={`h-14 w-36 flex justify-center place-items-center mx-auto text-center cursor-pointer select-none rounded-t-md ${
          selection === NOTIFICATIONS &&
          "border-2 border-b-0 border-gray-200 bg-white"
        }`}
        onClick={() => setSelection(NOTIFICATIONS)}
      >
        Notifications
      </p>
      <p
        className={`h-14 w-36 flex justify-center place-items-center mx-auto text-center cursor-pointer select-none rounded-t-md ${
          selection === LEADERBOARD &&
          "border-2 border-b-0 border-gray-200 bg-white"
        }`}
        onClick={() => setSelection(LEADERBOARD)}
      >
        Leaderboard
      </p>
    </section>
  );
};

export default CreateChallangeNavbar;
