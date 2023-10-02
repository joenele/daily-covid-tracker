import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        rgb: "rgb(204, 16, 52)",
        half_op: "rgba(204, 16, 52, 0.5)",
        multiplier: 200,
        option: { color:"#cc1034", fillColor: "#cc1034" },
    },
    recovered: {
      hex: "#7dd71d",
      rgb: "rgb(125, 215, 29)",
      half_op: "rgba(125, 215, 29, 0.5)",
      multiplier: 200,
      option: { color:"#7dd71d", fillColor: "#7dd71d" },
    },
    deaths: {
        hex: "#CC1034",
        rgb: "rgb(204, 16, 52)",
        half_op: "rgba(204, 16, 52, 0.5)",
        multiplier: 800,
        option: { color:"#cc1034", fillColor: "#cc1034" },
    },
  };
  
export const sortData = (data) => {
    let sortedData = [...data];

    // return sorted data if a.cases > b.cases
    sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1)); 
    return sortedData;
};

export const updateTime = (countryInfo) => {
    let updatedTime = [countryInfo.updated]
    var date = new Date(updatedTime);
    console.log(date);
}

export const prettyPrintStat = (stat) => 
    stat ? `+${numeral(stat).format("0.0a")}` : "0";

// DRAW circles on the map with interactive tooltip
export const showDataOnMap = (data, casesType = "cases") => 
    data.map(country => (
        <Circle
            center={[
                country.countryInfo.lat, 
                country.countryInfo.long]}
            color={
                casesTypeColors[casesType].hex}
            fillColor={
                casesTypeColors[casesType].hex}
            fillOpacity={0.4}
            pathOptions={
                casesTypeColors[casesType].option}
            radius={
                Math.sqrt(country[casesType]) 
                * casesTypeColors[casesType].multiplier
              }
            >
            <Popup>
                <div className="info-container">
                    <div
                        className="info-flag"
                        style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                    />
                    <div 
                        className="info-name">
                        {country.country}
                    </div>
                    <div 
                        className="info-cases">
                        Cases: {numeral(country.cases)
                        .format("0,0")}
                    </div>
                    <div 
                        className="info-recovered">
                        Recovered: {numeral(country.recovered)
                        .format("0,0")}
                    </div>
                    <div 
                        className="info-deaths">
                        Deaths: {numeral(country.deaths)
                        .format("0,0")}
                    </div>
                    <div 
                        className="info-critical">
                        Critical: {numeral(country.critical)
                        .format("0,0")}
                    </div>
                    <div 
                        className="info-active">
                        Active: {numeral(country.active)
                        .format("0,0")}
                    </div>
                </div>
            </Popup>
        </Circle>
));