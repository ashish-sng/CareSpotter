import React, { useState, useCallback, useEffect } from "react";
import "./HospitalSearchBar.css";
import axios, { AxiosResponse, AxiosError } from "axios";
import { debounce } from "lodash";
import { data } from "../../App";
import searchIcon from "../../assets/icons/searchIcon.png";
import BASEURL from "../../baseurl";

interface HospitalSearchBarProps {
  setHospitals: React.Dispatch<React.SetStateAction<data[]>>;
  uniqueAreas: string[];
  latitude: number;
  longitude: number;
  setLatitude: React.Dispatch<React.SetStateAction<number>>;
  setLongitude: React.Dispatch<React.SetStateAction<number>>;
}

interface HospitalsData {
  hospitalData: data[];
}

const HospitalSearchBar: React.FC<HospitalSearchBarProps> = ({
  setHospitals,
  uniqueAreas,
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string[]>([]);
  const [areaRange, setAreaRange] = useState<number>(500);
  const [geolocationPermission, setGeolocationPermission] = useState<
    PermissionState | undefined
  >(undefined);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    const checkGeolocationPermission = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({
          name: "geolocation",
        });
        setGeolocationPermission(permissionStatus.state);
      } catch (error) {
        console.error("Error checking geolocation permission:", error);
      }
    };

    checkGeolocationPermission();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    getHospitalsList(
      e.target.value,
      selectedArea,
      areaRange,
      latitude,
      longitude,
      selected
    );
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const area = e.target.value;
    if (area && !selectedArea.includes(area)) {
      const updatedArea = [...selectedArea, area];
      setSelectedArea(updatedArea);
      getHospitalsList(
        searchTerm,
        updatedArea,
        areaRange,
        latitude,
        longitude,
        selected
      );
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
    getHospitalsList(
      searchTerm,
      selectedArea,
      areaRange,
      latitude,
      longitude,
      e.target.value
    );
  };

  const handleRemoveArea = (area: string) => {
    const updatedArea = selectedArea.filter((s) => s !== area);
    setSelectedArea(updatedArea);
    getHospitalsList(
      searchTerm,
      updatedArea,
      areaRange,
      latitude,
      longitude,
      selected
    );
  };

  const clearArea = () => {
    setSelectedArea([]);
    getHospitalsList(searchTerm, [], areaRange, latitude, longitude, selected);
  };

  const handleResetRange = () => {
    setAreaRange(500);
    getHospitalsList(
      searchTerm,
      selectedArea,
      500,
      latitude,
      longitude,
      selected
    );
  };

  const handleRangeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const range = parseInt(e.target.value);
    setAreaRange(range);

    // Check if geolocation is supported by the browser
    if ("geolocation" in navigator) {
      try {
        // Try to get the user's current location
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          }
        );

        // If the user's location is obtained, you can access the latitude and longitude
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        // Call the getHospitalsList function with the updated range, selectedArea, and user's location
        getHospitalsList(
          searchTerm,
          selectedArea,
          range,
          latitude,
          longitude,
          selected
        );
      } catch (error) {
        // If there's an error getting the user's location or the user denies the permission, handle it here
        console.error("Error getting user's location:", error);
      }
    } else {
      console.warn("Geolocation is not supported in this browser.");
      // Call the getHospitalsList function with the updated range and selectedArea without the user's location
      getHospitalsList(
        searchTerm,
        selectedArea,
        areaRange,
        latitude,
        longitude,
        selected
      );
    }
  };

  const getHospitalsList = useCallback(
    debounce(
      async (
        searchTerm: string,
        selectedArea: string[],
        areaRange: number,
        latitude: number,
        longitude: number,
        selected: string
      ) => {
        axios
          .get<HospitalsData>(`${BASEURL}/getHospitals`, {
            params: {
              area: selectedArea.join(","),
              searchName: searchTerm,
              latitude: latitude,
              longitude: longitude,
              range: areaRange,
              sortBy: selected,
            },
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((response: AxiosResponse<any>) => {
            setHospitals(response.data.data.hospitalsList);
          })
          .catch((error: AxiosError) => {
            console.error("Error fetching data: ", error);
            window.location.reload();
          });
      },
      500
    ),
    []
  );

  return (
    <div className="hospital__search">
      <form className="search__form">
        <div className="search__bar">
          <img src={searchIcon} alt="Search Icon" />
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
                  onClick={() => handleRemoveArea(area)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
          {selectedArea.length > 0 && (
            <button className="clear__area" onClick={clearArea}>
              Clear
            </button>
          )}
        </div>
        <div className="search__range__container">
          {geolocationPermission === "granted" ? (
            <>
              <p>search Range:</p>
              <input
                type="range"
                min={1}
                max={500}
                value={areaRange}
                onChange={handleRangeChange}
              />
              <span>{areaRange.toLocaleString()}</span>
              <button className="reset__range" onClick={handleResetRange}>
                Reset Range
              </button>
            </>
          ) : (
            <span className="location__error">Location permission denied. Allow Location permission and refresh.</span>
          )}
        </div>
      </div>
      <div className="custom__select">
        <span>Sort By:</span>
        <select value={selected} onChange={handleSortChange}>
          <option value="hospitalName">Hospital Name</option>
          <option value="area">Area</option>
        </select>
        <span className="arrow"></span>
      </div>
    </div>
  );
};

export default HospitalSearchBar;
