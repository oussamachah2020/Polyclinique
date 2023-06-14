import api from "./api";

export const patientSignup = async (patientData) => {
  const response = await api.post("/patient/register", patientData);

  return response.data;
};
export const patientLogin = async (patientData) => {
  const response = await api.post("/patient/login", patientData);
  return response.data;
};

export const getPatientProfile = async (patientToken) => {
  if (!patientToken) return;
  const response = await api.get(`/patient`, {
    headers: {
      Authorization: `Bearer ${patientToken}`,
    },
  });

  return response.data;
};

export const getMedecinPatients = async (medecinToken) => {
  if (!medecinToken) return;
  console.log("medecin token to send", medecinToken);
  const response = await api.get(`/medecin/patients`, {
    headers: {
      Authorization: `Bearer ${medecinToken}`,
    },
  });

  return response.data;
};

export const getAllPatients = async (adminToken) => {
  const response = await api.get(`/patient/all`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
  return response.data;
};

export const getDoctorPatients = async (doctorToken) => {
  const response = await api.get(`/medecin/patients`, {
    headers: {
      Authorization: `Bearer ${doctorToken}`,
    },
  });
  return response.data;
};

// admin access only
export const deletePatient = async (patientID, adminToken) => {
  const response = await api.delete(`/patient/${patientID}`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  return response.data;
};

// admin access only
export const getPatientData = async (patientID, adminToken) => {
  const response = await api.get(`/patient/${patientID}`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  return response.data;
};

export const updatePatientProfile = async (updateData, patientToken) => {
  const response = await api.put("/patient", updateData, {
    headers: {
      Authorization: `Bearer ${patientToken}`,
    },
  });

  return response.data;
};
