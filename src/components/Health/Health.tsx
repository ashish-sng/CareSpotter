import React, { useState, useEffect } from "react";
import "./Health.css";
import Loading from "../Loading/Loading";
import axios from "axios";
import NotFound from "../NotFound/NotFound";
import BASEURL from "../../baseurl";

interface HealthData {
  server: string;
  database: string;
}

const HealthComponent: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get<HealthData>(`${BASEURL}/health`)
      .then((res) => {
        setHealthData(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="health-component">
      <h1>Health Status</h1>
      {loading ? (
        <Loading />
      ) : healthData ? (
        <>
          <p>Server: {healthData.server}</p>
          <p>Database: {healthData.database}</p>
        </>
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default HealthComponent;
