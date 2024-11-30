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
                </Card.Body>
            </Card>
        </div>
    )
}

export default Detail;