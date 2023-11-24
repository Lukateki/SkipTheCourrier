//Node .
// Runs on http://localhost:8080
const express = require("express");

const app = express();
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
            admin.database().ref(`userValues/${userUid}`).set({
              accountType: accountType,
              numOrders: 0,
            });
          }
        })
        .then(() => {
          response.status(200).send({
            message: "User initialized successfully",
            userValues: {
              accountType: accountType,
              numOrders: 0,
            },
          });
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
