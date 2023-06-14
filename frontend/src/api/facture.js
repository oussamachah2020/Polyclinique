import api from "./api";

export const getPatientFactures = async (userToken, isPaid) => {
  const endpoint =
    isPaid === undefined
      ? "/patient/factures"
      : `/patient/factures?isPaid=${isPaid}`;
  const response = await api.get(endpoint, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
  return response.data;
};

export const postFacture = async (factureData, doctorToken) => {
  // { price, deadline, rdvID: rdv._id }

  const response = await api.post("/factures", factureData, {
    headers: {
      Authorization: `Bearer ${doctorToken}`,
    },
  });

  return response.data;
};

export const deleteFacture = async (factureID, doctorToken) => {
  const response = await api.delete(
    `/factures/${factureID}`,

    {
      headers: {
        Authorization: `Bearer ${doctorToken}`,
      },
    }
  );

  return response.data;
};

export const getDoctorFactures = async (doctorToken) => {
  const response = await api.get("/medecin/factures/", {
    headers: {
      Authorization: `Bearer ${doctorToken}`,
    },
  });
  return response.data;
};

export const updateDoctorFacture = async (factureID, newData, doctorToken) => {
  const response = await api.put(`/medecin/factures/${factureID}`, newData, {
    headers: {
      Authorization: `Bearer ${doctorToken}`,
    },
  });

  return response.data;
};

export const getAdminPatientFactures = async (
  idPatient,
  adminToken,
  isPaid
) => {
  const endpoint =
    isPaid === undefined
      ? `/patient/${idPatient}/factures`
      : `/patient/${idPatient}/factures?isPaid=${isPaid}`;
  const response = await api.get(endpoint, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
  return response.data;
};

export const getFacture = async (factureID, userToken) => {
  const response = await api.get(`/factures/${factureID}`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  return response.data;
};

export const getAllFactures = async (adminToken) => {
  const response = await api.get("/factures", {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  return response.data;
};
