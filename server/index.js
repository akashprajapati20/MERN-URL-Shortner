const express = require("express");
const router = require('./routes/router');
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const cors = require('cors')

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/url-shortner").then(() =>
  console.log("Mongodb connected")
).catch(()=>{console.log("not connected")});

app.use(express.json());
//frontend and backend dono alg alg port pr run honge is liye cors ki jarurat h
app.use(cors());
app.use(router);
app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  if(entry){

    res.redirect(entry.redirectURL);
  }
  else{
    res.json("error");
  }

  // res.status(302).location(entry.redirectURL).send();

  // res.setHeader('Location', entry.redirectURL);
  
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
