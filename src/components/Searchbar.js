// SearchBar.js
import React from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';

function SearchBar({ searchInput, setSearchInput, handleSearch, darkMode, handleDarkModeToggle }) {
  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 제출 기본 동작을 막음
    handleSearch(); // 검색 함수 호출
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="g-2">
        <Col xs={12} md={8}>
          <Form.Group controlId="search">
            <Form.Control
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={6} md={2}>
          <Button variant="primary" type="submit" className="w-100">검색하기</Button>
        </Col>
        <Col xs={6} md={2}>
          <Button variant={darkMode ? "light" : "dark"} onClick={handleDarkModeToggle} className="w-100">
            {darkMode ? "라이트 모드" : "다크 모드"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default SearchBar;