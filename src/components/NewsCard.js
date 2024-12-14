//NewsCard.js
import { React } from 'react';
import { Card, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function NewsCard({ item }) {
  let navigate = useNavigate();

  return (
    <Col xs={12} md={6} className="mb-4">
      <Card className="shadow-sm" style={{ height: '100%' }}>
        {item.image && (
          <Card.Img variant="top" src={item.image} style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'contain' }} />
        )}
        <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
          <Card.Title onClick={() => { navigate(`/detail/${item.id}`) }} style={{ cursor: 'pointer' }}>{item.title}</Card.Title>
          <Button variant="primary" onClick={() => { navigate(`/detail/${item.id}`) }} className="mt-3">
            자세히 보기</Button>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default NewsCard;