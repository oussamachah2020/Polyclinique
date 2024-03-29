import React from "react";
import { Alert, Button, Container, Table } from "react-bootstrap";
import { useUserContext } from "../../contexts/useUserContext";
import { useQuery } from "@tanstack/react-query";
import { getAllFactures } from "../../api/facture";
import { getErrorMessage } from "../../helpers/getErrorMessage";
import { Link } from "react-router-dom";
import formatDate from "../../helpers/formatDate";
import { Helmet } from "react-helmet";

const Factures = () => {
  const { userToken } = useUserContext();
  const {
    data: factures,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: () => getAllFactures(userToken),
    queryKey: ["factures"],
    onSuccess: (data) => {
      console.log("factures", data);
      // prepareChartData();
    },
  });

  // const prepareChartData = () => {
  //   if (factures && factures.length > 0) {
  //     const data = factures.reduce((result, facture) => {
  //       const month = new Date(facture.createdAt).getMonth();
  //       const revenue = result[month] || 0;
  //       result[month] = revenue + facture.price;
  //       return result;
  //     }, {});

  //     const labels = Object.keys(data).map((month) =>
  //       new Date(0, parseInt(month), 0).toLocaleString("default", {
  //         month: "long",
  //       })
  //     );

  //     const revenueData = Object.values(data);

  //     const chartData = {
  //       labels: labels,
  //       datasets: [
  //         {
  //           label: "Revenue",
  //           data: revenueData,
  //           backgroundColor: "rgba(75, 192, 192, 0.6)", // Adjust the color as needed
  //         },
  //       ],
  //       options: {
  //         scales: {
  //           x: {
  //             type: "category", // Set the scale type to 'category'
  //           },
  //         },
  //       },
  //     };

  //     setChartData(chartData);
  //   }
  // };

  return (
    <>
      <Helmet>
        <title>Liste des factures</title>
      </Helmet>
      {/* {chartData && (
        <div className="my-4">
          <h4>Revenue par mois</h4>
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
      )} */}
      <Container className="py-3">
        <h3 className="mb-4">Archive des factures:</h3>
        {isLoading && <Alert variant="info">Chargement des factures...</Alert>}
        {isError && <Alert variant="info">{getErrorMessage(error)}</Alert>}
        {factures && factures.length > 0 ? (
          <Table bordered responsive>
            <thead>
              <tr>
                <th>Medecin</th>
                <th>Patient</th>
                <th>Prix</th>
                <th>Est payée</th>
                <th>Date de facturation</th>
                <th>Voir</th>
              </tr>
            </thead>
            <tbody>
              {factures.map((facture) => (
                <tr key={facture._id}>
                  <td>
                    <Link to={`/admin/medecins/${facture.rdv.medecin._id}`}>
                      {facture.rdv.medecin.firstName}{" "}
                      {facture.rdv.medecin.lastName}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/admin/patients/${facture.rdv.patient._id}`}>
                      {facture.rdv.patient.firstName}{" "}
                      {facture.rdv.patient.lastName}
                    </Link>
                  </td>
                  <td style={{ color: "green" }}>
                    <b>{facture.price}</b>
                  </td>
                  <td style={{ color: facture.isPaid ? "green" : "red" }}>
                    {facture.isPaid ? "Oui" : "Non"}
                  </td>
                  <td>{formatDate(facture.createdAt)}</td>
                  <td>
                    <Button
                      as={Link}
                      to={`/factures/${facture._id}`}
                      variant="outline-success"
                    >
                      Voir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="info">Il ya 0 factures actuellement</Alert>
        )}
      </Container>
    </>
  );
};

export default Factures;
