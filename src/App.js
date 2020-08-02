import React, { useState, useEffect } from 'react';
import { select, json, geoPath, geoNaturalEarth1, zoom } from 'd3';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import axios from 'axios';
import CountUp from 'react-countup';
import './App.css';

export const App = () => {
  const [covidData, setCovidData] = useState(null);
  const [date, setDate] = useState(null);

  const renderMap = (covidData) => {
    const svg = select('svg');
    const projection = geoNaturalEarth1();
    const pathGenerator = geoPath().projection(projection);
    let newData = [];

    const tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('background', '#fff')
      .style('visibility', 'hidden')
      .style('border-radius', '20px');

    svg.append('path')
      .attr('class', 'sphere')
      .attr('d', pathGenerator({ type: 'Sphere' }))


    json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(data => {
      const countries = topojson.feature(data, data.objects.countries);
      const covidCountryNameArr = covidData.map(data => data.Country)

      // country 데이터와 coivd-19 데이터를 병합
      countries.features.forEach(data => {
        if (!covidCountryNameArr.includes(data.properties.name)) {
          newData.push(data)
        }
        covidData.forEach(covid => {
          if (data.properties.name === covid.Country) {
            newData.push(
              {
                ...data,
                ...covid
              }
            )
          }
        })
      })

      svg.selectAll('path')
        .data(newData)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', d => pathGenerator(d))
        .on("mouseover", function (d) {
          return tooltip.style("visibility", "visible").html(() => {
            console.log(d)
            if (d.Country) {
              return `<div class='tooltip'>
              <h4>${d.Country}</h4>
              <p>- New Confirmed: ${d.NewConfirmed}</p>
              <p>- New Deaths: ${d.NewDeaths}</p>
              <p>- New Recovered: ${d.NewRecovered}</p>
              <p>- Total Confirmed: ${d.NewConfirmed}</p>
              <p>- Total Death: ${d.TotalDeaths}</p>
              <p>- Total Recovered: ${d.TotalRecovered}</p>
              </div>`
            } else {
              return `<div class='tooltip'>
              <h4>${d.properties.name}</h4>
              <p>No Information</p>
              </div>`
            }
          })
        })
        .on("mousemove", function (d) { return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"); })
        .on("mouseout", function (d) { return tooltip.style("visibility", "hidden"); });
    });
  }

  useEffect(() => {
    axios.get('https://api.covid19api.com/summary').then(res => {
      renderMap(res.data.Countries);
      setCovidData(res.data.Global);
      setDate(res.data.Date);
    })
  }, []);

  return (
    <div>
      <div className='container' style={{ 'position': 'relative' }}>
        <svg width='960' height='500' />
      </div>
      {
        covidData &&
        <div className='info-container'>
          <h4 className='info-title'>Current global Covid-19 Status({date?.substr(0, 10)})</h4>
          <div className='info new-confirmed'>
            <span>New Confirmed: </span><CountUp delay={0} end={covidData.NewConfirmed} />
          </div>
          <div className='info new-death'>
            <span>New Death: </span><CountUp delay={0} end={covidData.NewDeaths} />
          </div>
          <div className='info new-recovered'>
            <span>New Recovered: </span><CountUp delay={0} end={covidData.NewRecovered} />
          </div>
          <div className='info total-confirmed'>
            <span>Total Confirmed: </span><CountUp delay={0} end={covidData.TotalConfirmed} />
          </div>
          <div className='info total-deaths'>
            <span>Total Deaths: </span><CountUp delay={0} end={covidData.TotalDeaths} />
          </div>
          <div className='info total-recovered'>
            <span>Total Recovered: </span><CountUp delay={0} end={covidData.TotalRecovered} />
          </div>
        </div>
      }
    </div>

  )
}


export default App;
