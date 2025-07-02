import React from 'react';
import { Card, CardMedia, CardContent, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card onClick={() => navigate(`/category/${category.id}`)} sx={{ cursor: 'pointer' }}>
        <CardMedia
          component="img"
          height="140"
          image={category.image}
          alt={category.name}
        />
        <CardContent>
          <Typography variant="h6">{category.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {category.description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default CategoryCard;
