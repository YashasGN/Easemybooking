import React from 'react';
import { useParams } from 'react-router-dom';
import { categories } from '../../assets/data/categories';
import { Container, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';

const CategoryDetail = () => {
  const { id } = useParams();
  const category = categories.find(cat => cat.id === parseInt(id));

  if (!category) return <Typography>Category not found</Typography>;

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>{category.name}</Typography>
      <img 
        src={category.image} 
        alt={category.name} 
        style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '10px' }} 
      />
      <Typography variant="body1" sx={{ mt: 2 }}>{category.description}</Typography>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Available Places</Typography>
      <Grid container spacing={2}>
        {category.places?.map((place, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={place.image}
                alt={place.name}
              />
              <CardContent>
                <Typography variant="h6">{place.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoryDetail;
