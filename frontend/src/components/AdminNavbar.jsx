import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, NavLink, Navigate, Outlet } from "react-router-dom";
import logo from "../assets/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "../contexts/useUserContext";
const AdminNavbar = () => {
  const { logout, userToken } = useUserContext();
  if (!userToken) return <Navigate to="/admin/login" />;
  return (
    <>
      <Navbar className="mt-0" bg="light" expand="lg">
        <Container>
          <Navbar.Brand
            className="d-flex align-items-center justify-content-center"
            as={Link}
            to={userToken ? "/admin/dashboard" : "/admin"}
          >
            <img src={logo} alt="logo" />
            <h4 className="ms-3 mb-0">Admin</h4>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {userToken ? (
                <>
                  <NavLink
                    className={(isActive) =>
                      "nav-link" + (isActive ? "" : " text-primary")
                    }
                    to="/admin/messages"
                  >
                    Messages de contact
                  </NavLink>
                  <NavLink
                    className={(isActive) =>
                      "nav-link" + (isActive ? "" : " text-primary")
                    }
                    to="/admin/medecins"
                  >
                    Medecins
                  </NavLink>
                  <NavLink
                    className={(isActive) =>
                      "nav-link" + (isActive ? "" : " text-primary")
                    }
                    to="/admin/patients"
                  >
                    Patients
                  </NavLink>
                  <NavLink
                    className={(isActive) =>
                      "nav-link" + (isActive ? "" : " text-primary")
                    }
                    to="/admin/rendezvous"
                  >
                    Rendez Vous
                  </NavLink>
                  <NavLink
                    className={(isActive) =>
                      "nav-link" + (isActive ? "" : " text-primary")
                    }
                    to="/admin/factures"
                  >
                    Archive des factures
                  </NavLink>

                  <NavDropdown
                    title={<FontAwesomeIcon icon={faUserCircle} />}
                    id="basic-nav-dropdown"
                  >
                    <NavDropdown.Item as={Link} to="/admin/profile">
                      Profile
                    </NavDropdown.Item>

                    <NavDropdown.Divider />
                    <NavDropdown.Item style={{ color: "red" }} onClick={logout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <NavLink
                  className={(isActive) =>
                    "nav-link" + (isActive ? "" : " text-primary")
                  }
                  to="/admin"
                >
                  Login
                </NavLink>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};

export default AdminNavbar;
