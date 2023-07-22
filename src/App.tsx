import { useState, useEffect } from "react";
import "./App.css";
import HospitalSearchBar from "./components/HospitalSearchBar/HospitalSearchBar";
import HospitalList from "./components/HospitalDetailsSection/HospitalList";
import Loading from "./components/Loading/Loading";
import NotFound from "./components/NotFound/NotFound";
import axios from "axios";

export interface data {
  hospitalName: string;
  hospitalAddress: string;
  latitude: number;
  longitude: number;
  area: string;
  type: string;
}

function App() {
  const [hospitals, setHospitals] = useState<data[]>([]); // Ensure hospitals is initialized as an empty array
  const [uniqueAreas, setUniqueAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  },[]);

  useEffect(() => {
    // Function to fetch unique areas from the backend API
    const fetchUniqueAreas = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:4000/getUniqueAreas"
        );
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
        const response = await axios.get("http://localhost:4000/getHospitals");
        setHospitals(response.data.data.hospitalsList);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };
    fetchHospitals();
  }, []);

  return (
    <div className="App">
      <HospitalSearchBar
        uniqueAreas={uniqueAreas}
        setHospitals={setHospitals}
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
    </div>
  );
}

export default App;
