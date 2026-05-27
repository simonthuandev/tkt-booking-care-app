import { useState } from "react";
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaHeartPulse } from "react-icons/fa6";
import { Link } from "react-router";
import UserDropdown from "../Common/UserDropdown";
import { selectIsAuthenticated, selectUser } from "../../store/slices/authSlice";
import { useSelector } from "react-redux";

export default function HomeNav({ scrolled }) {
  const [expanded, setExpanded] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  return (
    <Navbar
      expand="lg"
      fixed="top"
      id="mainNav"
      className={scrolled ? 'scrolled' : ''}
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container>
        {/* Brand */}
        <Link to="/" className="d-flex align-items-center gap-2">
          <div className="brand-icon">
            <FaHeartPulse />
          </div>
          <span className="brand-text">
            <span>TKT</span>
            <span>BookingCare</span>
          </span>
        </Link>

        {/* Toggle button */}
        <Navbar.Toggle aria-controls="navMenu" />

        {/* Collapsible menu */}
        <Navbar.Collapse id="navMenu">
          <Nav className="mx-auto gap-lg-1">
            {[
              { href: '#specialties', label: 'Chuyên khoa' },
              { href: '#doctors', label: 'Bác sĩ' },
              { href: '#hospitals', label: 'Bệnh viện' },
            ].map(({ href, label }) => (
              <Nav.Link
                key={href}
                href={href}
                onClick={() => setExpanded(false)}
              >
                {label}
              </Nav.Link>
            ))}
          </Nav>

          {isAuthenticated && user ? (
            <UserDropdown
              user={user}
              onClose={() => setExpanded(false)}
            />
          ) : (
            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              <Link to="/auth/login" className="nav-login">Đăng nhập</Link>
              <Link to="/specialties" className="btn btn-book-nav">Đặt lịch ngay</Link>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}