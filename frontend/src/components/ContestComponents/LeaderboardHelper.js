export const questionsAttempted = (submissionDetails, contest) => {
  const submissionKeys = Object.keys(submissionDetails.submissions);

  const count = submissionKeys.reduce((accumulator, currentKey) => {
    const { correctSubmissions, incorrectSubmissions } =
      submissionDetails.submissions[currentKey];
    const hasSubmissions = correctSubmissions > 0 || incorrectSubmissions > 0;
    return accumulator + (hasSubmissions ? 1 : 0);
  }, 0);

  return count;
};

export const totalTimeTaken = (submissionDetails, contest) => {
  const timeSpentValues = Object.keys(submissionDetails.submissions).map(
    (q) => {
      return submissionDetails.submissions[q]["timeSpentOnQuestion"];
    }
  );

  const totalTime = timeSpentValues.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);

  const totalMilliseconds = totalTime;
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  return `${hours < 10 ? "0" + hours : hours} : ${
    minutes < 10 ? "0" + minutes : minutes
  } : ${seconds < 10 ? "0" + seconds : seconds}`;
};

export const correctSubmissions = (submissionDetails, contest) => {
  const submissionKeys = Object.keys(submissionDetails.submissions);

  const correctSubmissionsCount = submissionKeys.map((q) => {
    return submissionDetails.submissions[q]["correctSubmissions"] > 0 ? 1 : 0;
  });

  const totalCorrectSubmissions = correctSubmissionsCount.reduce(
    (accumulator, currentValue) => {
      return accumulator + currentValue;
    },
    0
  );

  return totalCorrectSubmissions;
};

export const incorrectSubmissions = (submissionDetails, contest) => {
  const submissionKeys = Object.keys(submissionDetails.submissions);

  const incorrectSubmissionsCount = submissionKeys.map((q) => {
    return submissionDetails.submissions[q]["incorrectSubmissions"] > 0 ? 1 : 0;
  });

  const totalIncorrectSubmissions = incorrectSubmissionsCount.reduce(
    (accumulator, currentValue) => {
      return accumulator + currentValue;
    },
    0
  );

  return totalIncorrectSubmissions;
};

export const getContestantScore = (submissionDetails, contest) => {
  let totalScore = 0;
  for (let question of contest.questions) {
    totalScore += question.score;
  }
  return Math.round(
    (Object.keys(submissionDetails.submissions)
      .map((q) => {
        console.log(q);
        if (submissionDetails.submissions[q]["correctSubmissions"] > 0) {
          console.log(
            q,
            "=> ",
            submissionDetails.submissions[q]["correctSubmissions"] > 0
          );
          return contest.questions.filter(
            (question) => question._id.$oid === q
          )[0].score;
        }
        return 0;
      })
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0) /
      totalScore) *
      100
  );
};
