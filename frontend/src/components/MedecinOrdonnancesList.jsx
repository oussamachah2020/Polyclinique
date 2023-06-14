import React, { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import formatDate from "../helpers/formatDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "../contexts/useUserContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteOrdonnance, getDoctorOrdonnances } from "../api/ordonnance";
import { getErrorMessage } from "../helpers/getErrorMessage";
const MedecinOrdonnancesList = () => {
  const { userToken } = useUserContext();
  const queryClient = useQueryClient();
  // query all doctor ordonnances
  const {
    data: ordonnances,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryFn: () => getDoctorOrdonnances(userToken),
    queryKey: ["ordonnances"],
  });

  const [patientToSearch, setPatientToSearch] = useState("Tous");

  const ordonnancesToShow = ordonnances
    ? patientToSearch == "Tous"
      ? ordonnances
      : ordonnances.filter(
          (ordonnance) => ordonnance.rdv.patient._id == patientToSearch
        )
    : [];

  // delete ordonnance
  const { mutate, isLoading: isDeleting } = useMutation({
    mutationFn: (ordonnanceID) => deleteOrdonnance(ordonnanceID, userToken),
    onSuccess: () => queryClient.invalidateQueries(["ordonnances"]),
    onError: (error) => console.log("error delete", error),
  });

  return (
    <>
      {!isLoading && isFetching && <FontAwesomeIcon icon={faSpinner} spin />}
      {isLoading && (
        <Alert variant="info">Chargement de votre ordonnances...</Alert>
      )}
      {isError && <Alert variant="danger">{getErrorMessage(error)}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label className="mb-2 h5">Filtrage par patient:</Form.Label>
        <Form.Select
          value={patientToSearch}
          onChange={(e) => setPatientToSearch(e.target.value)}
        >
          <option value="Tous">Tous</option>
          {ordonnances &&
            [
              ...new Set(
                ordonnances.map((ordonnace) => ordonnace.rdv.patient._id)
              ),
            ].map((patientId) => {
              const patient = ordonnances.find(
                (ordonnace) => ordonnace.rdv.patient._id === patientId
              ).rdv.patient;
              return (
                <option key={patientId} value={patientId}>
                  {patient.firstName} {patient.lastName}
                </option>
              );
            })}
        </Form.Select>
      </Form.Group>
      {ordonnancesToShow.length > 0 ? (
        <>
          {ordonnancesToShow.map((ordonnance) => (
            <Card className="mb-4" key={ordonnance._id}>
              <Card.Header>
                <Card.Title>
                  Rendezvous: {formatDate(ordonnance.rdv.date)} avec{" "}
                  {ordonnance.rdv.patient.firstName}{" "}
                  {ordonnance.rdv.patient.lastName}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <p>{ordonnance.description}</p>
                <ul className="my-3" style={{ listStyleType: "disc" }}>
                  {ordonnance.medicaments.map((medicament) => (
                    <li key={medicament.id}>
                      <strong>{medicament.name}</strong> ,{" "}
                      {medicament.methodOfUse}
                    </li>
                  ))}
                </ul>
              </Card.Body>
              <Card.Footer className="d-flex align-items-center justify-content-between">
                <small>Date d'ordonnance: {formatDate(ordonnance.date)}</small>
                <Button
                  onClick={() => mutate(ordonnance._id)}
                  disabled={isDeleting}
                  variant="outline-warning"
                >
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    color="red"
                    style={{ cursor: "pointer" }}
                  />
                </Button>
              </Card.Footer>
            </Card>
          ))}
        </>
      ) : (
        <Alert variant="info">
          Lorsque vous prescrivez des médicaments à vos patients, ils
          s'affichent ici
        </Alert>
      )}
    </>
  );
};

export default MedecinOrdonnancesList;
