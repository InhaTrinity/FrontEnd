import { useState, useEffect, useRef } from 'react';
import './App.css';
import { Navbar, Container, Nav, Row, Col, Card, Form, Button, Collapse, Spinner } from 'react-bootstrap';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import data from './pages/data.js';
import Detail from './pages/Detail.js';

function App() {
  let [newsdata, setNewsData] = useState(data);
  let [selectedTopic, setSelectedTopic] = useState(null);
  let [openStates, setOpenStates] = useState({});
  let [searchQuery, setSearchQuery] = useState('');
  let [searchInput, setSearchInput] = useState('');
  let [itemsToShow, setItemsToShow] = useState(10);
  let [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const loader = useRef(null);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setItemsToShow(10); // 주제를 변경할 때 초기화
  }

  const handleMainClick = () => {
    setSelectedTopic(null);
    setSearchQuery('');
    setSearchInput('');
    setItemsToShow(10); // 메인으로 돌아갈 때 초기화
    navigate('/');
  }

  const handleToggle = (id) => {
    setOpenStates(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  }

  const handleSearch = () => {
    setLoading(true);
    setSearchQuery(searchInput);
  }

  const filteredNewsData = selectedTopic ? newsdata.filter(item => item.topic === selectedTopic) : newsdata;
  const searchedNewsData = searchQuery ? filteredNewsData.filter(item => item.title === searchQuery) : filteredNewsData;
  const currentData = searchedNewsData.slice(0, itemsToShow);

  const topics = [...new Set(data.map(item => item.topic))];

  const loadMore = () => {
    setItemsToShow(prev => prev + 10);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(process.env.REACT_APP_BACKEND_URL);
        console.log('성공', response.data);
        setNewsData(response.data);
      }
      catch (error) {
        console.error('실패?', error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    }, { threshold: 1.0 });

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader]);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [searchedNewsData]);

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

      <Container className="my-3">
        {!loading && (
          <Form className="d-flex">
            <Form.Group controlId="search" className="flex-grow-1">
              <Form.Control
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSearch} className="ms-2">검색하기</Button>
          </Form>
        )}
      </Container>

      {loading ? (
        <Container className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      ) : (
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
                <div ref={loader} />
              </Container>
            </div>
          } />
          <Route path="/detail/:id" element={<Detail newsdata={newsdata} />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      )}
    </div>
  );
}

export default App;