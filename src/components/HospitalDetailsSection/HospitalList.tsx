import React, { useState } from "react";
import "./HospitalList.css";
import HospitalDetails from "./HospitalDetails/HospitalDetails";
import { data } from "../../App";
import next from "../../assets/icons/next.gif";
import previous from "../../assets/icons/previous.gif";

interface HospitalListProps {
  hospitals: data[];
}

const HospitalList: React.FC<HospitalListProps> = ({ hospitals }) => {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(hospitals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const [prevState, setPrevState] = useState<string>("");
  const [colName, setColName] = useState<string>("");

  const sortAccordingToQuery = (query: string) => () => {
    if (query === colName) {
      if (prevState === "") {
        console.log(`ascending sort ${query}`);
        setPrevState("asc");
      } else if (prevState === "asc") {
        console.log(`descending sort ${query}`);
        setPrevState("dsc");
      } else if (prevState === "dsc") {
        console.log(`Default ${query}`);
        setPrevState("");
      }
    } else {
      console.log(`ascending sort ${query}`);
      setPrevState("asc");
      setColName(query);
    }
  };

  return (
    <div className="hospital__list__container">
      <div className="row">
        <span onClick={sortAccordingToQuery("name")}>Name</span>
        <span onClick={sortAccordingToQuery("area")}>Area</span>
        <span onClick={sortAccordingToQuery("hospitalName")}>HospitalName</span>
      </div>
      {hospitals.slice(startIndex, endIndex).map((hospital, index) => (
        <HospitalDetails key={index} hospital={hospital} />
      ))}

      <div className="pagination__buttons">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          <img src={previous} alt="previous" />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          <img src={next} alt="next" />
        </button>
      </div>
    </div>
  );
};

export default HospitalList;
