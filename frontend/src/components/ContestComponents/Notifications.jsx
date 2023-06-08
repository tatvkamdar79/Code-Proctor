import axios from "axios";
import React, { useState } from "react";
import { baseURL } from "../../config/config";
import { SiMinutemailer } from "react-icons/si";

const Notifications = ({ contest }) => {
  // console.log(contest);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  //   TODO Update timeline details and other content in sample emails dynamically
  const sampleInvitationEmail = `Dear [Contestant's Name],
        We are pleased to invite you to participate in our upcoming contest. Your exceptional skills and talent have caught our attention, and we believe you would be a valuable addition to the competition.

Contest Details:

Contest Name: [Contest Name]
Event Type: [Event Type]
Company Name: [Company Name]
Contest Start Date: [Contest Start Date]
Contest End Date: [Contest End Date]

Instructions:
[Provide any specific instructions or guidelines for the contest]

We are excited to see your performance and witness your talent in action. If you accept our invitation, please confirm your participation by replying to this email with your acceptance and any additional information required.

If you have any questions or need further clarification, please don't hesitate to reach out to us. We look forward to your positive response and the opportunity to have you as a contestant in our contest.

Best regards,

[Your Name]
[Your Position/Organization]
[Contact Information]`;
  const sampleUpdateContestTimingsEmail = `Dear [Candidate's Name],

        We hope this email finds you well. We are writing to inform you about an important update regarding the timeline for the contest in which you are participating. Please take note of the revised dates and make the necessary adjustments to your schedule:

Previous Contest Dates:

Contest Name: [Contest Name]
Original Start Date: [Original Start Date]
Original End Date: [Original End Date]
Revised Contest Dates:

New Start Date: [Revised Start Date]
New End Date: [Revised End Date]
We apologize for any inconvenience caused by this change. The adjustment is necessary to ensure a fair and successful contest experience for all participants. We appreciate your understanding and cooperation.

If you have any questions or concerns regarding the revised timeline, please feel free to reach out to us. We are here to assist you and provide any necessary information or clarification.

Thank you for your continued interest and participation in the contest. We look forward to your continued enthusiasm and outstanding performance.

Best regards,

[Your Name]
[Your Position/Organization]
[Contact Information]`;
  const loadInvitationMessage = () => {
    setBody(sampleInvitationEmail);
    setSubject("Invitation to Participate in the Contest");
    document.getElementById("body").rows = 25;
  };

  const loadUpdateContestTime = () => {
    setBody(sampleUpdateContestTimingsEmail);
    setSubject("Update: Revised Timeline for the Contest");
    document.getElementById("body").rows = 25;
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    let format = "";
    if (body === sampleInvitationEmail) {
      format = "sampleInvitationEmail";
    } else if (body === sampleUpdateContestTimingsEmail) {
      format = "sampleUpdateContestTimingsEmail";
    }
    const email = {
      contestId: contest._id["$oid"],
      subject,
      body,
      format,
      route: "contests/sendNotification",
      authToken:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYW1hbiIsImVtYWlsIjoiYW1hbkBnbWFpbC5jb20iLCJleHAiOjE3NzI1MjE1ODV9.3-O-JVP8eaYRPtXo0q8pTDc3HY3sN91PXDGPmrbqsDo",
    };
    console.log(email);
    const response = await axios.post(baseURL, email);
    console.log(response);
  };
  return (
    <section className="flex mx-auto">
      {/* Main component */}
      <div className="flex-1 px-3">
        <h2 className="text-xl font-bold mb-4">Compose Email</h2>
        <div className="bg-white p-4 border shadow-md shadow-gray-400 rounded-xl">
          <div className="flex gap-x-1 place-items-center">
            <p className="w-14 mb-2 text-sm font-semibold text-gray-700 justify-self-center place-self-center mt-2">
              To
            </p>
            <p className="block text-sm font-medium text-gray-700 border border-gray-300 rounded px-1">
              candidate@email.com
            </p>
            <p className="block font-medium text-gray-700">....</p>
          </div>
          <div className="flex place-items-center justify-start gap-x-1 my-1">
            <label
              htmlFor="subject"
              className="block text-sm font-semibold text-gray-700 w-14"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-2/3 border-gray-300 rounded-md border-2 focus:border-green-500 outline-none px-2 font-medium text-gray-800 transition-colors duration-300 ease-in-out"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="body"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Body
            </label>
            <textarea
              id="body"
              rows="4"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full border-gray-300 rounded-md border-2 focus:border-green-500 outline-none p-2 font-medium text-gray-800 transition-colors duration-300 ease-in-out"
            />
          </div>
          <div className="flex justify-between">
            <div className="flex gap-x-2">
              <button
                onClick={loadInvitationMessage}
                className="bg-cyan-600 text-lg text-white px-6 py-2 rounded hover:bg-cyan-700 transition-colors duration-300"
              >
                Load Invitation Message
              </button>
              <button
                onClick={loadUpdateContestTime}
                className="bg-cyan-600 text-lg text-white px-6 py-2 rounded hover:bg-cyan-700 transition-colors duration-300"
              >
                Load Update Contest Timings Message
              </button>
            </div>
            <button
              onClick={handleSendEmail}
              className="bg-green-600 text-lg text-white px-6 py-2 rounded hover:bg-green-700 transition-colors duration-300 flex place-items-center gap-x-1"
            >
              <p>Send</p>
              <SiMinutemailer size={27} className="inline" />
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/4 bg-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Contestant Emails</h2>
          <ul className="space-y-2 overflow-y-scroll">
            {/* Replace with your email list */}
            {contest?.contestants.map((contestant, index) => (
              <li
                className="text-orange-500 font-medium border-b border-gray-300"
                key={index}
              >
                {contestant}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Notifications;
