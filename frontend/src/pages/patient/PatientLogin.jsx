import React, { useEffect, useState } from "react";

import "../../../css/PatientLogin.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Alert from "react-bootstrap/Alert";
import { useMutation } from "@tanstack/react-query";
import { patientLogin } from "../../api/patient";
import { useUserContext } from "../../contexts/useUserContext";
import { getErrorMessage } from "../../helpers/getErrorMessage";
import { Helmet } from "react-helmet";

function PatientLogin() {
  const [visible, setVisible] = useState(false);
  const { saveUserToken } = useUserContext();
  const navigate = useNavigate();

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: () =>
      patientLogin({ email: formData.email, password: formData.password }),
    onSuccess: (token) => {
      saveUserToken(token);
      navigate("/patient/dashboard");
    },
  });
  // const dispatch = useDispatch();

  const showPassword = () => (visible ? setVisible(false) : setVisible(true));
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.email) return toast.info("Remplir l'email svp");
    if (!formData.password) return toast.info("Remplir le mot de passe svp");
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Polyclinique - Patient se connecter</title>
      </Helmet>
      <div className="patient-login-page">
        <section className="forms">
          <div className="form login">
            <div className="form-content">
              <header>Connexion Patient</header>
              {isError && (
                <Alert variant="danger">{getErrorMessage(error)}</Alert>
              )}
              <form onSubmit={handleSubmit}>
                <div className="field input-field">
                  <input
                    type="email"
                    placeholder="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="field input-field">
                  <div className="eye-icon" onClick={showPassword}>
                    {visible ? (
                      <FontAwesomeIcon icon={faEye} />
                    ) : (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    )}
                  </div>
                  <input
                    type={!visible ? "password" : "text"}
                    placeholder="password"
                    className="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        password: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="field">
                  <button
                    onClick={() => mutate()}
                    className="btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        style={{ color: "white" }}
                      />
                    ) : (
                      "Se connecter"
                    )}
                  </button>
                </div>
              </form>
              <div className="form-link">
                <span>
                  Je n'ai pas de compte{" "}
                  <Link to="/patient/signup" className="link signup-link">
                    S'inscrire
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default PatientLogin;
