// NewsCard.js
import { React, useState } from 'react';
import { Card, Button, Collapse, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


function NewsCard({ item, openStates, handleToggle }) {
  const [isExpanded, setIsExpanded] = useState(false);
  let navigate = useNavigate();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Col>
      <Card className="shadow-sm mb-4" style={{ width: '600px', height: isExpanded ? 'auto' : '310px', overflow: 'hidden' }}>
        <Card.Img variant="top" src={item.image} style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '0 auto' }} />
        <Card.Body>
          <Card.Title onClick={() => { navigate(`/detail/${item.id}`) }} style={{ cursor: 'pointer' }}>{item.title}</Card.Title>
          <Card.Text style={{ maxHeight: isExpanded ? 'none' : '200px', overflow: isExpanded ? 'visible' : 'hidden' }}>
            {isExpanded || item.content.length <= 150 ? item.content : `${item.content.substring(0, 130)}...`}
            <br />
            {item.content.length > 130 && (
              <Button variant="link" onClick={toggleExpand}>
                {isExpanded ? '접기' : '펼쳐보기'}
              </Button>
            )}
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