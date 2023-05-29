import React, { useState } from "react";

export default function PreTest() {
  const [email, setEmail] = useState("");
  const [agreement1, setAgreement1] = useState(false);
  const [agreement2, setAgreement2] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !agreement1 || !agreement2) {
      setError("All fields are mandatory");
      return;
    }

    // TODO: Handle form submission
    console.log("Form submitted successfully");
  };

  return (
    <div className="flex h-screen">
      <div className="w-2/5 flex flex-col items-center justify-center h-screen gap-y-16">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-center text-5xl font-bold">Welcome to</h1>
          <h1 className="text-center text-5xl font-bold">the Test</h1>
        </div>
        <div className="flex">
          <div className="mr-9">
            <h2 className="text text-[#957D89]">Test Duration</h2>
            <p className="text-2xl text-[#51495F]">30 minutes</p>
          </div>
          <div>
            <h2 className="text text-[#957D89]">No. of Questions</h2>
            <p className="text-2xl text-[#51495F]">20 questions</p>
          </div>
        </div>
      </div>
      <div className="w-3/5 bg-white overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="bg-[#F3F7F7] justify-center">
          <div className="pt-16"></div>
          <section className="pl-16 h-screen justify-center flex flex-col">
            <h1 className="text-5xl mb-5 text-[#39424E]">Instructions</h1>
            <ol className="list-decimal">
              <li className="ml-7">
                <p className="text-md mb-24 text-[#39444E]">
                  This is a sample test to help you get familiar with the
                  HackerRank test environment.
                </p>
              </li>
            </ol>
          </section>

          <section className="flex flex-col p-3 gap-y-3 pl-12 h-screen justify-center flex flex-col">
            <h1 className="text-[#39424E] w-5/6 ml-2 text-5xl">Questions</h1>
            <div className="flex flex-col ml-2 gap-y-2 w-2/3 text-[#39444E]">
              <p>
                Feel free to choose your preferred programming language from the
                list of languages supported for each question.
              </p>
              <p>There are 3 questions that are part of this test.</p>
            </div>
            <div className="flex px-10 py-5">
              <div className="w-1/5 text-[#93807B]">Q1-Q2</div>
              <div className="w-4/5">
                <h4 className="mb-2 text-xl pl-3 text-[#39424E]">
                  Coding Questions
                </h4>
                <p className="font-medium text-justify pl-3 text-[#745E6A]">
                  21 languages allowed :
                </p>
                <p className="text-justify px-4 capitalize text-[#93807B]">
                  c, cpp, cpp14, csharp, haskell, java, java15, java8,
                  javascript, lua, objectivec, perl, php, python, python3, r,
                  ruby, scala, swift
                </p>
              </div>
            </div>
          </section>
          <section className h-screen justify-center flex flex-col="">
            <div className="flex justify-center items-center h-screen">
              <form className="pl-16" onSubmit={handleSubmit}>
                <h2 className="text-5xl mb-4 text-[#39424E]">
                  Confirmation Form
                </h2>
                <p className="text-cyan-950 font-light mb-4">
                  Before we start, here is some extra information we need to
                  assess you better.
                </p>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="text-cyan-950 font-light block mb-2"
                  >
                    Email address &nbsp;<span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-2/3 px-3 py-2 border mb-2 border-gray-300 rounded-md"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <h3 className="text-lg text-cyan-950 font-light mb-7">
                    Declaration Statement{" "}
                    <span className="text-red-500">*</span>:
                  </h3>
                  <div className="flex">
                    <div>
                      <input
                        type="checkbox"
                        id="agreement1"
                        className="mr-5 mt-1 h-6 w-6 form-checkbox"
                        checked={agreement1}
                        onChange={(e) => setAgreement1(e.target.checked)}
                      />
                    </div>
                    <div>
                      <label htmlFor="agreement1" className="ml-2">
                        I agree not to copy code from any source, including
                        websites, books, or colleagues. I may refer to language
                        documentation or an IDE of my choice. I agree not to
                        copy or share HackerRank's copyrighted assessment
                        content or questions on any website or forum.
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex">
                    <div>
                      <input
                        type="checkbox"
                        id="agreement2"
                        className="mr-5 h-6 w-6 form-checkbox"
                        checked={agreement2}
                        onChange={(e) => setAgreement2(e.target.checked)}
                      />
                    </div>
                    <div>
                      <label htmlFor="agreement2" className="text-md">
                        I agree to HackerRank's Terms of Service and Privacy
                        policy.
                      </label>
                    </div>
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                >
                  Start the Test!
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
