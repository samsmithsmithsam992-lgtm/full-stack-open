import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

    console.log("API KEY:", import.meta.env.VITE_WEATHER_KEY)
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
  if (!selectedCountry) return

  const api_key = import.meta.env.VITE_WEATHER_KEY
  const capital = selectedCountry.capital?.[0]

  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`
    )
    .then(response => {
      setWeather(response.data)
    })
    .catch(error => {
      console.log('weather error:', error)
    })
}, [selectedCountry])

  const handleSearch = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
    setWeather(null)
  }

  const filteredCountries =
    search === ''
      ? []
      : countries.filter(country =>
          country.name.common.toLowerCase().includes(search.toLowerCase())
        )

  return (
    <div>
      <h2>Countries</h2>

      <div>
        find countries:{' '}
        <input value={search} onChange={handleSearch} />
      </div>

      {filteredCountries.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {filteredCountries.length > 1 && filteredCountries.length <= 10 && (
        <ul>
          {filteredCountries.map(country => (
            <li key={country.cca3}>
              {country.name.common}{' '}
              <button onClick={() => setSelectedCountry(country)}>
                show
              </button>
            </li>
          ))}
        </ul>
      )}

      {filteredCountries.length === 1 && (
        <div>
          <h3>{filteredCountries[0].name.common}</h3>
          <p>capital: {filteredCountries[0].capital}</p>
          <p>area: {filteredCountries[0].area}</p>
        </div>
      )}

      {selectedCountry && (
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>capital: {selectedCountry.capital}</p>
          <p>area: {selectedCountry.area}</p>

          {weather && (
            <div>
              <h3>Weather in {selectedCountry.capital}</h3>
              <p>temperature {weather.main.temp} °C</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
              />
              <p>wind {weather.wind.speed} m/s</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App