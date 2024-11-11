import { useEffect, useState } from 'react';
import './App.css';
import { Navbar, Container, Nav, Row, Col } from 'react-bootstrap';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';
import data from './pages/data.js';
import Detail from './pages/Detail.js';
import axios from 'axios';

function App() {
  let [newsdata, setNewsData] = useState(data);
  let [selectedTopic, setSelectedTopic] = useState(null);
  let [currentPage, setCurrentPage] = useState(1);
  let [openStates, setOpenStates] = useState({});
  let navigate = useNavigate();

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setCurrentPage(1);
  }

  const handleMainClick = () => {
    setSelectedTopic(null);
    setCurrentPage(1);
  }

  const handleToggle = (id) => {
    setOpenStates(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  }

  const itemsPerPage = 10;
  const filteredNewsData = selectedTopic ? newsdata.filter(item => item.topic === selectedTopic) : newsdata;
  const totalPages = Math.ceil(filteredNewsData.length / itemsPerPage);
  const currentData = filteredNewsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const topics = [...new Set(data.map(item => item.topic))];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://springboot-developer-env.eba-zqkfw5p2.ap-northeast-2.elasticbeanstalk.com/');
        console.log('성공', response.data);
        setNewsData(response.data);
      }
      catch (error) {
        console.error('실패', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <Navbar collapseOnSelect expand="lg" data-bs-theme="dark" bg="dark" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} to="/" onClick={handleMainClick}>뉴스 및 여론 요약 서비스</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              {topics.map((topic, index) => (
                <Nav.Link key={index} onClick={() => handleTopicClick(topic)}>{topic}</Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={
          <div>
            <Container>
              <Row xs={1} md={2} className="g-4">
                {currentData.map((item, index) => (
                  <Col key={index}>
                    <Card>
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
                ))}
              </Row>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Pagination>
                    <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(totalPages)].map((_, pageIndex) => (
                      <Pagination.Item key={pageIndex + 1} active={pageIndex + 1 === currentPage} onClick={() => handlePageChange(pageIndex + 1)}>
                        {pageIndex + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                  </Pagination>
                </Col>
              </Row>
            </Container>
          </div>
        } />
        <Route path="/detail/:id" element={<Detail newsdata={newsdata} />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;