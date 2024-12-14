import { useParams, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../App.css';

function Detail({ newsdata, darkMode }) {
    let { id } = useParams();
    let navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [popupAnimation, setPopupAnimation] = useState('');
    const [popupMessage, setPopupMessage] = useState('');

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

    useEffect(() => {
        if (newsdata && newsdata.length > 0) {
            const foundItem = newsdata.find(news => news.id === parseInt(id));
            setItem(foundItem);
        }
    }, [newsdata, id]);

    useEffect(() => {
        if (!item) return;
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        setIsBookmarked(bookmarks.some(bookmark => bookmark.id === item.id));
    }, [item]);

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setPopupMessage('URL이 복사되었습니다!');
            setPopupAnimation('popup-show');
            setTimeout(() => setPopupAnimation('popup-hide'), 2500);
        }).catch(() => {
            setPopupMessage('URL 복사에 실패했습니다.');
            setPopupAnimation('popup-show');
            setTimeout(() => setPopupAnimation('popup-hide'), 2500);
        });
    }

    const handleBookmark = () => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        if (isBookmarked) {
            const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== item.id);
            localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
            setIsBookmarked(false);
        } else {
            bookmarks.push(item);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            setIsBookmarked(true);
        }
    }

    if (!item) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <h1>로딩중...</h1>
            </div>
        )
    }

    return (
        <div className="d-flex justify-content-around">
            <div className={`popup ${popupAnimation}`}>{popupMessage}</div>
            <Card className="shadow-sm" style={{ width: '70%' }}>
                <Card.Img variant="top" src={item.image} alt="no image"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '0 auto' }} />
                <Card.Body>
                    <Card.Title>{item.title}</Card.Title>
                    <Card.Text>
                        {item.content}
                        <div style={{ width: '100%', height: '1px', backgroundColor: '#ccc', margin: '10px 0' }}></div>
                        {item.opinion}
                    </Card.Text>
                    <Button variant="secondary" onClick={() => navigate(-1)} className="me-2">
                        <FontAwesomeIcon icon={faArrowLeft} /> 뒤로 가기
                    </Button>
                    <Button variant="primary" href={item.link} target="_blank">원문 보기</Button>
                    <Button variant="secondary" onClick={handleShare} className="ms-2">공유하기</Button>
                    <Button variant="link" onClick={handleBookmark} className="ms-2">
                        <FontAwesomeIcon icon={isBookmarked ? solidStar : regularStar} size="2x" />
                    </Button>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Detail;