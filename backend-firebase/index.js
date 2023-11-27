//Node .
// Runs on http://localhost:8080
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const cors = require("cors");
const app = express();
app.use(cors());
const PORT = 8080;
var admin = require("firebase-admin");

var serviceAccount = {
  type: "service_account",
  project_id: "cocomelon-630ed",
  private_key_id: "d53982c360a37a2845dde5d8bfefac0149d18f8d",
  private_key: process.env.COCOMELON_KEY.replace(/\\n/gm, "\n"),
  client_email:
    "firebase-adminsdk-6nb2o@cocomelon-630ed.iam.gserviceaccount.com",
  client_id: "107568553589744365744",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6nb2o%40cocomelon-630ed.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cocomelon-630ed-default-rtdb.firebaseio.com",
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(express.json()); // or app.use(bodyParser.json()); for older versions of Express

function parseJSONOrString(input) {
  if (typeof input === "string") {
    try {
      return JSON.parse(input); // Attempt to parse the input as JSON
    } catch (error) {
      return input; // Parsing failed, return the original string
    }
  }
  return input; // Return as-is if it's already a parsed object
}

// post http://localhost:8080/signUp with body {idToken: <idToken>, accountType: <accountType>}
app.post("/signUp", (req, response) => {
  if (!req.body.idToken) {
    response.status(400).send("No idToken provided");
    return;
  }

  if (
    !req.body.accountType &&
    req.body.accountType != "deliverer" &&
    req.body.accountType != "client"
  ) {
    response.status(400).send("Invalid account type");
    return;
  }
  const idToken = req.body.idToken;
  const accountType = req.body.accountType;
  console.log("inside initializeUser");

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      const userUid = decodedToken.uid;
      console.log("User id: " + userUid);

      admin
        .database()
        .ref(`userValues/${userUid}`)
        .once("value", (snapshot) => {
          if (snapshot.exists()) {
            // User already exists
            console.log("User already exists");
            response.status(400).send("User already exists");
            return;
          } else {
            // User does not exist, initialize values
            console.log("User does not exist, initialize values");
            admin
              .database()
              .ref(`userValues/${userUid}`)
              .set({
                accountType: accountType,
                owedBalance: 0,
              })
              .then(() => {
                response.status(200).send({
                  message: "User initialized successfully",
                  userValues: {
                    accountType: accountType,
                    owedBalance: 0,
                  },
                });
              });
          }
        })
        .catch((error) => {
          console.log("Error initializing user: " + error);
          response.status(400).send("Error initializing user: " + error);
        });
    })
    .catch((error) => {
      console.log("Error verifying token: " + error);
      response.status(400).send("Error verifying token: " + error);
    });
});

app.post("/login", (req, response) => {
  if (!req.body.idToken) {
    response.status(400).send("No idToken provided");
    return;
  }
  const idToken = req.body.idToken;

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      const userUid = decodedToken.uid;
      console.log("User id: " + userUid);

      admin
        .database()
        .ref(`userValues/${userUid}`)
        .once("value", (snapshot) => {
          if (snapshot.exists()) {
            // User already exists
            console.log("User exists, return user values");
            response.status(200).send({
              message: "User logged in successfully",
              userValues: snapshot.val(),
            });
            return;
          } else {
            // User already exists
            console.log("Use does not exist, please sign up");
            response.status(400).send("User does not exist, please sign up");
            return;
          }
        })
        .catch((error) => {
          console.log("Error initializing user: " + error);
          response.status(400).send("Error initializing user: " + error);
        });
    })
    .catch((error) => {
      console.log("Error verifying token: " + error);
      response.status(400).send("Error verifying token: " + error);
    });
});

app.post("/requestForDelivery", (req, response) => {
  if (!req.body.idToken) {
    response.status(400).send("No idToken provided");
    return;
  }
  if (!req.body.requestJson) {
    response.status(400).send("No requestJson provided");
    return;
  }
  const idToken = req.body.idToken;
  const requestJson = req.body.requestJson;

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      const userUid = decodedToken.uid;
      console.log("User id: " + userUid);
      const requestId = uuidv4();
      console.log("Request id: " + requestId);
      admin
        .database()
        .ref(`userValues/${userUid}`)
        .once("value", (snapshot) => {
          if (snapshot.exists()) {
            // User already exists
            const userValues = parseJSONOrString(snapshot.val());
            console.log("User exists, add request");

            // add request to requests table
            admin
              .database()
              .ref(`requests/${requestId}`)
              .set({
                requestJson: requestJson,
                userUid: userUid,
                accountType: userValues.accountType,
                status: "pending",
              })
              .then(() => {
                // add request to user's requests table
                console.log("Request added successfully");
                console.log("Add request to user's requests table");
                admin
                  .database()
                  .ref(`userValues/${userUid}/requests/${requestId}`)
                  .set({
                    requestJson: requestJson,
                    status: "pending",
                  });

                response.status(200).send({
                  message: "Request added successfully",
                  requestId: requestId,
                });
              })
              .catch((error) => {
                console.log("Error adding request: " + error);
                response.status(400).send("Error adding request: " + error);
              });
          } else {
            // User already exists
            console.log("Use does not exist, please sign up");
            response.status(400).send("User does not exist, please sign up");
            return;
          }
        })
        .catch((error) => {
          console.log("Error initializing user: " + error);
          response.status(400).send("Error initializing user: " + error);
        });
    })
    .catch((error) => {
      console.log("Error verifying token: " + error);
      response.status(400).send("Error verifying token: " + error);
    });
});

app.post("/creditCardPayment", (req, response) => {
  if (!req.body.idToken) {
    response.status(400).send("No idToken provided");
    return;
  }
  if (!req.body.creditCardInfo) {
    response.status(400).send("No credit card info provided");
    return;
  }
  if (!req.body.requestPrice) {
    response.status(400).send("No credit card info provided");
    return;
  }
  const idToken = req.body.idToken;
  const creditCardInfo = req.body.creditCardInfo;
  const requestPrice = req.body.requestPrice;

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      const userUid = decodedToken.uid;
      console.log("User id: " + userUid);
      admin
        .database()
        .ref(`userValues/${userUid}`)
        .once("value", (snapshot) => {
          if (snapshot.exists()) {
            // User already exists
            const userValues = parseJSONOrString(snapshot.val());
            const owedBalanceInit = userValues.owedBalance;
            console.log(
              "User exists, add credit card info and increment owedBalance"
            );

            // add credit card info to user's credit card info table
            admin
              .database()
              .ref(`userValues/${userUid}/creditCardInfo`)
              .set(creditCardInfo)
              .then(() => {
                console.log(owedBalanceInit);
                // increment owedBalance
                console.log("Credit card info added successfully");
                console.log("Increment owedBalance");
                const owedBalance = owedBalanceInit + parseInt(requestPrice);
                admin
                  .database()
                  .ref(`userValues/${userUid}/owedBalance`)
                  .set(owedBalance);

                response.status(200).send({
                  message: "Credit card info added successfully",
                  owedBalance: owedBalance,
                });
              })
              .catch((error) => {
                console.log("Error adding credit card info: " + error);
                response
                  .status(400)
                  .send("Error adding credit card info: " + error);
              });
          } else {
            // User already exists
            console.log("Use does not exist, please sign up");
            response.status(400).send("User does not exist, please sign up");
            return;
          }
        })
        .catch((error) => {
          console.log("Error initializing user: " + error);
          response.status(400).send("Error initializing user: " + error);
        });
    })
    .catch((error) => {
      console.log("Error verifying token: " + error);
      response.status(400).send("Error verifying token: " + error);
    });
});
