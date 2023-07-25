import React from 'react';
import Skeleton from '@mui/material/Skeleton';

// Component for the skeleton name in the student details and user details pages
export const Name_Placeholder = () => {
  return (
    <Skeleton
        variant='rectangular'
        animation='pulse'
        width='40%'
        height='32px'
        sx={{ bgcolor: 'grey.600', marginBottom: '10px' }}
    />
  )
}

// Component for the skeleton user details in the profile page
export const User_Detail_Placeholder = ({ width, height }) => {
  return (
    <Skeleton
      variant='rectangular'
      animation='pulse'
      width={width}
      height={height}
      sx={{ bgcolor: 'grey.400' }}
    />
  )
}

// Component for skeleton fields in the student details page
export const Record_Field_Placeholder = () => {
  return (
    <Skeleton
        variant='rectangular'
        animation='pulse'
        width='60%'
        height='20px'
        sx={{ bgcolor: 'grey.400'}}
    />
  )
}

// Compononent for skeleton table
export const Table_Placeholder = () => {
  return (
    <div>
      {/* Table Headers */}
      <Skeleton
        variant='rectangular'
        animation='pulse'
        width='100%'
        height='30px'
        sx={{ bgcolor: 'grey.500', marginBottom: '10px' }}
      />
      {/* Table Body */}
      <Skeleton
        variant='rectangular'
        animation='pulse'
        width='100%'
        height='100px'
        sx={{ bgcolor: 'grey.400'}}
      />
    </div>
    
  )
}