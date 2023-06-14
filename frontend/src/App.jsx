import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./css/resets.css";
import PublicNav from "./components/PublicNav";
import Landing from "./pages/public/landing/Landing";
import { ToastContainer } from "react-toastify";
import Sidebar from "./components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

import AdminNavbar from "./components/AdminNavbar";
import {
  AdminLogin,
  AdminDashboard,
  AdminDoctors,
  AddDoctor,
  DoctorPage,
} from "./pages/admin";
import {
  PatientDashboard,
  PatientLogin,
  PatientOrdonnances,
  PatientProfile,
  PatientRDVS,
  PatientSignup,
} from "./pages/patient";
import {
  MedecinDashboard,
  MedecinFactures,
  MedecinLogin,
  MedecinOrdonnances,
} from "./pages/medecin";
import MedecinNavbar from "./components/MedecinNavbar";
import PatientFacturesPage from "./pages/patient/PatientFacturesPage";
import DoctorCalendarPage from "./pages/medecin/DoctorCalendarPage";
import DoctorProfile from "./pages/medecin/DoctorProfile";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminPatient from "./pages/admin/AdminPatient";
import AdminRendezVous from "./pages/admin/AdminRendezVous";
import AdminProfile from "./pages/admin/AdminProfile";
import FacturePage from "./pages/facture/FacturePage";
import Factures from "./pages/facture/Factures";
import { useUserContext } from "./contexts/useUserContext";
import Contact from "./pages/public/Contact";
import ContactMessages from "./pages/admin/ContactMessages";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* public routes */}
          <Route path="/" element={<PublicNav />}>
            <Route index element={<Landing />} />
            <Route path="contact" element={<Contact />} />
            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="patient/signup" element={<PatientSignup />} />
            <Route path="patient/login" element={<PatientLogin />} />
            <Route path="medecin/login" element={<MedecinLogin />} />
          </Route>

          {/* patient routes */}
          <Route path="/patient" element={<Sidebar />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="ordonnances" element={<PatientOrdonnances />} />
            <Route path="rendezvous" element={<PatientRDVS />} />
            <Route path="factures" element={<PatientFacturesPage />} />
            <Route path="profile" element={<PatientProfile />} />
          </Route>

          {/* medecin routes */}
          <Route path="/medecin" element={<MedecinNavbar />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<MedecinDashboard />} />
            <Route path="ordonnances" element={<MedecinOrdonnances />} />
            <Route path="factures" element={<MedecinFactures />} />
            <Route path="calendrier" element={<DoctorCalendarPage />} />
            <Route path="profile" element={<DoctorProfile />} />
          </Route>

          {/* admin routes */}
          <Route path="/admin" element={<AdminNavbar />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="messages" element={<ContactMessages />} />

            <Route path="medecins" element={<AdminDoctors />} />
            <Route path="medecins/:id" element={<DoctorPage />} />
            <Route path="ajouter-medecin" element={<AddDoctor />} />

            <Route path="patients" element={<AdminPatients />} />
            <Route path="patients/:idPatient" element={<AdminPatient />} />

            <Route path="rendezvous" element={<AdminRendezVous />} />

            <Route path="profile" element={<AdminProfile />} />

            <Route path="factures" element={<Factures />} />
          </Route>

          <Route path="/factures">
            <Route path=":factureID" element={<FacturePage />} />
          </Route>
        </Routes>
        <ToastContainer />
      </Router>
    </div>
  );
}

export default App;
