/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback } from "react";
import "./HospitalSearchBar.css";
import axios, { AxiosResponse, AxiosError } from "axios";
import { debounce } from "lodash";
import Multiselect from "multiselect-react-dropdown";
import { data } from "../../App";

interface HospitalSearchBarProps {
  setHospitals: React.Dispatch<React.SetStateAction<data[]>>;
  uniqueAreas: string[];
  latitude: number;
  longitude: number;
}

interface HospitalsData {
  hospitalData: data[];
}

const HospitalSearchBar: React.FC<HospitalSearchBarProps> = ({
  setHospitals,
  uniqueAreas,
  latitude,
  longitude,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    getHospitalsList(e.target.value, selectedArea);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const area = e.target.value;
    if (area && !selectedArea.includes(area)) {
      const updatedArea = [...selectedArea, area];
      setSelectedArea(updatedArea);
      getHospitalsList(searchTerm, updatedArea);
    }
  };

  const handleRemoveSkill = (area: string) => {
    const updatedArea = selectedArea.filter((s) => s !== area);
    setSelectedArea(updatedArea);
    getHospitalsList(searchTerm, updatedArea);
  };

  const clearSkills = () => {
    setSelectedArea([]);
    getHospitalsList(searchTerm, []);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Perform search operation with the search term and selected skills
    console.log("Search Term:", searchTerm);
    console.log("Selected Skills:", selectedArea);
  };

  const getHospitalsList = useCallback(debounce(async (searchTerm: string, selectedArea: string[]) => {
    axios
      .get<HospitalsData>("http://localhost:4000/getHospitals", {
        params: {
          area: selectedArea.join(","),
          searchName: searchTerm,
          // skills: searchName.join(","),
        },
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((response: AxiosResponse<any>) => {
        console.log("Response:", response.data.data.hospitalsList);
        setHospitals(response.data.data.hospitalsList);
      })
      .catch((error: AxiosError) => {
        console.error("Error fetching data: ", error);
      });
  }, 500), []);


  return (
    <div className="hospital__search">
      <form className="search__form" onSubmit={handleSearchSubmit}>
        <div className="search__bar">
          <img src="" alt="Search Icon" />
          <input
            type="text"
            placeholder="Type any job title"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </form>
      <div className="hospital__search__footer">
        <div className="select__area__container">
          <select value={selectedArea} onChange={handleSelectChange}>
            <option value="">Select Area</option>
            {uniqueAreas.map((area, index) => {
              return <option key={index}>{area}</option>;
            })}
          </select>
          <div className="selected__area__container">
            {selectedArea.map((area) => (
              <div className="selected__area" key={area}>
                {area}
                <button
                  className="remove__area"
                  onClick={() => handleRemoveSkill(area)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
          {selectedArea.length > 0 && (
            <button className="clear__skills" onClick={clearSkills}>
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalSearchBar;
