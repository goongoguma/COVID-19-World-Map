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
    await fetch(`https://api.covid19api.com/dayone/country/${country}`).then(res => res.json().then(data => {
      setCovidData(data)
    }))
  }

  const svg = d3.select('svg');
  const width = 1800;
  const height = 500;

  if (covidData.length > 0) {
    console.log(covidData)
    const timeRange = d3.extent(covidData, function (d) { return new Date(d.Date) });
    const x = d3.scaleTime().domain(timeRange).range([0, covidData * 1800]);
    svg.append('g')
      .attr('transform', 'translate(' + 60 + ',' + (500 - margin.bottom - margin.top - 32) + ')')
      .call(d3.axisBottom(x).ticks(d3.timeDay))


    const confirmedRange = d3.extent(covidData, function (d) { return d.Confirmed });
    const y = d3.scaleLinear().domain(confirmedRange).range([400, 0]);
    svg.append('g')
      .attr('transform', 'translate(60, 4)')
      .call(d3.axisLeft(y))

    // svg.append('g')
    //   .selectAll('.bar')
    //   .data(covidData)
    //   .enter().append('rect')
    //   .attr('class', 'bar')
    //   .attr('x', function (d) { return x(new Date(d.Date)) })
    //   .attr('y', function (d) { return y(d.Confirmed) })
    //   .attr('width', 30)
    //   .attr('height', function (d) { return 400 / d.Confirmed })
  }

  return (
    <>
      <h1>Search Country</h1>
      <input type='text' onChange={(e) => changeText(e)} value={country} />
      <button onClick={searchCountry}>Search</button>
      <svg width={width} height={height} />
    </>
  )
}
