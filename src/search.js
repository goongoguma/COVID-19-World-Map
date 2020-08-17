import React from 'react'
import * as d3 from 'd3';
import { timeDay } from 'd3';

export const Search = () => {
  const [country, setCountry] = React.useState('');
  const [covidData, setCovidData] = React.useState([]);
  const margin = { top: 32, right: 32, bottom: 32, left: 32 };

  const changeText = e => {
    setCountry(e.target.value)
  }

  const searchCountry = async () => {
    await fetch(`https://api.covid19api.com/total/dayone/country/${country}`).then(res => res.json().then(data => {
      setCovidData(data)
    }))
  }

  const svg = d3.select('svg');
  const width = covidData.length * 41;
  const height = 700;

  if (covidData.length > 0) {
    console.log(width)
    console.log(covidData)
    const timeRange = d3.extent(covidData, function (d) { return new Date(d.Date) });
    const xAxis = d3.scaleTime().domain(timeRange).range([0, covidData.length * 40])
    svg.append('g')
      .attr('transform', 'translate(' + 60 + ',' + (700 - margin.bottom - margin.top - 32) + ')')
      .call(d3.axisBottom(xAxis).ticks(timeDay).tickFormat(d3.timeFormat("%m/%d")))

    const confirmedRange = d3.extent(covidData, function (d) { return d.Confirmed });
    console.log(confirmedRange)
    const yAxis = d3.scaleLinear().domain(confirmedRange).range([500, 0]);
    svg.append('g')
      .attr('transform', 'translate(60, 104)')
      .call(d3.axisLeft(yAxis))

    // svg
    //   .selectAll('.bar')
    //   .data(covidData)
    //   .enter().append('rect')
    //   .attr('class', 'bar')
    //   .attr('x', function (d) { return xAxis(new Date(d.Date)) })
    //   .attr('width', 20)
    //   .attr('y', function (d, i) { return yAxis(d.Confirmed) })
    //   .attr('height', function (d, i) { return yAxis(d.Confirmed) * i })
    //   .attr('transform', 'translate(40, -300)')
  }

  return (
    <>
      <h1>Search Country</h1>
      <input type='text' onChange={(e) => changeText(e)} value={country} />
      <button onClick={searchCountry}>Search</button>
      <div id='container'>
        <svg id="line-graph" width={width} height={height} style={{ overflow: 'scroll' }} />
      </div>
    </>
  )
}
