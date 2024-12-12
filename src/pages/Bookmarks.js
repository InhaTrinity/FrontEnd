import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Bookmarks({ darkMode }) {
  const [bookmarks, setBookmarks] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    setBookmarks(savedBookmarks);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    return () => {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  if (bookmarks.length === 0) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <h1>북마크된 뉴스가 없습니다.</h1>
      </Container>
    );
  }

  return (
    <Container className="my-3">
      <Row xs={1} md={2} className="g-4">
        {bookmarks.map((item, index) => (
          <Col key={index}>
            <Card className="shadow-sm" style={{ height: '100%' }}>
              {item.image && (
                <Card.Img variant="top" src={item.image} style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'contain' }} />
              )}
              <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
                <Card.Title onClick={() => { navigate(`/detail/${item.id}`) }} style={{ cursor: 'pointer' }}>{item.title}</Card.Title>
                <Button variant="primary" onClick={() => { navigate(`/detail/${item.id}`) }}>자세히 보기</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Bookmarks;