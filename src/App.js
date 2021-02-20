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

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');

  useEffect(() => {
    const getCountriesData = async () => {
      fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
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
            title='coronavirus cases'
            cases={1000}
            total={2000}
          ></InfoBox>
          <InfoBox title='Recovered' cases={1000} total={2000}></InfoBox>
          <InfoBox title='deaths' cases={1000} total={2000}></InfoBox>
        </div>
        <Map />
      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>live cases by country</h3>
          <h3>worldwide new cases</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
