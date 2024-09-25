// import React from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import { styled } from '@mui/material/styles';
// import Grid from '@mui/material/Grid'; 


// const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
//   '& .MuiDataGrid-columnHeader': {
//     backgroundColor: theme.palette.primary.main,
//     color: theme.palette.primary.contrastText,
//     fontSize: '1.5rem',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     padding: theme.spacing(1),
//   },
//   '& .MuiDataGrid-cell': {
//     backgroundColor: theme.palette.background.paper,
//     fontSize: '3rem',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     padding: theme.spacing(2),
//   },
//   '& .MuiDataGrid-root': {
//     margin: '0 auto', // Center the DataGrid horizontally
//   },
// }));

// export const VisitorLogs = ({ visitorId, updateReq, eventId, activity, scores }) => {
//   const columns = [
//     { field: 'activity', headerName: 'Activity', flex: 1, minWidth: 100 },
//     { field: 'athlete', headerName: 'Athlete', flex: 1, minWidth: 100 },
//     { field: 'score', headerName: 'Score', flex: 1, minWidth: 100 },
//   ];

//   const rows = scores.map((score, index) => ({
//     id: index,
//     activity: score.activity,
//     athlete: score.userInfo.name,
//     score: score.score,
//   }));

//   return (
//     <>
//       <StyledDataGrid
//         pagination
//         rows={rows}
//         columns={columns}
//         pageSize={5}
//         initialState={{
//           pagination: { paginationModel: { pageSize: 5 } },
//         }}
//         pageSizeOptions={[5, 10]}
//         disableColumnMenu
//         disableSelectionOnClick
//         hideFooterSelectedRowCount
//         autoHeight
//         columnBuffer={2}
//       />
//       <Grid container item md={1} sx={{ display: 'none' }}>
//         {updateReq}
//       </Grid>
//     </>
//   );
// };

// export default VisitorLogs;


import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  '& .MuiDataGrid-cell': {
    backgroundColor: theme.palette.background.paper,
    fontSize: '0.9rem',
    textAlign: 'center',
    padding: theme.spacing(1),
  },
}));

export const VisitorLogs = ({ visitorId, updateReq, eventId, activity, scores }) => {
  const columns = [
    { field: 'activity', headerName: 'Activity', flex: 1, minWidth: 100 },
    { field: 'athlete', headerName: 'Athlete', flex: 1, minWidth: 100 },
    { field: 'score', headerName: 'Score', flex: 1, minWidth: 100 },
  ];

  const rows = scores.map((score, index) => ({
    id: index,
    activity: score.activity,
    athlete: score.userInfo.name,
    score: score.score,
  }));

  return (
    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <StyledDataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableColumnMenu
        disableSelectionOnClick
        autoHeight
        sx={{ flexGrow: 1, overflow: 'auto' }}
      />
      <Grid container item md={1} sx={{ display: 'none' }}>
        {updateReq}
      </Grid>
    </Paper>
  );
};

export default VisitorLogs;