import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


export const ScannerComp = ({spotUser}) => {
	const [camData, setCamData] = useState(0);
	const [stopStream, setStopStream] = useState(true);
	const [codeVisitor, setCodeVisitor] = useState({});
	// console.log(spotUser);

	const toggleQrReader = () => {
    // Stop the QR Reader stream (fixes issue where the browser freezes when closing the modal) and then dismiss the modal one tick later
    setStopStream(!stopStream);
    console.log(stopStream);
    // setTimeout(() => closeModal(), 0);
  }

  async function checkBarcode (barcode) {
  	console.log(barcode);
    Meteor.call('visitors.findByBarcode', barcode, function (err, res) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(res);
        if (res) {
          setCodeVisitor(res);
          spotUser({code: barcode, data: res});

        // }
          return res;
        }
      }
    });
  }

  const clearUser = function () {
		setCodeVisitor({});
		spotUser({});
	}


  // item xs={12} md={6}
	// return (
  //   <Box 
  //     sx={{ 
  //       p: 2, 
  //       m: 2,
  //       border: '1px solid black',
  //       display: 'flex',
  //       justifyContent: 'center',
  //       alignItems: 'center'
  //     }}
  //   >
  //     <Grid container spacing={2} justifyContent="center" alignItems="center">

  //       <Grid  sx={{ margin:1 }}>
  //         <BarcodeScannerComponent
  //           onUpdate={(err, result) => {
  //             if (result) {
  //               setCamData(result.text);
  //               checkBarcode(result.text);
  //             } else {
  //               setCamData("Not Found");
  //             }
  //           }}
  //         />
  //       </Grid>

  //       <Grid >
  //         <Box 
  //           sx={{ 
  //             display: 'flex', 
  //             flexDirection: 'column', 
  //             alignItems: 'center', 
  //             gap: 2 
  //           }}
  //         >
  //           <Box sx={{ p: 1 }}>
  //             <Typography variant="h5">
  //               Name: {codeVisitor.name}
  //             </Typography>
  //           </Box>

  //           <Box sx={{  p: 1 }}>
  //             <Typography variant="h5">
  //               Barcode: {codeVisitor.barcodeId}
  //             </Typography>
  //           </Box>

  //           <Box sx={{  p: 1 }}>
  //             <Button 
  //               id="clearUser" 
  //               onClick={clearUser} 
  //               variant="contained" 
  //               sx={{ width: '150px', height: '50px', fontSize: '1.2rem' }}
  //             >
  //               Clear
  //             </Button>
  //           </Box>
  //         </Box>
  //       </Grid>
  //     </Grid>
  //   </Box>
  // );

  return (
    <Box 
      sx={{ 
        p: 1, // Reduce padding
        ml: 1, // Remove margin to eliminate extra white space
        
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 1, // Less space between items
        // width: 'fit-content', // Adjust width to fit content
        // height: 'fit-content' // Adjust height to fit content
      }}
    >
      <BarcodeScannerComponent
        width={250}  // Smaller width for the scanner
        height={250} // Smaller height for the scanner
        onUpdate={(err, result) => {
          if (result) {
            setCamData(result.text);
            checkBarcode(result.text);
          } else {
            setCamData("Not Found");
          }
        }}
      />
  
      <Typography variant="h6" sx={{ mt: 1 }}>
        Name: {codeVisitor.name}
      </Typography>
  
      <Typography variant="h6" sx={{ mb: 1 }}>
        Barcode: {codeVisitor.barcodeId}
      </Typography>
  
      <Button 
        id="clearUser" 
        onClick={clearUser} 
        variant="contained" 
        sx={{ width: '120px', height: '40px', fontSize: '1rem' }}
      >
        Clear
      </Button>
    </Box>
  );
  
  
}

export default ScannerComp


// import React, { useState } from 'react';
// import Grid from '@mui/material/Grid';
// import BarcodeScannerComponent from "react-qr-barcode-scanner";
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';

// export const ScannerComp = ({ spotUser }) => {
//   const [camData, setCamData] = useState("");
//   const [stopStream, setStopStream] = useState(true);
//   const [codeVisitor, setCodeVisitor] = useState(null);

//   const toggleQrReader = () => {
//     setStopStream(!stopStream);
//     console.log(stopStream);
//   };

//   async function checkBarcode(barcode) {
//     console.log(barcode);
//     Meteor.call('visitors.findByBarcode', barcode, function (err, res) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(res);
//         if (res) {
//           setCodeVisitor(res);
//           spotUser({ code: barcode, data: res });
//           return res;
//         } else {
//           setCodeVisitor(null);
//         }
//       }
//     });
//   }

//   const clearUser = function () {
//     setCodeVisitor(null);
//     setCamData("");
//     spotUser(null);
//   };

//   return (
//     <Grid 
//       container 
//       spacing={0.5} 
//       justifyContent="center" 
//       alignItems="center" 
//       style={{ paddingTop: '20px' }}
//     >
//       <Grid item xs={12} md={10} lg={8}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={6}>
//             <BarcodeScannerComponent
//               onUpdate={(err, result) => {
//                 if (result) {
//                   setCamData(result.text);
//                   checkBarcode(result.text);
//                 } else {
//                   setCamData("Not Found");
//                 }
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Grid container direction="column" spacing={2} alignItems="center">
//               <Grid item>
//                 <Typography variant="h5">
//                   Name: {codeVisitor ? codeVisitor.name : "Not Found"}
//                 </Typography>
//               </Grid>
//               <Grid item>
//                 <Typography variant="h5">
//                   Barcode: {codeVisitor ? codeVisitor.barcodeId : "Not Found"}
//                 </Typography>
//               </Grid>
//               <Grid item>
//                 <Button 
//                   id="clearUser" 
//                   onClick={clearUser} 
//                   variant="contained" 
//                   style={{ width: '150px', height: '50px', fontSize: '1.2rem' }}
//                 >
//                   Clear
//                 </Button>
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };

// export default ScannerComp;





