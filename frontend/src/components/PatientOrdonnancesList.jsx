import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useUserContext } from "../contexts/useUserContext";
import { getPatientOrdonnances } from "../api/ordonnance";
import { Alert, Card, Col, Row } from "react-bootstrap";
import { getErrorMessage } from "../helpers/getErrorMessage";
import formatDate from "../helpers/formatDate";

const PatientOrdonnancesList = () => {
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
  return (
    <div>
      <h3>Mes ordonnances</h3>
      {isLoading && (
        <Alert variant="info">Chargement de vos ordonnances...</Alert>
      )}
      {isError && <Alert variant="danger">{getErrorMessage(error)}</Alert>}
      {ordonnances &&
        (ordonnances.length > 0 ? (
          <Row>
            {ordonnances.slice(0, 3).map((ordonnance) => (
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
        ))}
    </div>
  );
};

export default PatientOrdonnancesList;
