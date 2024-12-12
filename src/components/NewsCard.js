//NewsCard.js
import { React, useState } from 'react';
import { Card, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function NewsCard({ item, openStates, handleToggle }) {
  const [isExpanded, setIsExpanded] = useState(false);
  let navigate = useNavigate();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Col xs={12} md={6} className="mb-4">
      <Card className="shadow-sm" style={{ height: '100%' }}>
        {item.image && (
          <Card.Img variant="top" src={item.image} style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'contain' }} />
        )}
        <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
          <Card.Title onClick={() => { navigate(`/detail/${item.id}`) }} style={{ cursor: 'pointer' }}>{item.title}</Card.Title>
          <Card.Text>
            {isExpanded || item.content.length <= 130 ? item.content : `${item.content.substring(0, 130)}...`}
            <br />
            {item.content.length > 130 && (
              <Button variant="link" onClick={toggleExpand}>
                {isExpanded ? '접기' : '자세히 보기'}
              </Button>
            )}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default NewsCard;