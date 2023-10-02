import React, { useEffect, useState} from "react";
import "./App.css";
import{
   MenuItem, 
   FormControl, 
   Select, 
   Card, 
   CardContent,
} from "@material-ui/core";
import LineGraph from "./LineGraph";
import InfoBox from "./InfoBox";
import Table from "./Table";
import { sortData } from "./util";
import numeral from "numeral";
import Map from "./Map";
import './Table.css';
import "leaflet/dist/leaflet.css";
import ScrollButton from './ScrollButton';


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState(["cases"]);
  const [mapCenter, setMapCenter] = useState({ lat: 14.60, lng: -64.19 });
  const [mapZoom, setMapZoom] = useState(4);


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then (response => response.json())
    .then (data => {
      setCountryInfo(data);
    });
  }, []);


  useEffect(() => {
    const getCountriesData = async () => {
     await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country, // United States, United Kingdom, France
            value: country.countryInfo.iso2, // USA, UK, FR
          }));

          const sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
      });
    };

    getCountriesData();
  }, []);

  
  // Retrieve country data when country is clicked from dropdown
  const cleanedDate = new Date(countryInfo.updated).toString();

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    //setCountryInfo(countryCode);

    const url = 
      countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all" 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setInputCountry(countryCode); //update input field
      setCountryInfo(data); //store all country data from response 
      setMapCenter([data.lat, data.long]);
      setMapZoom(4);
      //setCountryInfo(countryCode);
    });
  };

  //console.log("COUNTRY INFO >>>", countryInfo);

  return (
    <div className="app"> 
      <div className="app__left">
        <div className="app__header">
          <h1> DAILY COVID-19 TRACKER</h1> 
        
          <FormControl className="app__dropdown">
            <Select 
              variant="outlined" 
              onChange={onCountryChange} 
              value={country}
            >
            <MenuItem a href="/#" value="worldwide">Worldwide</MenuItem>
            {countries.map((country) => (
                <MenuItem key="{country.name}" value={country.value}>{country.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox 
            onClick={(e) => setCasesType('cases')}
            title="New Cases" isRed
            active={casesType === "cases"}
            cases={numeral(countryInfo.todayCases).format("0,000,000")} 
            total={numeral(countryInfo.cases).format("0,000,000")}
          />
          <InfoBox 
            onClick={(e) => setCasesType('recovered')}
            title="New Recoveries" 
            active={casesType === "recovered"}
            cases={numeral(countryInfo.todayRecovered).format("0,000,000")} 
            total={numeral(countryInfo.recovered).format("0,000,000")}
          />
          <InfoBox 
            onClick={(e) => setCasesType('deaths')}
            title="New Deaths"
            isRed 
            active={casesType === "deaths"}
            cases={numeral(countryInfo.todayDeaths).format("0,000,000")} 
            total={numeral(countryInfo.deaths).format("0,000,000")}
          />
        </div>


        {/* Map */}
        <Map  
          countries={mapCountries} 
          casesType={casesType} 
          center={mapCenter} 
          zoom={mapZoom}
        />


      <p class="date">Last updated on {cleanedDate}</p>
      </div>  
      
       
      {/* Table */}
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <p>{}</p>
            <Table countries = {tableData} />    
          </div>

          {/* Graph */}
          <h3 className = "app__graphTitle" >Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>

      <ScrollButton />
    </div>
    
  );

}

export default App;