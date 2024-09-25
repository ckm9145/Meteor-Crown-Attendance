import { Meteor } from 'meteor/meteor';
import React, { useState, useRef, Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import microbit from 'microbit-web-bluetooth'
import TextField from '@mui/material/TextField';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { DeviceCollection } from '/imports/db/TasksCollection';
import Button from '@mui/material/Button';

import { ChildRoom } from './ChildRoom';
import { ScannerComp } from './ScannerComp';
import { VisitorLogs } from './VisitorLogs';
import { MicrobitTalker } from './MicrobitTalker';

import ScoreboardClock from './dashscoreboard'
export const Dash = () => {
	const [speedRows, setSpeedRows] = useState([]);
	const [userInfo, setUserInfo] = useState({});
	const [eventId, setEventId] = useState("");
	const stateRef = useRef();

	stateRef.current= [0, 0, 0];
	stateRef.current[1] = userInfo;
	stateRef.current[2] = eventId;

	const childUserIdUpdate = ({data}) => {
		setUserInfo(data);
	}

	const claimEntry = function (row) {
	 	console.log(row);
	 	console.log(stateRef.current);
	 	let thisid = row.id
	 	startId = thisid.slice((thisid.indexOf("start:") + 6), thisid.indexOf("::"));
	 	stopId = thisid.slice((thisid.indexOf("stop:") + 5), );
	 	dd = new Date();
		log = { 
			"activity": "Dash", 
			"eventId": stateRef.current[2],
			"score": row.speed, 
			"logInfo": {row},
			"epochTime": dd.getTime(), 
			"userBarcode": userInfo.barcodeId,
			"userInfo": userInfo,
			"timestamp": dd.toISOString()
		};
		Meteor.call('score.addLog', log);
		Meteor.call('devlogs.claim', [startId, stopId], userInfo);
	}

	const clearLogs = function () {
	 	Meteor.call('devlogs.clearByTime', ["dashstart", "dashstop"]);
	}
	const infoTester = function () {
		console.log(eventId);
	}

	const setupStartStopTable = function (logs) {
    	let startVal = 0;
    	let stopVal = 0;
    	let rowNumber = 0;
    	let rows = [];
    	let lastStartIndex = -1;
    	let startRow = {};
    	let firstStartTime = logs.length > 0 ? logs[0].epochTime : 0; // Normalizing start time
    	
    	for (let r in logs) {
    		if (logs[r].pageField == "dashstart") {
    			lastStartIndex = r;
    			startRow = {
    				start: ((logs[r].epochTime - firstStartTime) / 1000).toFixed(2), // Start at zero
    				stop: "",
    				speed: "",
    				id: "soloStart:" + logs[r]["_id"],
    				disabled: true
    			}
    		} else if (logs[r].pageField == "dashstop") {
    			if (lastStartIndex > -1) {
    				tr = {
    					start: ((logs[lastStartIndex].epochTime - firstStartTime) / 1000).toFixed(2), // Start at zero
    					stop: ((logs[r].epochTime - firstStartTime) / 1000).toFixed(2), // Stop relative to first start
    					speed: ((logs[r].epochTime - logs[lastStartIndex].epochTime) / 1000).toFixed(2),
    					id: "start:" + logs[lastStartIndex]["_id"] + "::stop:" + logs[r]["_id"],
    					disabled: (Object.keys(stateRef.current[1]).length == 0 || stateRef.current[2] == "")
    				};
    				rows.push(tr);
    				startRow = {};
    				lastStartIndex = -1;
    			}
    		}
    	}
    	if (Object.keys(startRow).length > 0) {
    		rows.push(startRow);
    	}
    	return rows;
    }

	const columns = [
		{ 
			field: 'start', 
			headerName: 'Start',  
			minWidth: 300,
			renderCell: ({ value }) => (
				<span style={{ fontSize: '12px' }}>{value}</span> // Smaller font size
			)
		},
		{ 
			field: 'stop', 
			headerName: 'Stop',   
			minWidth: 300,
			renderCell: ({ value }) => (
				<span style={{ fontSize: '12px' }}>{value}</span> // Smaller font size
			)
		},
		{ field: 'speed', headerName: 'Speed (seconds)',  minWidth: 300 },
		{ field: 'buttons', headerName: '', minWidth:150,
			sortable: false,
		    renderCell: ({ row }) =>
		    	<Button size="small" variant="outlined" disabled={row.disabled} onClick={() => claimEntry(row)}>
	        		Claim
	      		</Button>,
		}
	];

	const { devLogs, rows } = useTracker(() => {
    	const handler = Meteor.subscribe('devicelogs');	
    	const devLogs = DeviceCollection.find({$and: [
	    	{activity: "Dash"},
    		{claimed: {$ne: true} },
    		{cleared: {$ne: true} }
		]}).fetch();
    	const rows = setupStartStopTable(devLogs);
    	return { devLogs, rows };
    });
    stateRef.current[0] = devLogs;

	return (
		<Box sx={{ p: 2, m: 2 }}> {/* Main container with outline */}
			
			<Box sx={{ p: 1, m: 1 }}> {/* Outline for MicrobitTalker */}
				<MicrobitTalker act="Dash" />
			</Box>
			
			{rows ? (
				<Box    sx={{
					
					p: 1,
					m: 1,
					width: '100%', 
					maxWidth: '100vw', 
					margin: '0 auto', 
					boxSizing: 'border-box', 
				  }}> {/* Outline for ScoreboardClock */}
					<ScoreboardClock rows={rows} columns={columns} />
				</Box>
			) : (
				<> </>
			)}
			
			{/* <Box sx={{ border: '1px solid blue', p: 1, m: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<Button variant="contained" onClick={clearLogs}>Clear</Button>
				<Button variant="outlined" onClick={infoTester}>Tester</Button>
			</Box>
			 */}
			<Box sx={{  p: 1, m: 1 }}> {/* Outline for ChildRoom */}
				<ChildRoom spotUser={childUserIdUpdate} eventSetter={setEventId} parentActivity="Dash" />
			</Box>
			
		</Box>
	)
	
}

export default Dash




