import React, { useState, useMemo } from "react";
import { ScannerComp } from "./ScannerComp";
import { VisitorLogs } from "./VisitorLogs";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';


import Snackbar from "@mui/material/Snackbar";
import { useTracker } from "meteor/react-meteor-data";

import { ScoreCollection } from "/imports/db/TasksCollection";

export const ChildRoom = ({ spotUser, eventSetter, parentActivity }) => {
  const [pageActivity, setPageActivity] = useState("");
  const [eventId, setEventId] = useState("");
  const [activityScore, setActivityScore] = useState("");
  const [userId, setUserId] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [toastOpen, setToastOpen] = useState(false);
  const [errorText, setErrorText] = useState("");
  // const [pageFeatures, setPageFeatures] = useState(false);
  // const [userScores, setUserScores] = useState([]);
  const [renderReq, setRenderReq] = useState(false);
  const [scoreDisplay, setScoreDisplay] = useState(false);
  //step 1: get log code to work
  let pageFeatures = "";
  let pageTitle = "none";

  if (
    Session.get("activity") &&
    Session.get("eventId") &&
    Session.get("activity") != "" &&
    Session.get("eventId") != ""
  ) {
    pageFeatures = "none";
    pageTitle = "";
  } else {
    pageFeatures = "";
    pageTitle = "none";
  }

  if (parentActivity) {
    // setPageActivity(parentActivity);
  }

  const handler = Meteor.subscribe("scorelogs");
  const scores = ScoreCollection.find({}).fetch();

  const postLog = function () {
    // console.log(featureVal);
    // console.log(userId);
    let errText = "";
    if (eventId == "") {
      errText += " no event id! \n";
    }
    if (activityScore == "") {
      errText += " no score! \n";
    }
    if (userId == "") {
      errText += " no user! \n";
    }
    if (pageActivity == "") {
      errText += " no activity name name! \n";
    }
    if (errText != "") {
      setErrorText(errText);
      setToastOpen(true);
    } else {
      // dd = new Date();
      log = {
        activity: pageActivity,
        eventId: eventId,
        score: activityScore,
        // "epochTime": dd.getTime(),
        userBarcode: userId,
        userInfo: userInfo,
        // "timestamp": dd.toISOString()
      };
      Meteor.call("score.addLog", log);
      let uid = userId;
      setRenderReq(renderReq + 1);
      console.log(renderReq);
      // setUserId(userId +" ");
      // setUserId(uid);
    }
  };

  const childUserIdUpdate = ({ code, data }) => {
    setUserId(code);
    setUserInfo(data);
    console.log(data);
    console.log(userInfo);
    console.log(userId, userInfo);
    if (spotUser) {
      spotUser({ data: data });
    }
  };
  const handleClose = (event) => {
    setToastOpen(false);
  };

  const lockEvent = (event) => {
    Session.set("eventId", eventId);
    Session.set("activity", parentActivity);
    eventSetter(eventId);
    setRenderReq(renderReq + 1);
    // setEventId(eventId + "");
    // setPageFeatures(true);
    pageFeatures = "none";
    // pageFeatures = "none";
    pageTitle = "";
  };

  const errorNotify = function () {};
  const userScores = useMemo(() => {
    uss = scores.filter((x) => {
      return x.eventId == eventId && x.activity == parentActivity;
    });
    console.log(scores, uss, eventId, parentActivity);
    // setRenderReq(renderReq + 1);
    return uss;
  }, [pageActivity, eventId, scores]);

  const pageFeatures2 = useMemo(() => {
    if (pageActivity && eventId) {
      return true;
    } else {
      return false;
    }
    // return scores.filter(x => {return  x.eventId == eventId && x.userBarcode == userId});
  }, [pageActivity, eventId]);
  // if (userId != '' && pageActivity != '' && eventId != '') {

  // if (uss.length > 0){
  // 	// setScoreDisplay(true);
  // 	console.log(uss);
  // 	// setUserScores(uss);

  // }
  // }

  return (
    <Grid container spacing={1}>
      {/* Event Details */}
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
          {parentActivity}
        </Typography>
      </Grid>
      
      <Grid item container xs={12} spacing={1} justifyContent="center" alignItems="center">
        <Grid item>
          <TextField
            id="eventID"
            label="Event ID"
            variant="outlined"
            size="small"
            onChange={event => setEventId(event.target.value)}
            sx={{ 
              '& .MuiInputBase-input': { 
                fontSize: '0.8rem',
                padding: '8px 10px',
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.8rem',
              },
              '& .MuiOutlinedInput-root': {
                height: '32px',
              }
            }}
          />
        </Grid>
        
        <Grid item>
          <Button 
            id="saveDeets" 
            size="small"
            onClick={lockEvent}
            variant="contained"
            sx={{ 
              fontSize: '0.8rem', 
              padding: '4px 10px',
              minWidth: '60px',
              height: '32px'
            }}
          >
            Save
          </Button>
        </Grid>
      </Grid>

      {/* Scanner and Visitor Logs */}
      <Grid item xs={12} container spacing={2}>
        {/* Scanner */}
        <Grid item xs={12} md={6}>
          <ScannerComp spotUser={childUserIdUpdate} />
        </Grid>

        {/* Visitor Logs */}
        <Grid item xs={12} md={6}>
          <VisitorLogs scores={userScores} updateReq={renderReq} />
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        message={errorText}
      />
    </Grid>
  );
};

export default ChildRoom;

{
  /* Page Title
			<Grid item container direction="row" spacing={2} sx={{ display: pageTitle }} alignItems="center">
				<Grid item md={8}>
					<Typography variant="h3" component="h3">
						{parentActivity}
					</Typography>
				</Grid>
				<Grid item md={4}>
					<Typography variant="h5" component="h5">
						{eventId}
					</Typography>
				</Grid>
			</Grid> */
}

{
  /* Activity Score Input
			<Grid item container direction="row" spacing={2}>
				<Grid item md={3}>
					<TextField
						id="activityScore"
						label="Activity Score"
						variant="standard"
						onChange={event => setActivityScore(event.target.value)}
					/>
				</Grid>
				<Grid item md={2}>
					<Button id="logData" onClick={postLog} variant="outlined">
						Log
					</Button>
				</Grid>
			</Grid> */
}

{
  /* <Grid item container direction="row" spacing={2} sx={{ display: pageFeatures }}>
				<Grid item >
					<Typography variant="h5" component="h3">
						{parentActivity}
					</Typography>
				</Grid>
				<Grid item >
					<TextField
						id="eventID"
						label="Event ID"
						variant="standard"
						onChange={event => setEventId(event.target.value)}
					/>
				</Grid>
				<Grid item>
					<Button id="saveDeets" size="small" onClick={lockEvent}>
						Save
					</Button>
				</Grid>
			</Grid> */
}




// old code above that was not left aligned 

