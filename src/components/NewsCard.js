//NewsCard.js
import { useEffect } from 'react';
import { React, useState } from 'react';
import { Card, Button, Collapse, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function NewsCard({ item, openStates, handleToggle }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    setIsBookmarked(bookmarks.some(bookmark => bookmark.id === item.id));
  }, [item.id]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    if (isBookmarked) {
      const newBookmarks = bookmarks.filter(bookmark => bookmark.id !== item.id);
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      setIsBookmarked(false);
    } else {
      bookmarks.push(item);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
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
            <br />
            <Button variant = {isBookmarked ? "danger" : "outline-danger"} onClick={handleBookmark}>
              {isBookmarked ? '북마크 해제' : '북마크'}
            </Button>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default NewsCard;