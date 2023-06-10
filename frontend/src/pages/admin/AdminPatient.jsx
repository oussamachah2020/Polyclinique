import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useUserContext } from "../../contexts/useUserContext";
import { getPatientData } from "../../api/patient";
import { Alert, Button, Card, Container, Table } from "react-bootstrap";
import patientImage from "../../assets/patient-image.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faEnvelope,
  faPhone,
  faSpinner,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import formatDate from "../../helpers/formatDate";
import { deleteRDV, getAdminPatientRDVS } from "../../api/rendezvous";
import { getErrorMessage } from "../../helpers/getErrorMessage";
import { getAdminPatientFactures } from "../../api/facture";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
const AdminPatient = () => {
  const { idPatient } = useParams();
  const { userToken } = useUserContext();
  const queryClient = useQueryClient();
  // get patient profile
  const {
    data: patient,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: () => getPatientData(idPatient, userToken),
    queryKey: ["patients", idPatient],
  });

  // get patient rdvs
  const {
    data: rdvs,
    isLoading: isLoadingRDVS,
    isError: isErrorRDVS,
    error: errorRDVS,
    isFetching,
  } = useQuery({
    queryFn: () => getAdminPatientRDVS(idPatient, userToken),
    queryKey: ["patients", idPatient, "rdvs"],
    onError: (error) => console.log("error get rdvs", error),
  });

  const pastRDVS = rdvs
    ? rdvs.filter((rdv) => new Date(rdv.date) < new Date())
    : undefined;
  const futureRDVS = rdvs
    ? rdvs.filter((rdv) => new Date(rdv.date) > new Date())
    : undefined;

  // get all patient factures
  const {
    data: factures,
    isLoading: isLoadingFactures,
    isError: isErrorFactures,
    error: errorFactures,
  } = useQuery({
    queryFn: () => getAdminPatientFactures(idPatient, userToken),
    queryKey: ["patients", idPatient, "factures"],
    onError: (error) => console.log("error get factures", error),
  });

  // delete rdv
  const { mutate: mutateRDV, isLoading: isDeletingRDV } = useMutation({
    mutationFn: (rdvID) => deleteRDV(rdvID),
    onSuccess: () => {
      toast.success("Rendez vous annulé avec success");
      queryClient.invalidateQueries(["patients", idPatient, "rdvs"]);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <>
      <Helmet>
        <title>Patient</title>
      </Helmet>
      <Container
        style={{ minHeight: "100vh" }}
        className="d-flex align-items-center justify-content-center"
      >
        <main
          style={{ columnGap: 30, rowGap: 30 }}
          className="h-100 w-100 d-lg-flex align-items-center justify-content-between flex-wrap"
        >
          <Card style={{ flexBasis: 350, flexGrow: 0, flexShrink: 1 }}>
            <Card.Body>
              {isLoading && (
                <Alert variant="info">Chargement des donnés du patient</Alert>
              )}
              {isError && (
                <Alert variant="error">{getErrorMessage(error)}</Alert>
              )}
              {patient && (
                <>
                  <img
                    className="d-block mx-auto"
                    src={patientImage}
                    width={200}
                    height={200}
                  />
                  <div
                    className="my-2 d-flex align-items-center"
                    style={{ gap: 10 }}
                  >
                    <FontAwesomeIcon icon={faUser} />{" "}
                    <p className="mb-0">
                      Nom complet:{" "}
                      <strong>
                        {patient.firstName} {patient.lastName}
                      </strong>
                    </p>
                  </div>
                  <div
                    className="my-2 d-flex align-items-center"
                    style={{ gap: 10 }}
                  >
                    <FontAwesomeIcon icon={faPhone} />{" "}
                    <p className="mb-0">
                      Numero de telephone: <strong>{patient.phone}</strong>
                    </p>
                  </div>
                  <div
                    className="my-2 d-flex align-items-center"
                    style={{ gap: 10 }}
                  >
                    <FontAwesomeIcon icon={faEnvelope} />{" "}
                    <p className="mb-0">
                      Email:
                      <strong>{patient.email}</strong>
                    </p>
                  </div>
                  <div
                    className="my-2 d-flex align-items-center"
                    style={{ gap: 10 }}
                  >
                    <FontAwesomeIcon icon={faCalendar} />{" "}
                    <p className="mb-0">
                      Date d'inscription:
                      <strong>{formatDate(patient.createdAt)}</strong>
                    </p>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>

          <div style={{ flexGrow: 1, flexBasis: 600, flexShrink: 1 }}>
            <div>
              <h3>Patient rendez-vous future</h3>
              {!isLoadingRDVS && isFetching && (
                <Alert variant="info">
                  Mise a jour... <FontAwesomeIcon icon={faSpinner} spin />
                </Alert>
              )}
              {isLoadingRDVS && (
                <Alert variant="info">
                  Chargement des rendez vous du patient...
                </Alert>
              )}
              {isErrorRDVS && (
                <Alert variant="error">{getErrorMessage(errorRDVS)}</Alert>
              )}
              {futureRDVS &&
                (futureRDVS.length > 0 ? (
                  <Table bordered striped responsive className="w-100">
                    <thead>
                      <tr>
                        <th>Medecin</th>
                        <th>Date de rendez vous</th>
                        <th>Date de reservation</th>
                        <th>Annuler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {futureRDVS.map((rdv) => (
                        <tr key={rdv._id}>
                          <td>
                            <Link to={`/admin/medecins/${rdv.medecin._id}`}>
                              {rdv.medecin.firstName} {rdv.medecin.lastName}
                            </Link>
                          </td>
                          <td>{formatDate(rdv.date)}</td>
                          <td>{formatDate(rdv.createdAt)}</td>
                          <td>
                            <Button
                              disabled={isDeletingRDV}
                              onClick={() => mutateRDV(rdv._id)}
                              variant="outline-warning"
                            >
                              {isDeletingRDV ? (
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
                    Le patient n'a pas encore pris de rendez-vous
                  </Alert>
                ))}
            </div>
            <div>
              <h3>Patient rendez-vous passés</h3>
              {!isLoadingRDVS && isFetching && (
                <Alert variant="info">
                  Mise a jour... <FontAwesomeIcon icon={faSpinner} spin />
                </Alert>
              )}
              {isLoadingRDVS && (
                <Alert variant="info">
                  Chargement des rendez vous du patient...
                </Alert>
              )}
              {isErrorRDVS && (
                <Alert variant="error">{getErrorMessage(errorRDVS)}</Alert>
              )}
              {pastRDVS &&
                (pastRDVS.length > 0 ? (
                  <Table bordered striped responsive className="w-100">
                    <thead>
                      <tr>
                        <th>Medecin</th>
                        <th>Date de rendez vous</th>
                        <th>Date de reservation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pastRDVS.map((rdv) => (
                        <tr key={rdv._id}>
                          <td>
                            <Link to={`/admin/medecins/${rdv.medecin._id}`}>
                              {rdv.medecin.firstName} {rdv.medecin.lastName}
                            </Link>
                          </td>
                          <td>{formatDate(rdv.date)}</td>
                          <td>{formatDate(rdv.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">
                    Le patient n'a pas des rendez vous passés
                  </Alert>
                ))}
            </div>
            <div>
              <h3>Patient factures</h3>
              {isLoadingFactures && (
                <Alert variant="info">
                  Chargement des factures du patient...
                </Alert>
              )}
              {isErrorFactures && (
                <Alert variant="error">{getErrorMessage(errorFactures)}</Alert>
              )}
              {factures &&
                (factures.length > 0 ? (
                  <Table bordered striped responsive className="w-100">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Medecin</th>
                        <th>Date de rendez vous</th>
                        <th>Date de facturation</th>
                        <th>Prix</th>
                        <th>Est payé</th>
                        <th>Date limite de paiement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {factures.map((facture) => (
                        <tr key={facture._id}>
                          <td>
                            <Link to={`/factures/${facture._id}`}>
                              {facture._id}
                            </Link>
                          </td>
                          <td>
                            <Link
                              to={`/admin/medecins/${facture.rdv.medecin._id}`}
                            >
                              {facture.rdv.medecin.firstName}{" "}
                              {facture.rdv.medecin.lastName}
                            </Link>
                          </td>
                          <td>{formatDate(facture.rdv.date)}</td>
                          <td>{formatDate(facture.createdAt)}</td>
                          <td>{facture.price}</td>
                          <td
                            style={{ color: facture.isPaid ? "green" : "red" }}
                          >
                            {facture.isPaid ? "Oui" : "Non"}
                          </td>
                          <td>{formatDate(facture.deadline)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">Le patient n'a pas des factures</Alert>
                ))}
            </div>
          </div>
        </main>
      </Container>
    </>
  );
};

export default AdminPatient;
