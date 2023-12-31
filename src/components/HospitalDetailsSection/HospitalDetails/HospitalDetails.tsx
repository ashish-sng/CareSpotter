import React from "react";
import "./HospitalDetails.css";
import hospital from "../../../assets/icons/hospital.png";
import address from "../../../assets/icons/address.gif";
import ambulance from "../../../assets/icons/ambulance.gif";
import { data } from "../../../App";

interface HospitalDetailsProps {
  key: number;
  hospital: data;
}

const HospitalDetails: React.FC<HospitalDetailsProps> = ({
  hospital: { hospitalName, hospitalAddress, area, type },
}) => {
  return (
    <div className="hospital__details">
      <div className="hospital__left">
        <div className="hospital__name">
          <img src={hospital} alt="hospital" />
          <span>{hospitalName}</span>
        </div>
        <div className="hospital__address">
          <img src={address} alt="address" />
          <p>{hospitalAddress}</p>
        </div>
      </div>
      <div className="hospital__right">
        <div className="hospital__city">
          <img src={ambulance} alt="ambulance" />
          <span>{area}</span>
        </div>
        <span>{type} Hospital</span>
      </div>
    </div>
  );
};

export default HospitalDetails;
