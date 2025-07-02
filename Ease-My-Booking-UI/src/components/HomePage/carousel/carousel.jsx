import React, { useRef, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Typography, Box } from '@mui/material';
import './carousel.css';

export default function Carousels() {
  const videoRefs = useRef([]);

  const handleSlideChange = (selectedIndex) => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    const video = videoRefs.current[selectedIndex];
    if (video) {
      video.currentTime = 0;
      video.play().catch((e) => console.log("Autoplay prevented:", e));
    }
  };

  useEffect(() => {
    const handleTimeUpdate = (index) => {
      return function () {
        if (this.currentTime >= 4) {
          this.pause();
        }
      };
    };

    videoRefs.current.forEach((video, index) => {
      if (video) {
        video.addEventListener('timeupdate', handleTimeUpdate(index));
      }
    });

    return () => {
      videoRefs.current.forEach((video, index) => {
        if (video) {
          video.removeEventListener('timeupdate', handleTimeUpdate(index));
        }
      });
    };
  }, []);

  const slides = [
    {
      src: 'Dinosorus.mp4',
      title: 'Mountain Adventure',
      description: 'Experience thrilling mountain roads and breathtaking views.',
    },
    {
      src: 'gerrafe.mp4',
      title: 'Ocean Serenity',
      description: 'Relax with the calming rhythm of ocean waves.',
    },
    {
      src: 'peng.mp4',
      title: 'Urban Energy',
      description: 'Feel the pulse of the city that never sleeps.',
    },
    {
      src: 'Cheetha.mp4',
      title: 'Forest Tranquility',
      description: 'Walk through peaceful forests with golden sunlight.',
    },
  ];

  return (
    <Box sx={{ width: '100vw' }}>
      <Carousel
        interval={5000}
        pause={false}
        onSelect={handleSlideChange}
        controls={false} // remove arrows
        indicators={true}
        fade
      >
        {slides.map((slide, index) => (
          <Carousel.Item key={index}>
            <div className="video-container">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <source src={slide.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="gradient-overlay" />
              <div className="caption-box">
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  {slide.title}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#ddd', my: 2 }}>
                  {slide.description}
                </Typography>
              
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </Box>
  );
}
