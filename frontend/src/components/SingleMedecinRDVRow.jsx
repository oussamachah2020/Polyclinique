import React, { useState } from "react";
import formatDate from "../helpers/formatDate";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useUserContext } from "../contexts/useUserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFacture } from "../api/facture";
import { getErrorMessage } from "../helpers/getErrorMessage";

const SingleMedecinRDVRow = ({ rdv }) => {
  console.log("single rdv", rdv);
  console.log("single rdv factures", rdv.facture);
  const { userToken } = useUserContext();
  const queryClient = useQueryClient();
  // modal States
  const [isModalShown, setIsModalShown] = useState(false);
  const [price, setPrice] = useState(0);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
  );

  const {
    mutate: mutateFactures,
    isLoading: isPostingFacture,
    isError,
    error,
  } = useMutation({
    mutationFn: (factureData) => postFacture(factureData, userToken),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["factures"]);
      toast.success("Facture envoyé avec success");
      console.log("success post facture", data);
      setPrice(0);
      setIsModalShown(false);
    },
    onError: (error) => console.log("error post facture", error),
  });

  const handlePostFacture = async (e) => {
    e.preventDefault();
    if (!price) return;

    const factureData = { price, deadline, rdv: rdv._id };
    mutateFactures(factureData);
  };
  return (
    <>
      <tr className="mt-3">
        <td>{formatDate(rdv.date)}</td>
        <td>{rdv.hour}</td>
        <td>
          {rdv.patient.firstName} {rdv.patient.lastName}
        </td>
        <td>{rdv.patient.phone}</td>
        <td>
          {rdv.facture == undefined ? (
            <Button variant="secondary" onClick={() => setIsModalShown(true)}>
              Facturer
            </Button>
          ) : (
            "Deja facturé"
          )}
        </td>
      </tr>

      {/* FACTURATION MODAL */}
      <Modal show={isModalShown} onHide={() => setIsModalShown(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Facturer un patient</Modal.Title>
        </Modal.Header>
        <Form className="mt-0" onSubmit={handlePostFacture}>
          <Modal.Body>
            {isError && (
              <Alert variant="danger">{getErrorMessage(error)}</Alert>
            )}
            <Form.Group>
              <Form.Label>Patient:</Form.Label>
              <Form.Control
                disabled
                value={`${rdv.patient.firstName} ${rdv.patient.lastName}`}
              />
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label>
                Prix <small>(DH)</small> :
              </Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min="0"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Date limite pour payer la facture{" "}
                <small>(10 jours par défaut)</small> :
              </Form.Label>
              <DatePicker
                required
                selected={deadline}
                onChange={(date) => setDeadline(date)}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsModalShown(false)}>
              Annuler
            </Button>
            <Button disabled={isPostingFacture} variant="primary" type="submit">
              {isPostingFacture ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                "Facturer"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default SingleMedecinRDVRow;
