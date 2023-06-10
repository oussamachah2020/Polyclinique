import React from "react";
import { Alert, Table } from "react-bootstrap";
import { getErrorMessage } from "../helpers/getErrorMessage";
import { useQuery } from "@tanstack/react-query";
import { getDoctorPastRDVS, getMedecinRDVS } from "../api/rendezvous";
import { useUserContext } from "../contexts/useUserContext";
import SingleMedecinRDVRow from "./SingleMedecinRDVRow";

const MedecinPastRDVS = () => {
  const { userToken } = useUserContext();
  const {
    data: rdvs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: () => getMedecinRDVS(userToken),
    queryKey: ["rendezvous"],
  });

  const pastRDVS = rdvs
    ? rdvs.filter((rdv) => new Date(rdv.date) < new Date())
    : undefined;

  return (
    <>
      <h3>Mes rendez-vous passés</h3>
      {isError && <Alert variant="info">{getErrorMessage(error)}</Alert>}
      {isLoading && (
        <Alert variant="info">Chargement de vos rendez-vous passés...</Alert>
      )}
      {pastRDVS &&
        (pastRDVS.length > 0 ? (
          <Table responsive striped bordered>
            <thead>
              <tr>
                <th>Date</th>
                <th>Heure</th>
                <th>Patient</th>
                <th>Telephone</th>
                <th>Facturer</th>
              </tr>
            </thead>
            <tbody>
              {pastRDVS.map((rdv) => (
                <SingleMedecinRDVRow key={rdv._id} rdv={rdv} />
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="info">Vous n'avez aucun rendez-vous à facturer</Alert>
        ))}
    </>
  );
};

export default MedecinPastRDVS;
