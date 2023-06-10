import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { toast } from "react-toastify";
import formatDate from "../helpers/formatDate";
import { Button, Form } from "react-bootstrap";
import { useUserContext } from "../contexts/useUserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFacture, updateDoctorFacture } from "../api/facture";
import { getErrorMessage } from "../helpers/getErrorMessage";
import { Link } from "react-router-dom";

const MedecinFactureRow = ({ facture }) => {
  const { userToken } = useUserContext();
  const queryClient = useQueryClient();
  const { mutate: mutateByDelete, isLoading } = useMutation({
    mutationFn: (factureID) => deleteFacture(factureID, userToken),
    onError: (error) => {
      console.log("error delete", error);
      toast.error(getErrorMessage(error));
    },
    onSuccess: () => {
      toast.success("Facture supprimé avec success");
      queryClient.invalidateQueries(["factures"]);
    },
  });

  const { mutate: mutateByUpdate, isLoading: isUpdating } = useMutation({
    mutationFn: ({ factureID, newData }) =>
      updateDoctorFacture(factureID, newData, userToken),
    onSuccess: () => {
      toast.success("Facture état modifié avec success");
      queryClient.invalidateQueries(["factures"]);
    },
  });
  return (
    <tr key={facture._id}>
      <td>
        {facture.rdv.patient.firstName} {facture.rdv.patient.lastName}
      </td>
      <td>{facture.price}</td>
      <td>{formatDate(facture.createdAt)}</td>
      <td>
        <Form.Select
          disabled={isUpdating}
          defaultValue={facture.isPaid}
          onChange={(e) =>
            mutateByUpdate({
              factureID: facture._id,
              newData: { isPaid: e.target.value },
            })
          }
        >
          <option style={{ color: "green" }} value={true}>
            Oui
          </option>
          <option style={{ color: "red" }} value={false}>
            Non
          </option>
        </Form.Select>
      </td>
      <td>{formatDate(facture.deadline)}</td>
      <td>
        <Button
          variant="outline-success"
          as={Link}
          to={`/factures/${facture._id}`}
        >
          Imprimer
        </Button>
      </td>
      <td>
        <Button
          disabled={isLoading}
          variant="danger"
          onClick={() => mutateByDelete(facture._id)}
        >
          {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Supprimer"}
        </Button>
      </td>
    </tr>
  );
};

export default MedecinFactureRow;
