import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useUserContext } from "../../contexts/useUserContext";
import { getPatientOrdonnances } from "../../api/ordonnance";
import { Alert, Card, Col, Container, Form, Row } from "react-bootstrap";
import { getErrorMessage } from "../../helpers/getErrorMessage";
import formatDate from "../../helpers/formatDate";
import { Helmet } from "react-helmet";

const PatientOrdonnancesPage = () => {
  const { userToken } = useUserContext();
  const {
    data: ordonnances,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: () => getPatientOrdonnances(userToken),
    queryKey: ["ordonnances"],
    onSuccess: (data) => console.log("ordonnances", data),
  });

  const [medecinToSearch, setMedecinToSearch] = useState("Tous");

  const ordonnancesToShow = ordonnances
    ? medecinToSearch == "Tous"
      ? ordonnances
      : ordonnances.filter(
          (ordonnance) => ordonnance.rdv.medecin._id == medecinToSearch
        )
    : [];

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Ordonnances</title>
      </Helmet>

      <Container className="py-3">
        <h3>Mes ordonnances</h3>
        {isLoading && (
          <Alert variant="info">Chargement de vos ordonnances...</Alert>
        )}
        {isError && <Alert variant="danger">{getErrorMessage(error)}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label className="mb-2 h5">Filtrage par medecin:</Form.Label>
          <Form.Select
            value={medecinToSearch}
            onChange={(e) => setMedecinToSearch(e.target.value)}
          >
            <option value="Tous">Tous</option>
            {ordonnances &&
              [
                ...new Set(
                  ordonnances.map((ordonnace) => ordonnace.rdv.medecin._id)
                ),
              ].map((medecinID) => {
                const medecin = ordonnances.find(
                  (ordonnace) => ordonnace.rdv.medecin._id === medecinID
                ).rdv.medecin;
                return (
                  <option key={medecinID} value={medecinID}>
                    {medecin.firstName} {medecin.lastName}
                  </option>
                );
              })}
          </Form.Select>
        </Form.Group>

        {ordonnancesToShow.length > 0 ? (
          <Row>
            {ordonnancesToShow.map((ordonnance) => (
              <Col key={ordonnance._id} xs="12" md="6" lg="4" className="my-2">
                <Card>
                  <Card.Header>
                    <Card.Title>
                      {ordonnance.rdv.medecin.firstName}{" "}
                      {ordonnance.rdv.medecin.lastName}
                    </Card.Title>
                    <small>
                      Date de rendez vous: {formatDate(ordonnance.rdv.date)}
                    </small>
                  </Card.Header>
                  <Card.Body>
                    <p>{ordonnance.description}</p>
                    <ul>
                      {ordonnance.medicaments.map((medicament) => (
                        <li key={medicament._id}>
                          <strong>{medicament.name}</strong>{" "}
                          {medicament.methodOfUse}
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                  <Card.Footer className="d-flex align-items-center justify-content-between">
                    <small>
                      Date d'ordonnance: {formatDate(ordonnance.date)}
                    </small>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="info">
            Les ordonnances de votre médecin s'afficheront ici
          </Alert>
        )}
      </Container>
    </>
  );
};

export default PatientOrdonnancesPage;
