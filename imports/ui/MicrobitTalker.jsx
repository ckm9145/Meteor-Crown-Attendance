import { Meteor } from 'meteor/meteor';
import React, { useState, useRef } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import microbit from 'microbit-web-bluetooth'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';


import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';



// import {YardMath} from './YardMath';

export const MicrobitTalker = ({act}) => {
	const [bitDevice, setBitDevice] = useState({});
	const [mbData, setMbData] = useState([]);
	const [dataField, setDataField] = useState('');
	const [pageField, setPageField] = useState('');
	const [logging, setLogging] = React.useState(false);
	const [isTestingMode, setIsTestingMode] = useState(true); 


	const stateRef = useRef();
	stateRef.current=pageField;
	// console.log(act);

	let activity = "Dash";
	let dataF = 0;
	if (act) {
		activity = act;	
	}

	let wakeLock;

	const requestWakeLock = async () => {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.onrelease = function(ev) { 
      	// console.log(ev); 
      }
      wakeLock.addEventListener('release', () => {});

    } catch (err) {  console.log(err); }
  } // requestWakeLock()
	
	const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      requestWakeLock();
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);


  // console.log(navigator.wakeLock);

	let microbitLogs = {
		"40ydstart": {"pageField": "40start", "activity": "40 yard dash"},
		"40ydstop": {"pageField": "40stop", "activity": "40 yard dash"},
		"5start": {"pageField": "5start", "activity": "5105 sprint"},
		"5post1": {"pageField": "5post1", "activity": "5105 sprint"},
		"5post2": {"pageField": "5post2", "activity": "5105 sprint"},

	}


	const uartMessage = function (event) {
		// console.log(JSON.stringify(event, null, 2));
		// console.log(JSON.stringify(event.detail, null, 2));
		// console.log(JSON.stringify(event.detail, null, 2));
		setDataField(event.detail);

		if (event.detail == "40ydstart") {
			setPageField("40start");
			activity = "40 yard dash";
		}
		else if (event.detail == "40ydstop") {
			setPageField("40stop");
			activity = "40 yard dash";
		}
		

		else if (event.detail == "dashstop") {
			setPageField("dashstop");
			activity = "Dash";
		}
		else if (event.detail == "dashstart") {
			setPageField("dashstart");
			activity = "Dash";
		}
		else if (event.detail == "agilitycross") {
			setPageField("agilitycross");
			activity = "Agility";
		}
		
		else if (event.detail == "countcross") {
			setPageField("countcross");
			activity = "Count";
		}

		else if ((event.detail).indexOf("jump") == 0) {
			console.log("spotted jump");
			console.log(event.detail);
			setPageField("jumpheight");
			activity = "Jump";
			a = (event.detail).trim();
			a = parseInt(a.split(":")[1]);

			setDataField(a);

			dataF = a;
			console.log(dataField, dataF);
		}


		else if (event.detail == "5start") {
			setPageField("5start");
			activity = "5105 sprint";
		}
		else if (event.detail == "5post1") {
			setPageField("5post1");
			activity = "5105 sprint";
		}
		else if (event.detail == "5post2") {
			setPageField("5post2");
			activity = "5105 sprint";
		}
		postData();
	}

	const buttonPress = function (event) {
		// console.log(JSON.stringify(event, null, 2));
		// console.log(dataField, pageField);
		// console.log(stateRef);

		if (event.detail == 0) {
			console.log("a press");
			if (event.type == "buttonastatechanged") {
				setDataField("a press");
			}
			else if (event.type == "buttonbstatechanged") {
				setDataField("b press");
			}
			postData()
		}
		else {
			console.log(event)
		}
		// console.log(event);
		// console.log(button);
	}

	const pageFieldChange = (event) => {
		setPageField(event.target.value);
	  };
	  
	const handleValueChange = (event) => {
		setDataField(event.target.value);
	};

    const postData = event => {
    	// console.log(dataField, pageField, dataF);
    	// console.log(stateRef.current, logging);
    	// console.log(logging);
    	
    	if (stateRef.current != "" && logging == true) {
    		console.log(activity);
    		console.log(dataField);
    		dataF = dataField;
	    	let newLog = {
					"microbitMessage": dataF,
					"pageField": stateRef.current,
					"activity": activity ///***TODO: make this dyanimc/inherited from yard math
				}
				console.log(newLog);
				Meteor.call('device.addLog', newLog);
			}
			else {
				console.log("no property");
			}
    };

    const toggleLogging = (event) => {
    	// console.log(event.target.checked);
	    setLogging(event.target.checked);
	  };

     

	async function connectBit() {
		const device = await microbit.requestMicrobit(window.navigator.bluetooth);
		// console.log(device);
		await setBitDevice(device);
		// console.log(device);
		if (device) {
			const services = await microbit.getServices(device);
      if (services.deviceInformationService) {
          // console.log(await services.deviceInformationService.readDeviceInformation());
      }
      if (services.uartService) {
          services.uartService.addEventListener("receiveText", uartMessage);
          await services.uartService.send(new Uint8Array([104, 101, 108, 108, 111, 58])); // hello:
      }

      if (services.buttonService) {
      	services.buttonService.addEventListener("buttonastatechanged", buttonPress, "a");
        services.buttonService.addEventListener("buttonbstatechanged", buttonPress, "b");
      }

		}

		// add to list here
		// 

	}

	const getInstructions = (activity) => {
		switch (activity) {
			case 'Dash':
				return "i am in dash for instructions"

			case 'Agility':
				return 'Instructions for the Agility activity';
			case 'Count':
				return "temp"
			case 'FiveTen':
				return "temp"
			case 'Jump':
				return "temp"
	
			default:
				return 'General instructions';
		}
	  };


	  return (
		<Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" p={2}>
		  {/* Toggle Button to switch views */}
		  <Button
			variant="outlined"
			onClick={() => setIsTestingMode(!isTestingMode)}
			sx={{ margin: 1, padding: '8px 16px', alignSelf: 'flex-start' }} // Align button to the left
		  >
			{isTestingMode ? 'User' : 'Testing'}
		  </Button>
	
		  {/* Conditionally render the testing components */}
		  {isTestingMode && (
			<Grid container item direction="row" spacing={2} alignItems="center" justifyContent="center">
			  <Grid item>
				<Button
				  variant="contained"
				  onClick={connectBit}
				  sx={{ margin: 1, padding: '8px 16px' }} // Adding margin and padding
				>
				  Connect
				</Button>
			  </Grid>
			  <Grid item>
				<TextField
				  id="microbitDataField"
				  label="Property"
				  variant="filled"
				  value={pageField}
				  onChange={pageFieldChange}
				  InputProps={{
					spellCheck: false,
				  }}
				/>
			  </Grid>
			  <Grid item>
				<TextField
				  id="manualDataValue"
				  label="Value"
				  variant="filled"
				  value={dataField}
				  onChange={handleValueChange}
				/>
			  </Grid>
			  <Grid item>
				<Button
				  variant="contained"
				  onClick={postData}
				  sx={{ margin: 1, padding: '8px 16px' }} // Adding margin and padding
				>
				  Post Data
				</Button>
			  </Grid>
			  <Grid item>
				<FormControlLabel
				  control={<Switch checked={logging} onChange={toggleLogging} />}
				  label={
					<Typography variant="body1" color="primary.main">
					  Toggle Logging
					</Typography>
				  }
				/>
			  </Grid>
			  <Grid item>
				<Tooltip title={getInstructions()}>
				  <HelpOutlineIcon color="primary.main" />
				</Tooltip>
			  </Grid>
			</Grid>
		  )}
		</Box>
	  );
}

export default MicrobitTalker





