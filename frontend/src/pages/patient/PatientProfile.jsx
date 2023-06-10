import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { getDoctorProfile, updateDoctorProfile } from "../../api/medecin";
import { useUserContext } from "../../contexts/useUserContext";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../helpers/getErrorMessage";
import { useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";
import { getPatientProfile, updatePatientProfile } from "../../api/patient";

const PatientProfile = () => {
  const navigate = useNavigate();
  const { userToken } = useUserContext();
  const queryClient = useQueryClient();
  const { isLoading, isError, error, isFetching } = useQuery({
    queryFn: () => getPatientProfile(userToken),
    queryKey: ["patient"],
    onSuccess: (data) =>
      setFormData({
        ...data,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }),
    onError: (error) => console.log("error get patient", error),
  });

  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: (updateData) => updatePatientProfile(updateData, userToken),
    onSuccess: () => {
      queryClient.invalidateQueries(["patient"]);
      toast.success("Profile modifié avec success");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const [formData, setFormData] = useState(null);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone
    )
      return toast.error("Veuillez remplir les quatre entrées requises");

    if (formData.newPassword !== formData.confirmPassword)
      return toast.error(
        "Le nouveau mot de passe et la confirmation du nouveau mot de passe ne correspondent pas"
      );

    mutate(formData);
  };
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Profile</title>
      </Helmet>
      <Container
        style={{ minHeight: "100vh" }}
        className="d-flex align-items-center justify-content-center py-3"
      >
        <Card style={{ maxWidth: 500 }} className="w-100">
          <Card.Header>
            <Card.Title>Modifier votre profile</Card.Title>
          </Card.Header>
          <Form onSubmit={handleUpdateProfile}>
            <Card.Body>
              {(isLoading || isFetching) && (
                <Alert variant="info">
                  Chargement de votre informations...
                </Alert>
              )}
              {isError && (
                <Alert variant="danger">{getErrorMessage(error)}</Alert>
              )}
              {formData && (
                <>
                  <Form.Group className="my-2">
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
                  <Form.Group className="my-2">
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
                  <Form.Group className="my-2">
                    <Form.Label>Numero de telephone</Form.Label>
                    <Form.Control
                      value={formData.phone}
                      type="tel"
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                  <Form.Group className="my-2">
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
                  <Form.Group className="my-2">
                    <Form.Label>Mot de passe actuelle</Form.Label>
                    <Form.Control
                      value={formData.currentPassword}
                      type="password"
                      placeholder="Tapez votre mot de passe actuel si vous voulez le changer"
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          currentPassword: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                  {formData.currentPassword && (
                    <Form.Group className="my-2">
                      <Form.Label>Nouveau mot de passe</Form.Label>
                      <Form.Control
                        value={formData.newPassword}
                        type="password"
                        placeholder="Laisser vide pour garder le même"
                        onChange={(e) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            newPassword: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                  )}

                  {formData.newPassword && (
                    <Form.Group className="my-2">
                      <Form.Label>
                        Confirmation de nouveau mot de passe
                      </Form.Label>
                      <Form.Control
                        value={formData.confirmPassword}
                        type="password"
                        onChange={(e) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            confirmPassword: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                  )}
                </>
              )}
            </Card.Body>
            <Card.Footer className="d-flex justify-content-end">
              <Button
                onClick={() => navigate("/patient/dashboard")}
                variant="outline-secondary"
                className="me-3"
              >
                Annuler
              </Button>
              <Button variant="success" type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  "Modifier"
                )}
              </Button>
            </Card.Footer>
          </Form>
        </Card>
      </Container>
    </>
  );
};

export default PatientProfile;
