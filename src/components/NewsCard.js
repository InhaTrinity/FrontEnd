// NewsCard.js
import React from 'react';
import { Card, Button, Collapse, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function NewsCard({ item, openStates, handleToggle }) {
  let navigate = useNavigate();

  return (
    <Col>
      <Card className="shadow-sm mb-4">
        <Card.Img variant="top" src={item.image} style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '0 auto' }} />
        <Card.Body>
          <Card.Title onClick={() => { navigate(`/detail/${item.id}`) }} style={{ cursor: 'pointer' }}>{item.title}</Card.Title>
          <Card.Text>
            {item.content}
            <br />
            <Button onClick={() => handleToggle(item.id)}
              aria-controls={`example-collapse-text-${item.id}`}
              aria-expanded={openStates[item.id]}>
              의견보기
            </Button>
            <Collapse in={openStates[item.id]}>
              <div id={`example-collapse-text-${item.id}`}>
                {item.opinion}
              </div>
            </Collapse>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default NewsCard;