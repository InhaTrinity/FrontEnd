// SearchBar.js
import React from 'react';
import { Form, Button } from 'react-bootstrap';

function SearchBar({ searchInput, setSearchInput, handleSearch, darkMode, handleDarkModeToggle }) {
  return (
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
      <Button variant={darkMode ? "light" : "dark"} onClick={handleDarkModeToggle} className="ms-2">
        {darkMode ? "라이트 모드" : "다크 모드"}
      </Button>
    </Form>
  );
}

export default SearchBar;