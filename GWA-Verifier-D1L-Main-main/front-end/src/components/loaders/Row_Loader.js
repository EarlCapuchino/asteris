import * as React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

// Component for rendering different types of rows
export default function Row_Loader({ type }) {
  let skeleton_records = []
  let rows

  // Set the number of rows to be rendered
  if (type === 'STUDENTS_LIST') { rows = 5 }
  else if (type === 'LOGS_LIST') { rows  = 4 }
  else { rows  = 3 }

  // Table Header
  skeleton_records.push(
    <Table_Header />
  )
  
  // Generate table rows (depending on the type)
  for (let i=0; i<rows; i++) {
    if (type == 'STUDENTS_LIST') {
      skeleton_records.push(<Student_List_Loader />)
    }

    else if (type == 'LOGS_LIST') {
      skeleton_records.push(<Logs_List_Loader />)
    }

    else if (type == 'USER_LOGS') {
      skeleton_records.push(<User_Logs_Loader />)
    }
  }

  return (
    <div>
      {skeleton_records}
    </div>
  );
}

// Component for table headers skeleton
export function Table_Header() {
  return (
    <Grid item xs={4}>
      <Typography variant='body'>
          <Skeleton
            animation='pulse'
            sx={{ bgcolor: 'grey.700', width: '93%', height: '32px', marginLeft: '20px' }}
          />
        </Typography>
    </Grid>
  )
}

// Component for the skeleton rows in the student list
function Student_List_Loader() {
  return (
    <Card sx={{
      bgcolor: 'grey.100',
      width: '100%',
      height: '30px',
      marginTop: '8px',
    }}>

      <Grid container spacing={1}>
        <Grid item xs={4}>
          <Typography variant='body'>
              <Skeleton
                animation='pulse'
                sx={{ bgcolor: 'grey.500', marginTop: '4px', width: '100%', height: '20px', marginLeft: '50px' }}
              />
            </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography variant='body'>
            <Skeleton
              animation='pulse'
              sx={{ bgcolor: 'grey.500', marginTop: '4px', width: '50%', height: '20px', marginLeft: '140px' }}
            />
          </Typography>
        </Grid>
        
        <Grid item xs={4}>
          <Typography variant='body'>
            <Skeleton
              animation='pulse'
              sx={{ bgcolor: 'grey.500', marginTop: '4px', width: '40%', height: '20px', marginLeft: '80px' }}
            />
          </Typography>
        </Grid>
      </Grid>

    </Card>
  )
}

// Component for the skeleton rows in the logs list (Logs Page of the admin)
function Logs_List_Loader() {
  return (
    <Card sx={{
      bgcolor: 'grey.100',
      width: '94%',
      height: '50px',
      marginLeft: '16px',
      marginTop: '10px',
    }}>

      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant='body'>
              <Skeleton
                animation='pulse'
                sx={{ bgcolor: 'grey.500', marginTop: '6px', width: '70%', height: '30px', marginLeft: '20px' }}
              />
            </Typography>
        </Grid>

        <Grid item xs={2}>
          <Typography variant='body'>
            <Skeleton
              animation='pulse'
              sx={{ bgcolor: 'grey.500', width: '90%', height: '46px'}}
            />
          </Typography>
        </Grid>
        
        <Grid item xs={2}>
          <Typography variant='body'>
            <Skeleton
              animation='pulse'
              sx={{ bgcolor: 'grey.500', marginTop: '6px', width: '90%', height: '30px', marginLeft: '10px' }}
            />
          </Typography>
        </Grid>

        <Grid item xs={2}>
          <Typography variant='body'>
            <Skeleton
              animation='pulse'
              sx={{ bgcolor: 'grey.500', marginTop: '6px', width: '100%', height: '30px', marginLeft: '20px' }}
            />
          </Typography>
        </Grid>

        <Grid item xs={2}>
          <Typography variant='body'>
            <Skeleton
              animation='pulse'
              sx={{ bgcolor: 'grey.500', marginTop: '6px', width: '100%', height: '30px', marginLeft: '40px' }}
            />
          </Typography>
        </Grid>
      </Grid>

    </Card>
  )
}

// Component for the skeleton rows in the logs list (Profile page)
function User_Logs_Loader() {
  return (
    <Card sx={{
      bgcolor: 'grey.100',
      width: '94%',
      height: '50px',
      marginLeft: '16px',
      marginTop: '10px',
    }}>

      <Grid container spacing={3}>
          <Grid item xs={3}>
            <Typography variant='body'>
              <Skeleton
                animation='pulse'
                sx={{ bgcolor: 'grey.500', marginLeft: '40px', width: '70%', height: '46px'}}
              />
            </Typography>
          </Grid>
          
          <Grid item xs={3}>
            <Typography variant='body'>
              <Skeleton
                animation='pulse'
                sx={{ bgcolor: 'grey.500', marginTop: '6px', width: '70%', height: '30px', marginLeft: '30px' }}
              />
            </Typography>
          </Grid>

          <Grid item xs={3}>
            <Typography variant='body'>
              <Skeleton
                animation='pulse'
                sx={{ bgcolor: 'grey.500', marginTop: '6px', width: '70%', height: '30px', marginLeft: '20px' }}
              />
            </Typography>
          </Grid>

          <Grid item xs={3}>
            <Typography variant='body'>
              <Skeleton
                animation='pulse'
                sx={{ bgcolor: 'grey.500', marginTop: '6px', width: '70%', height: '30px' }}
              />
            </Typography>

          </Grid>
      </Grid>

    </Card>
  )
}