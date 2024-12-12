import { useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useEffect } from "react";

function Detail({ newsdata, darkMode }) {
    let { id } = useParams();
    let item = newsdata.find(item => item.id === parseInt(id));

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

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('URL이 복사되었습니다.');
        }).catch((err) => {
            alert('URL 복사에 실패했습니다.');
        });
    }

    if (!item) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <h1>뉴스를 찾을 수 없습니다.</h1>
            </div>
        )
    }

    return (
        <div className="d-flex justify-content-around">
            <Card className="shadow-sm" style={{ width: '70%' }}>
                <Card.Img variant="top" src={item.image} alt="no image" 
                style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '0 auto' }}/>
                <Card.Body>
                    <Card.Title>{item.title}</Card.Title>
                    <Card.Text>
                        {item.content}
                        <br></br>
                        {item.opinion}
                    </Card.Text>
                    <Button variant="primary" href={item.link} target="_blank">원문 보기</Button>
                    <Button variant="secondary" onClick={handleShare} className="ms-2">공유하기</Button>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Detail;