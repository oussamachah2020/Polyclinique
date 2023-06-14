import React, { useState } from "react";
import logo from "../assets/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import "../css/sidebar.css";
import {
  faMoneyBill,
  faUserCircle,
  faSignOut,
  faDashboard,
  faHospital,
  faSyringe,
  faCalendar,
  faUserNurse,
} from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "../contexts/useUserContext";
import { useQuery } from "@tanstack/react-query";
import { getPatientProfile } from "../api/patient";
import { Alert } from "react-bootstrap";
import { getErrorMessage } from "../helpers/getErrorMessage";

const Sidebar = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(true);
  const { userToken, logout } = useUserContext();
  console.log("user token", userToken);
  const navigate = useNavigate();
  if (!userToken) return <Navigate to="/" />;

  const {
    data: patient,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: () => getPatientProfile(userToken),
    queryKey: ["patient"],
  });
  return (
    <>
      <div
        className={`sidebar ${isSidebarMinimized && "close"}`}
        onMouseEnter={() => setIsSidebarMinimized(false)}
        onMouseLeave={() => setIsSidebarMinimized(true)}
      >
        <div className="logo-details">
          <Link to="/patient/dashboard">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <NavLink
              to="/patient/dashboard"
              style={({ isActive }) => {
                return {
                  backgroundColor: isActive ? "rgb(98, 98, 98)" : "transparent",
                };
              }}
            >
              <div className="i-container">
                <FontAwesomeIcon
                  className="i"
                  icon={faHospital}
                  style={{ color: "white" }}
                />
              </div>
              <span className="link_name">Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/patient/factures"
              style={({ isActive }) => {
                return {
                  backgroundColor: isActive ? "rgb(98, 98, 98)" : "transparent",
                };
              }}
            >
              <div className="i-container">
                <FontAwesomeIcon
                  className="i"
                  icon={faMoneyBill}
                  style={{ color: "white" }}
                />
              </div>
              <span className="link_name">Mes Factures</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patient/ordonnances"
              style={({ isActive }) => {
                return {
                  backgroundColor: isActive ? "rgb(98, 98, 98)" : "transparent",
                };
              }}
            >
              <div className="i-container">
                <FontAwesomeIcon
                  className="i"
                  icon={faSyringe}
                  style={{ color: "white" }}
                />
              </div>

              <span className="link_name">Mes Ordonnonces</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patient/rendezvous"
              style={({ isActive }) => {
                return {
                  backgroundColor: isActive ? "rgb(98, 98, 98)" : "transparent",
                };
              }}
            >
              <div className="i-container">
                <FontAwesomeIcon
                  className="i"
                  icon={faCalendar}
                  style={{ color: "white" }}
                />
              </div>

              <span className="link_name">Mes rendez-vous</span>
            </NavLink>
          </li>
        </ul>
        <div className="profile-details">
          <div className="profile-content">
            <FontAwesomeIcon className="profile-img" icon={faUserCircle} />
          </div>
          <div className="name-job">
            <div className="profile_name">
              {isLoading && (
                <Alert variant="info">Chargement de votre nom et prenom</Alert>
              )}
              {isError && (
                <Alert variant="error">{getErrorMessage(error)}</Alert>
              )}
              <Link to="/patient/profile">
                {patient && `${patient.firstName} ${patient.lastName}`}
              </Link>
            </div>
          </div>
          <button
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
            }}
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="i-container"
          >
            <FontAwesomeIcon
              className="i"
              icon={faSignOut}
              style={{ color: "red" }}
            />
          </button>
        </div>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </>
  );
};

export default Sidebar;
