import React, { useState } from "react";
import { Alert, Button, Card, Col, Row } from "react-bootstrap";
import formatDate from "../helpers/formatDate";
import { useUserContext } from "../contexts/useUserContext";
import { getMedecinFutureRDVS } from "../api/rendezvous";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "../helpers/getErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import RDVCard from "./RDVCard";

const MedecinFutureRDVS = () => {
  const { userToken } = useUserContext();
  console.log("medecin token", userToken);
  const {
    data: futureRDVS,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: () => getMedecinFutureRDVS(userToken),
    queryKey: ["rendezvous", { date: "future" }],
  });

  return (
    <div>
      <h3>Mes futurs rendez-vous</h3>
      {isLoading && (
        <Alert variant="info">Chargement des rendez-vous futurs...</Alert>
      )}
      {isError && <Alert variant="danger">{getErrorMessage(error)}</Alert>}
      <div>
        <div>
          {futureRDVS &&
            (futureRDVS.length > 0 ? (
              <Row className="mt-3">
                {futureRDVS.map((rdv) => (
                  <RDVCard key={rdv._id} rdv={rdv} />
                ))}
              </Row>
            ) : (
              <Alert variant="info">
                Les rendez-vous pris apparaîtront ici
              </Alert>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MedecinFutureRDVS;
