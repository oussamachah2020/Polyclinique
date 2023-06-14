import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Alert } from "react-bootstrap";
import "../css/medecinCalendar.css";
import { useUserContext } from "../contexts/useUserContext";
import { getMedecinRDVS } from "../api/rendezvous";
import { useQuery } from "@tanstack/react-query";
import { getErrorMessage } from "../helpers/getErrorMessage";
const MedecinCalendar = () => {
  const { userToken } = useUserContext();
  console.log("medecin token", userToken);
  const {
    data: rdvs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: () => getMedecinRDVS(userToken),
    onSuccess: (data) => console.log("rdvs", data),
    queryKey: ["medecin", "rendezvous"],
  });
  const events =
    rdvs &&
    rdvs.map((rdv) => ({
      title: `${rdv.hour} RDV avec ${rdv.patient.firstName} ${rdv.patient.lastName}`,
      date: rdv.date,
    }));

  return (
    <>
      <h3>Calendrier</h3>
      {isLoading && <Alert variant="info">Loading your calendar...</Alert>}
      {isError && <Alert variant="info">{getErrorMessage(error)}</Alert>}
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </>
  );
};

export default MedecinCalendar;
