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
    setSelectedTopic(topic); // 주제를 선택하면 해당 주제의 뉴스만 보여줌
    setItemsToShow(10); // 주제를 변경할 때 초기화
  }

  const handleMainClick = () => {
    setSelectedTopic(null); // 메인으로 돌아가면 모든 뉴스를 보여줌
    setSearchQuery(''); // 메인으로 돌아가면 검색어 초기화
    setSearchInput(''); // 메인으로 돌아가면 검색어 입력 초기화
    setItemsToShow(10); // 메인으로 돌아갈 때 초기화
    navigate('/');
  }

  const handleToggle = (id) => {
    setOpenStates(prevState => ({ // 펼침 상태를 토글
      ...prevState, // 기존 상태를 복사
      [id]: !prevState[id] // 해당 아이템의 펼침 상태를 반전
    }));
  }

  const handleSearch = () => {
    if (searchInput.trim() === '') {
      setSearchQuery(''); // 검색어가 없으면 검색어 초기화
      return; // 검색어가 없으면 실행하지 않음
    }
    setLoading(true); // 검색 중에는 로딩 상태를 true로 변경
    setSearchQuery(searchInput); // 검색어를 입력하면 해당 검색어가 포함된 뉴스만 보여줌
  }

  const handleDarkModeToggle = () => {
    setDarkMode(prevMode => { // 다크 모드를 토글
      const newMode = !prevMode; // 이전 모드의 반대로 변경
      localStorage.setItem('darkMode', JSON.stringify(newMode)); // 다크 모드 상태를 로컬 스토리지에 저장
      return newMode; // 변경된 모드를 반환
    });
  }

  const filteredNewsData = selectedTopic ? newsdata.filter(item => item.topic === selectedTopic) : newsdata;
  // 검색어가 포함된 뉴스만 보여줌
  const searchedNewsData = searchQuery ? filteredNewsData.filter(item => item.title.includes(searchQuery)) : filteredNewsData;
  // 보여줄 아이템 수만큼 데이터를 자름
  const currentData = searchedNewsData.slice(0, itemsToShow);
  // 자른 데이터의 주제 목록을 만듦

  const topics = [...new Set(newsdata.map(item => item.topic))]; // 중복되지 않는 주제 목록을 만듦

  const loadMore = () => {
    setItemsToShow(prev => prev + 10); // 보여줄 아이템 수를 10개씩 더 보여줌
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
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <NavBar topics={topics} handleTopicClick={handleTopicClick} handleMainClick={handleMainClick} />

      <Container className="my-3">
        {!loading && !(location.pathname.includes('/detail')) && (
          <SearchBar
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleSearch={handleSearch}
            darkMode={darkMode}
            handleDarkModeToggle={handleDarkModeToggle}
          />
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
                  {currentData.length > 0 ? (
                    currentData.map((item, index) => (
                      <NewsCard key={index} item={item} openStates={openStates} handleToggle={handleToggle} />
                    ))
                  ) : (
                    <div className="text-center w-100">검색결과가 없습니다</div>
                  )}
                </Row>
                <div ref={loader} />
              </Container>
            </div>
          } />
          <Route path="/detail/:id" element={<Detail newsdata={newsdata} darkMode={darkMode} />} />
          <Route path="/bookmarks" element={<Bookmark darkMode={darkMode} />} />
          <Route path="/topic/:topicName" element={
            <div>
              <Container>
                <Row xs={1} md={2} className="g-4">
                  {searchedNewsData.length > 0 ? (
                    searchedNewsData.map((item, index) => (
                      <NewsCard key={index} item={item} openStates={openStates} handleToggle={handleToggle} />
                    ))
                  ) : (
                    <div className="text-center w-100">선택한 주제의 뉴스가 없습니다</div>
                  )}
                </Row>
                <div ref={loader} />
              </Container>
            </div>
          } />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      )}
    </div>
  );
}

export default App;
