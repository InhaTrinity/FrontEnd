import { useState } from 'react';
import './App.css';
import { Navbar, Container, Nav } from 'react-bootstrap';
import data from './pages/data.js';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import Detail from './pages/Detail.js';
import axios from 'axios';

function App() {

  let [newsdata, setNewsData] = useState(data);
  let [query, setQuery] = useState('');
  let navigate = useNavigate();

  const handleSearch = async () => {
    const clientID = 'eLFtCBjwNEgrrufyiyF_';
    const clientSecret = '9b1HjJJgx4';

    try {
      const response = await axios.get('/v1/search/news.json', {
        params: { query: query },
        headers: {
          'X-Naver-Client-Id': clientID,
          'X-Naver-Client-Secret': clientSecret,
        },
      });
      console.log('성공', response.data.items);
      setNewsData(response.data.items);
    }
    catch (error) {
      console.log('실패', error);
    }
  };

  return (
    <div className="App">
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand onClick={() => { navigate('/') }}
            style={{ cursor: 'pointer' }}>
            <img
              src="/Main_image.jpg"
              width="50"
              height="50"
              alt="logo"
            />
            뉴스 및 여론 요약 서비스
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link onClick={() => { navigate('/') }}>home</Nav.Link>
            <Nav.Link href="#주제2">주제2</Nav.Link>
            <Nav.Link href="#주제3">주제3</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      <Routes>
        <Route path="/" element={<div>
          <div className="container">
            <div className='row'>
              {
                newsdata && newsdata.length > 0 ? (
                  newsdata.map((a, i) => {
                    return (
                      <Card key={i} title={a.title}></Card>
                    )
                  })
                ) : (
                  <div>데이터가 없습니다.</div>
                )
              }
            </div>
          </div></div>} />
        <Route path="/detail/:id" element={<Detail newsdata={newsdata} />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </div>
  );
}

function Card(props) {
  let navigate = useNavigate();

  return (
    <div className='col-md-4'>
      <h4 onClick={() => navigate(`/detail/${props.newsdata.id}`)} style={{ cursor: 'pointer' }}>
        {props.title}
      </h4>
    </div>
  );
}

export default App;