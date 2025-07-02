import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Category.css';

export default function Category() {
  const { city } = useParams();
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: 'ZOO PARK', image: 'zoo.jpg', slug: 'Zoo' },
    { id: 2, name: 'MUSEUM', image: 'mueseum.jpg', slug: 'Museum' },
    { id: 3, name: 'HILL STATION', image: 'hillStation.webp', slug: 'Hill Station' },
    { id: 4, name: 'THEME PARK', image: 'theme.webp', slug: 'Theme Park' },
    { id: 5, name: 'ADVENTURE PARK', image: 'Adventure.webp', slug: 'Adventure Park' },
    { id: 6, name: 'CULTURAL SITES', image: 'culturl.jpg', slug: 'Cultural Sites' },
    { id: 7, name: 'AQUARIUM', image: 'aquarium.webp', slug: 'Aquarium' },
    { id: 8, name: 'MONUMENTS', image: 'monument.webp', slug: 'Monuments' },
  ];

  const handleCategoryClick = (slug) => {
    if (city) {
      navigate(`/${city.toLowerCase()}/${slug}`);
    } else {
      toast.info('🌆 Please select a city first to explore the best experiences!', {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <Container fluid className="category-container px-0">
        <Row className="flex-nowrap overflow-auto gx-2 mx-2 py-2">
          {categories.map((category) => (
            <Col key={category.id} xs="auto" className="px-1">
              <div
                onClick={() => handleCategoryClick(category.slug)}
                className="category-btn d-flex flex-column align-items-center justify-content-center text-decoration-none"
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={`/images/${category.image}`}
                  alt={category.name}
                  className="category-icon mb-1"
                  style={{ width: '130px', height: '90px', objectFit: 'contain' }}
                />
                <span className="category-name">{category.name}</span>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
