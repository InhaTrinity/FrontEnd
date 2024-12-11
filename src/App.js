import { useState, useEffect, useRef } from 'react';
import './App.css';
import { Container, Row, Spinner } from 'react-bootstrap';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Detail from './pages/Detail.js';
import NavBar from './components/Navbar.js';
import NewsCard from './components/NewsCard.js';
import SearchBar from './components/Searchbar.js';

function App() {
  let [newsdata, setNewsData] = useState([]); // 뉴스 데이터
  let [selectedTopic, setSelectedTopic] = useState(null); // 선택된 주제
  let [openStates, setOpenStates] = useState({}); // 각 아이템의 펼침 상태
  let [searchQuery, setSearchQuery] = useState(''); // 검색어
  let [searchInput, setSearchInput] = useState(''); // 검색어 입력
  let [itemsToShow, setItemsToShow] = useState(10); // 보여줄 아이템 수, 초기값은 10
  let [loading, setLoading] = useState(false); // 로딩 상태
  let [darkMode, setDarkMode] = useState(() => {
    const saveDarkMode = localStorage.getItem('darkMode'); // 로컬 스토리지에서 다크 모드 상태를 가져옴
    return saveDarkMode ? JSON.parse(saveDarkMode) : false; // 다크 모드 상태가 있으면 가져오고, 없으면 false로 설정
  }); // 다크 모드

  let navigate = useNavigate(); // 라우터 네비게이션을 위한 변수
  const loader = useRef(null); // 무한 스크롤을 위한 로더

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
  const searchedNewsData = searchQuery ? filteredNewsData.filter(item => item.title === searchQuery) : filteredNewsData;
  // 보여줄 아이템 수만큼 데이터를 자름
  const currentData = filteredNewsData.slice(0, itemsToShow);
  // 자른 데이터의 주제 목록을 만듦

  const topics = [...new Set(newsdata.map(item => item.topic))]; // 중복되지 않는 주제 목록을 만듦

  const loadMore = () => {
    setItemsToShow(prev => prev + 10); // 보여줄 아이템 수를 10개씩 더 보여줌
  }

  useEffect(() => {
    const fetchData = async () => { // 백엔드에서 데이터를 가져옴
      setLoading(true); // 데이터를 가져올 때 로딩 상태를 true로 변경
      try {
        const response = await axios.get(process.env.REACT_APP_BACKEND_URL); // 백엔드 서버 주소
        console.log('성공', response.data); // 데이터를 가져오면 콘솔에 출력, 확인용 코드
        setNewsData(response.data); // 가져온 데이터를 newsdata에 저장
        setItemsToShow(10); // 데이터를 가져오면 보여줄 아이템 수를 초기화
      }
      catch (error) {
        console.error('실패', error); // 데이터를 가져오지 못하면 콘솔에 출력, 확인용 코드
      }
      setLoading(false); // 데이터를 가져오면 로딩 상태를 false로 변경
    };
    fetchData(); // 데이터를 가져오는 함수를 실행
  }, []);

  useEffect(() => {
    if (!newsdata.length || loading) return; // 뉴스 데이터가 없거나 로딩 중이면 실행하지 않음

    const observer = new IntersectionObserver( // 무한 스크롤을 위한 옵저버
      (entries) => { // 엔트리가 보이면
        if (entries[0].isIntersecting && !loading) { // 로딩 중이 아니면
          loadMore(); // 더 많은 데이터를 로드
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) { // 로더가 있으면
      observer.observe(loader.current); // 로더를 관찰
    }

    return () => { // 컴포넌트가 언마운트되면 로더 관찰을 중지
      if (loader.current) { // 로더가 있으면
        observer.unobserve(loader.current); // 로더 관찰을 중지
      }
    };
  }, [loader, itemsToShow, newsdata, loading]); // 로더, 보여줄 아이템 수, 뉴스 데이터, 로딩 상태가 변경될 때마다 실행

  useEffect(() => {
    if (loading) { // 로딩 중이면
      setLoading(false); // 로딩 상태를 false로 변경
    }
  }, [searchedNewsData]); // 검색된 뉴스 데이터가 변경될 때마다 실행

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <NavBar topics={topics} handleTopicClick={handleTopicClick} handleMainClick={handleMainClick} />

      <Container className="my-3">
        {!loading && (
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
                  {currentData.map((item, index) => (
                    <NewsCard key={index} item={item} openStates={openStates} handleToggle={handleToggle} />
                  ))}
                </Row>
                <div ref={loader} />
              </Container>
            </div>
          } />
          <Route path="/detail/:id" element={<Detail newsdata={newsdata} darkMode={darkMode} />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      )}
    </div>
  );
}

export default App;