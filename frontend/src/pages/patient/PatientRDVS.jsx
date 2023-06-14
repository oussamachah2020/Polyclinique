import React from "react";
import RendezvousCard from "../../components/RendezvousCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteRDV, getPatientRDVS } from "../../api/rendezvous";
import { useUserContext } from "../../contexts/useUserContext";
import { Alert, Button, Table } from "react-bootstrap";
import { getErrorMessage } from "../../helpers/getErrorMessage";
import formatDate from "../../helpers/formatDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const PatientRDVS = () => {
  const queryClient = useQueryClient();
  const { userToken } = useUserContext();
  const {
    data: rdvs,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryFn: () => getPatientRDVS(userToken),
    queryKey: ["rendezvous"],
    onSuccess: (data) => console.log("rdvs", data),
  });

  const { mutate, isLoading: isDeleting } = useMutation({
    mutationFn: (rdvID) => deleteRDV(rdvID),
    onSuccess: () => queryClient.invalidateQueries(["rendezvous"]),
  });
  const pastRDVS = rdvs
    ? rdvs
        .filter((rdv) => new Date(rdv.date) < new Date())
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    : undefined;
  const futureRDVS = rdvs
    ? rdvs.filter((rdv) => new Date(rdv.date) > new Date())
    : undefined;
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Rendez vous</title>
      </Helmet>
      <div className="p-4">
        <RendezvousCard />
        {isLoading && (
          <Alert className="my-3" variant="info">
            Chargement de vos rendez-vous...
          </Alert>
        )}
        {isError && (
          <Alert className="my-3" variant="danger">
            {getErrorMessage(error)}
          </Alert>
        )}
        {rdvs && (
          <>
            <div className="my-3">
              <h3>Mes futurs rendez-vous</h3>
              {!isLoading && isFetching && (
                <FontAwesomeIcon icon={faSpinner} spin />
              )}

              {futureRDVS &&
                (futureRDVS.length > 0 ? (
                  <Table bordered responsive>
                    <thead>
                      <tr>
                        <th>Medecin</th>
                        <th>Date de rendez-vous</th>
                        <th>Heure</th>
                        <th>Date de reservation</th>
                        <th>Annuler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {futureRDVS.map((rdv) => (
                        <tr key={rdv._id}>
                          <td>
                            {rdv.medecin.firstName} {rdv.medecin.lastName}
                          </td>
                          <td>{formatDate(rdv.date)}</td>
                          <td>{rdv.hour}</td>
                          <td>{formatDate(rdv.createdAt)}</td>
                          <td>
                            <Button
                              variant="outline-warning"
                              onClick={() => mutate(rdv._id)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                              ) : (
                                "Annuler"
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">
                    Vos futurs rendez-vous seront listés ici
                  </Alert>
                ))}
            </div>
            <div className="my-3">
              <h3>Mes rendez-vous passés</h3>

              {pastRDVS &&
                (pastRDVS.length > 0 ? (
                  <Table striped bordered responsive>
                    <thead>
                      <tr>
                        <th>Medecin</th>
                        <th>Date de rendez-vous</th>
                        <th>Heure</th>
                        <th>Date de reservation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pastRDVS.map((rdv) => (
                        <tr key={rdv._id}>
                          <td>
                            {rdv.medecin.firstName} {rdv.medecin.lastName}
                          </td>
                          <td>{formatDate(rdv.date)}</td>
                          <td>{rdv.hour}</td>
                          <td>{formatDate(rdv.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">
                    Vos rendez-vous passés apparaîtront ici
                  </Alert>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PatientRDVS;
