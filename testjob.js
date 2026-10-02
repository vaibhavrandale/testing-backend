import axios from "axios";

const TOTAL_USERS = 1000;

const API_URL = "http://localhost:5000/api/reports/generate-pdf";

const sendRequest = async (userNumber) => {
  const startTime = Date.now();

  try {
    const response = await axios.post(API_URL, {
      email: `vaibhav.randale${userNumber}@tayproindia.com`,
      reportId: `REPORT-${String(userNumber).padStart(3, "0")}`,
    });

    const timeTaken = Date.now() - startTime;

    console.log(
      `User ${userNumber} | ` +
        `Status: ${response.status} | ` +
        `${timeTaken}ms | ` +
        `Job: ${response.data.jobId}`,
    );

    return {
      success: true,
      timeTaken,
      data: response.data,
    };
  } catch (error) {
    // ----------------------------error----------------------------
    console.log(error);
    // ----------------------------error----------------------------
    const timeTaken = Date.now() - startTime;

    console.error(
      `User ${userNumber} | FAILED | ` +
        `${timeTaken}ms | ` +
        `${error.response?.data?.message || error.response?.data?.error || error.message}`,
    );

    return {
      success: false,
      timeTaken,
      error: error.message,
    };
  }
};

const test = async () => {
  console.log(`Starting ${TOTAL_USERS} simultaneous requests...\n`);

  const startTime = Date.now();

  const results = await Promise.all(
    Array.from({ length: TOTAL_USERS }, (_, index) => sendRequest(index + 1)),
  );

  const totalTime = Date.now() - startTime;

  const successful = results.filter((result) => result.success).length;

  const failed = results.length - successful;

  const times = results.map((result) => result.timeTaken);

  const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;

  console.log("\n==============================");
  console.log("       TEST COMPLETED");
  console.log("==============================");

  console.log("Total Requests :", TOTAL_USERS);

  console.log("Successful     :", successful);

  console.log("Failed         :", failed);

  console.log("Total Time     :", `${totalTime} ms`);

  console.log("Average API Time:", `${Math.round(averageTime)} ms`);
};

test();
