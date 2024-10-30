const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
const fs = require("fs").promises;
var nodemailer = require("nodemailer");

const ReadFile = async (filename) => {
  try {
    const data = await fs.readFile(path.join(__dirname, `${filename}.json`), "utf8");
    if (data === "") {
      return [];
    }
    const jsonArray = JSON.parse(data);
    return jsonArray;
  } catch (err) {
    console.error("Error reading file:", err);
    return null;
  }
};

async function textGenTextOnlyPrompt() {
  // Await the results of ReadFile
  const technicians = await ReadFile("technicianinfo");
  const contracts = await ReadFile("contracts");

  if (!technicians || !contracts) {
    console.error("Failed to read technicians or contracts.");
    return;
  }

  console.log("The Answer:");
  console.log("--------------------------------");

  const genAI = new GoogleGenerativeAI("AIzaSyAcRpLHKvOtrG9wd8Np8HjZVG-T5KtNz34");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Here is the actual JSON data of technicians: ${JSON.stringify(
    technicians
  )} and contracts: ${JSON.stringify(
    contracts
  )}. Using the provided data, assign the most suitable technician to each contract, ensuring the following rules are strictly adhered to:

    1. Job Duration: Each job requires exactly one full day.
    2. Daily Limit: Assign each technician only once per day; no technician should have more than one job per calendar day. Don't assign the same technician to 2 or more jobs on the same startDate
    3. Location Availability: Schedule technicians only in locations where they are available on a date where they have'nt been scheduled.
  Return the final result strictly in the specified JSON format below, containing only the assignment output:

  [
    {
      "contract_id": "<contract_id>",
      "clientName": "<clientName>",
      "clientSurname": "<clientSurname>",
      "clientEmail": "<clientEmail>",
      "clientPhone": "<clientPhone>",
      "typeofjob": "<typeofjob>",
      "contracttype": "<contracttype>",
      "timePeriod": "<timePeriod>",
      "startDate": "<startDate>",
      "contractname": "<contractname>",
      "location": "<location>",
      "assigned": "<technician_name and technician_surname>",
      "finished": false,
      "accepted": false,
      "reviewed": false
    }
  ]
  Do not return a generic response, and please base the assignments only on the actual data I’ve provided. I want one thing in the response and that is the JSON output, no explanation or characters such as :"json" or backticks or grave accents etc. Only the JSON output`;

  const result = await model.generateContent(prompt);
  const assignedContracts = JSON.parse(result.response.text());

  fs.writeFile(path.join(__dirname, `contracts.json`), JSON.stringify(assignedContracts, null, 2), (err) => {
    if (err) {
      console.error("Error writing data file:", err);
      return res.status(500).json({ success: false, message: "Error writing data file." });
    }
  });
  return result.response.text();
}

const sendMail = (email) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "senproject384@gmail.com",
      pass: "ysqs tnlg swjk pjkg",
    },
  });

  var mailOptions = {
    from: "senproject384@gmail.com",
    to: `${email}`,
    subject: "Apexcare || Thank you!",
    text: `Thank you for using our services.\n\nPlease use the following link to leave a review or raise a ticket:\nhttps://apexcaresolutionsfullstackapp1-xxn0mxim.b4a.run/review?email=${encodeURIComponent(
      email
    )}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { textGenTextOnlyPrompt, sendMail };
