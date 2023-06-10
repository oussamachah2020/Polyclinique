import React, { useState } from "react";

import "../../../css/PatientLogin.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Alert from "react-bootstrap/Alert";
import { useMutation } from "@tanstack/react-query";
import { medecinLogin } from "../../api/medecin";
import { useUserContext } from "../../contexts/useUserContext";
import { getErrorMessage } from "../../helpers/getErrorMessage";
import { Helmet } from "react-helmet";

const MedecinLogin = () => {
  const [visible, setVisible] = useState(false);
  const { saveUserToken } = useUserContext();
  const navigate = useNavigate();

  const showPassword = () => (visible ? setVisible(false) : setVisible(true));
  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: (credentials) => medecinLogin(credentials),
    onSuccess: (data) => {
      console.log("login token", data);
      saveUserToken(data);
      navigate("/medecin/dashboard");
    },
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = formData;
    if (!email) return toast.info("Remplir l'email svp");
    if (!password) return toast.info("Remplir le mot de passe svp");

    mutate({ email, password });
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Polyclinique - Medecin se connecter</title>
      </Helmet>

      <div className="patient-login-page">
        <section className="forms">
          <div className="form login">
            <div className="form-content">
              <header>Connexion Medecin</header>

              <form onSubmit={handleSubmit}>
                {isError && (
                  <Alert variant="danger">{getErrorMessage(error)}</Alert>
                )}
                {/* {isSuccess && <Alert variant="success">{data}</Alert>}
              heeelooo */}
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
                    {/* {visible ? <FaEyeSlash /> : <FaEye />} */}
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
                  <button className="btn-primary" disabled={isLoading}>
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
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default MedecinLogin;
