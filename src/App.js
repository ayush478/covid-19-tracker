import React, { useState, useEffect } from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from '@material-ui/core';

import './App.css';
import InfoBox from './infoBox';
import Map from './Map';
import 'leaflet/dist/leaflet.css';
import Table from './table';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);
  const onCountryChange = async (event) => {
    setLoading(true);
    const countryCode = event.target.value;

    setCountry(countryCode);

    const url =
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    //https://disease.sh/v3/covid-19/all
    //https://disease.sh/v3/covid-19/countries/[countryCode]

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setLoading(false);
        // console.log([data.countryInfo.lat, data.countryInfo.long]);
        countryCode === 'worldwide'
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });

    console.log(countryInfo);
  };
  return (
    <div className='app'>
      <div className='app__left'>
        <div className='app__header'>
          <h1>COVID-19 TRACKER</h1>
          <FormControl className='app__dropdown'>
            <Select
              variant='outlined'
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {/* loop through all the countries and show a dropdown */}
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/*title + select input dropdown field*/}
        <div className='app__stats'>
          <InfoBox
            onClick={(e) => setCasesType('cases')}
            title='coronavirus cases'
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={countryInfo.cases}
          ></InfoBox>
          <InfoBox
            onClick={(e) => setCasesType('recovered')}
            title='Recovered'
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
          ></InfoBox>
          <InfoBox
            onClick={(e) => setCasesType('deaths')}
            title='deaths'
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
          ></InfoBox>
        </div>
        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
