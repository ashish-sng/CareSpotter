import React, {useEffect} from "react";
import HospitalDetails from "./HospitalDetails/HospitalDetails";
import { data } from "../../App";

interface HospitalListProps {
  hospitals: data[];
}

const HospitalList: React.FC<HospitalListProps> = ({ hospitals }) => {

  useEffect(() => {
     navigator.geolocation.getCurrentPosition(function (position) {
       console.log("Latitude is :", position.coords.latitude);
       console.log("Longitude is :", position.coords.longitude);
     });
  })
  return (
    <div>
      {hospitals.map((hospital, index) => (
        <HospitalDetails key={index} hospital={hospital} />
      ))}
    </div>
  );
};

export default HospitalList;
