import {
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { patientSignup } from "../../api/patient";
import { useUserContext } from "../../contexts/useUserContext";
import { getErrorMessage } from "../../helpers/getErrorMessage";
import { Helmet } from "react-helmet";

const PatientSignup = () => {
  const { saveUserToken } = useUserContext();
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    CIN: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    phone: "",
  });
  const navigate = useNavigate();

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: (patientData) => patientSignup(patientData),
    onSuccess: (token) => {
      saveUserToken(token);
      navigate("/patient/dashboard");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.email ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.CIN ||
      !formData.password ||
      !formData.phone
    )
      return toast.error("Entrer votre informations");

    if (formData.password !== formData.confirmPassword)
      return toast.error("les mots de pass ne sont pas identiques");
    mutate(formData);
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Polyclinique - Patient s'inscrire</title>
      </Helmet>
      <Container
        className="py-4 d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <Card style={{ width: 600, maxWidth: "100%" }}>
          <Card.Header>
            <Card.Title>Créer un compte</Card.Title>
          </Card.Header>
          <Card.Body>
            {isError && <Alert variant="error">{getErrorMessage(error)}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          lastName: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Col>
                <Col className="mt-2">
                  <Form.Group>
                    <Form.Label>Prenom</Form.Label>
                    <Form.Control
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          firstName: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="mt-2" lg="6">
                  <Form.Group>
                    <Form.Label>CIN</Form.Label>
                    <Form.Control
                      value={formData.CIN}
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          CIN: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Col>
                <Col className="mt-2" lg="6">
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          email: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mt-2">
                    <Form.Label>Date de naissance</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          dateOfBirth: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mt-2">
                    <Form.Label>Numero de telephone</Form.Label>
                    <Form.Control
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mt-2">
                    <Form.Label>Mot de passe</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={!visible ? "password" : "text"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            password: e.target.value,
                          }))
                        }
                      />
                      <InputGroup.Text id="basic-addon2">
                        <FontAwesomeIcon
                          onClick={() => setVisible((prev) => !prev)}
                          icon={visible ? faEyeSlash : faEye}
                          color="black"
                        />
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mt-2">
                    <Form.Label>Confirmation mot de passe</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={!visible ? "password" : "text"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            confirmPassword: e.target.value,
                          }))
                        }
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>

              <Button
                disabled={isLoading}
                className="d-block ms-auto mt-4"
                variant="success"
                type="submit"
              >
                {isLoading ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  "S'inscrire"
                )}
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer className="text-center">
            Vous avez déja un compte?
            <Link to="/patient/login" className="btn-link">
              Se connecter
            </Link>
          </Card.Footer>
        </Card>
      </Container>
    </>
  );
};

export default PatientSignup;
