import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL } from "../../config/config";
import { SiMinutemailer } from "react-icons/si";

const Notifications = ({
  contest,
  emailLogs,
  setEmailLogs,
  body,
  setBody,
  subject,
  setSubject,
}) => {
  const [viewEmailLogs, setViewEmailLogs] = useState(false);

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
      timeSentAt: new Date().toISOString(),
      route: "contests/sendNotification",
      authToken:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYW1hbiIsImVtYWlsIjoiYW1hbkBnbWFpbC5jb20iLCJleHAiOjE3NzI1MjE1ODV9.3-O-JVP8eaYRPtXo0q8pTDc3HY3sN91PXDGPmrbqsDo",
    };
    console.log(email);
    const response = await axios.post(baseURL, email);

    const data = {
      authToken:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYW1hbiIsImVtYWlsIjoiYW1hbkBnbWFpbC5jb20iLCJleHAiOjE3NzI1MjE1ODV9.3-O-JVP8eaYRPtXo0q8pTDc3HY3sN91PXDGPmrbqsDo",
      route: "contests/fetchEmailLogs",
      contestId: contest._id.$oid,
    };
    axios.post(baseURL, data).then((response) => {
      console.log("THis is response of emails");
      console.log(response.data.data);
      setEmailLogs(response.data.data);
    });

    console.log(response);
  };
  return (
    <section>
      <div className="flex mx-auto">
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
      </div>
      <div className="w-full pl-3 mt-4">
        <button
          onClick={() => {
            setViewEmailLogs((emailLogs) => !emailLogs);
            setTimeout(() => {
              window.scrollBy({ top: 1000, behavior: "smooth" });
            }, 200);
          }}
          className="bg-green-600 text-lg text-white px-6 py-2 rounded hover:bg-green-700 transition-colors duration-300 flex place-items-center gap-x-1 mb-5"
        >
          {viewEmailLogs ? "Hide Email History" : "View Email History"}
        </button>
        {viewEmailLogs && (
          <div
            className="flex flex-col gap-y-6 h-[80vh] overflow-y-scroll my-10"
            id="logs"
          >
            {emailLogs === null && (
              <p className="text-xl font-semibold font-mono">
                Loading Email History...
              </p>
            )}
            {emailLogs !== null && emailLogs.length === 0 && (
              <p className="text-xl font-semibold font-mono">
                No Emails to view Yet!
              </p>
            )}
            {emailLogs !== null &&
              emailLogs.length > 0 &&
              emailLogs.map(
                ({ subject, body, contestants, timeSentAt }, index) => (
                  <div
                    key={index}
                    className="border border-green-500 rounded-md p-4"
                  >
                    <p className="text-md font-semibold font-mono flex place-items-center">
                      <span className="w-[6%]">Sent On</span>
                      <span className="w-[94%] font-semibold">
                        {timeSentAt &&
                          new Date(timeSentAt.sec * 1000).toLocaleString()}
                      </span>
                    </p>
                    <p className="text-md font-semibold font-mono flex place-items-center">
                      <span className="w-[6%]">Subject:</span>
                      <span className="w-[94%] text-sm font-medium">
                        {subject}
                      </span>
                    </p>
                    <p className="text-md font-semibold font-mono flex place-items-start">
                      <span className="w-[6%]">Body:</span>
                      <span className="w-[94%] text-sm font-medium pt-1.5">
                        {body}
                      </span>
                    </p>
                    <p className="text-md font-semibold font-mono text-black mt-1">
                      Contestants at this point of time:
                    </p>
                    <div className="grid grid-cols-5 place-items-center justify-evenly mt-1">
                      {contestants.map((email, innerIndex) => (
                        <p
                          key={innerIndex}
                          className="border border-cyan-600 text-gray-700 bg-gray-300 px-5 rounded-full hover:scale-105 transition-all duration-300 cursor-pointer"
                        >
                          {email}
                        </p>
                      ))}
                    </div>
                  </div>
                )
              )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Notifications;
