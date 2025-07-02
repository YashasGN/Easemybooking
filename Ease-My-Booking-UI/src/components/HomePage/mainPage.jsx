import React from 'react';
import Category from '../categpories/category'
import { Outlet } from 'react-router-dom';
import Carousels from './carousel/carousel';
import PopularCard from '../popularCard/popularCard';
import LiveEvents from './liveEventsCards/liveEventsCards';

const MainPage= () => {
  return (
<>
<Category/>
<Carousels/>
<PopularCard/>
<LiveEvents/>

</>      
  );
};

export default MainPage;
