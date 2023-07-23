import { useState, useEffect } from "react";
import "./App.css";
import HospitalSearchBar from "./components/HospitalSearchBar/HospitalSearchBar";
import HospitalList from "./components/HospitalDetailsSection/HospitalList";
import Loading from "./components/Loading/Loading";
import NotFound from "./components/NotFound/NotFound";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Health from "./components/Health/Health";
import BASEURL from "./baseurl";

export interface data {
  hospitalName: string;
  hospitalAddress: string;
  latitude: number;
  longitude: number;
  area: string;
  type: string;
}

function App() {
  const [hospitals, setHospitals] = useState<data[]>([]);
  const [uniqueAreas, setUniqueAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  useEffect(() => {
    // Function to fetch unique areas from the backend API
    const fetchUniqueAreas = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASEURL}/getUniqueAreas`);
        setUniqueAreas(response.data.data.areas);
      } catch (error) {
        console.error("Error fetching unique areas:", error);
      }
      setLoading(false);
    };

    fetchUniqueAreas();
  }, []);

  useEffect(() => {
    // Function to fetch hospitals from the backend API
    const fetchHospitals = async () => {
      try {
        const response = await axios.get(`${BASEURL}/getHospitals`);
        setHospitals(response.data.data.hospitalsList);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };
    fetchHospitals();
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HospitalSearchBar
                  uniqueAreas={uniqueAreas}
                  setHospitals={setHospitals}
                  setLatitude={setLatitude}
                  setLongitude={setLongitude}
                  latitude={latitude}
                  longitude={longitude}
                />
                {loading ? (
                  <Loading />
                ) : hospitals?.length > 0 ? (
                  <HospitalList hospitals={hospitals} />
                ) : (
                  <NotFound />
                )}
              </>
            }
          />
          <Route path="/health" element={<Health />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
