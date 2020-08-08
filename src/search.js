import React from 'react'
import * as d3 from 'd3';

export const Search = () => {
  const [country, setCountry] = React.useState('');
  const [covidData, setCovidData] = React.useState([]);
  const margin = { top: 32, right: 32, bottom: 32, left: 32 };

  const changeText = e => {
    setCountry(e.target.value)
  }

  const searchCountry = async () => {
    await fetch(`https://api.covid19api.com/dayone/country/${country}/status/confirmed`).then(res => res.json().then(data => {
      setCovidData(data)
    }))
  }

  const svg = d3.select('svg');

  if (covidData.length > 0) {
    console.log(covidData)
    const timeRange = d3.extent(covidData, function (d) { return new Date(d.Date) });
    const x = d3.scaleTime().domain(timeRange).range([0, 1600]);
    svg.append('g')
      .attr('transform', 'translate(' + 32 + ',' + (500 - margin.bottom - margin.top - 32) + ')')
      .call(d3.axisBottom(x).ticks(d3.timeWeek))

    const confirmedRange = d3.extent(covidData, function (d) { return d.Cases });
    const y = d3.scaleLinear().domain(confirmedRange).range([0, 500]);
    svg.append('g')
      .call(d3.axisLeft(y))
  }

  return (
    <>
      <h1>Search Country</h1>
      <input type='text' onChange={(e) => changeText(e)} value={country} />
      <button onClick={searchCountry}>Search</button>
      <svg width='1600' height='500' />
    </>
  )
}
