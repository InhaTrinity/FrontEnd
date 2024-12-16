// NavBar.js
import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavBar({ topics, handleTopicClick, handleMainClick }) {
  return (
    <Navbar collapseOnSelect expand="lg" data-bs-theme="dark" bg="dark" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={handleMainClick}>뉴스 및 여론 요약 서비스</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link onClick={handleMainClick}>전체보기</Nav.Link>
            {topics.map((topic, index) => (
              <Nav.Link key={index} onClick={() => handleTopicClick(topic)}>{topic}</Nav.Link>
            ))}
            <Nav.Link as={Link} to="/bookmarks">북마크</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;