import * as React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';


export default function Users_Loader() {
  let skeleton_users = [];

  const card_style = {
    width: '90%',
    height: '70px',
    backgroundColor: 'white',
    border: 7,
    borderColor: 'grey.500',
    marginBottom: '4px',
    display: 'flex',
  }

  const box_style1 = {
    padding: '5px 16px',
  }

  const box_style2 = {
    padding: '8px 0',
  }

  const skeleton_style = {
    bgcolor: 'grey.400'
  }

  for (let i=0; i<4; i++) {
    skeleton_users.push(
      <Grid item xs={6}>
        <Card sx={card_style}>
          {/* Avatar icon */}
          <Box sx={box_style1}>
            <Skeleton sx={skeleton_style} variant='circular' width={60} height={60} animation='pulse' />
          </Box>

          {/* User details */}
          <Box sx={box_style2}>
            <Typography variant='h5'>
              <Skeleton sx={skeleton_style} animation='pulse' width={160} />
            </Typography>

            <Typography variant='caption'>
              <Skeleton sx={skeleton_style} animation='pulse' width={100} />
            </Typography>
          </Box>
        </Card>
      </Grid>
    )
  }

  return (
    <div>
      <Grid container spacing={1}>
        {skeleton_users}
      </Grid>
    </div>
  );
}
