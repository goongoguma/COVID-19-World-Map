import React, { useEffect } from 'react';
import { select, json, geoPath, geoNaturalEarth1, zoom } from 'd3';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import axios from 'axios';
import './App.css';

export const App = () => {
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

    svg.append('path')
      .attr('class', 'sphere')
      .attr('d', pathGenerator({ type: 'Sphere' }));

    json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(data => {
      const countries = topojson.feature(data, data.objects.countries);
      const covidCountryNameArr = covidData.map(data => data.Country)

      // covid 배열에 포함되지 않는 geo 나라들은 본래의 프로퍼티를 유지한채로 newArray에 들어가야 한다 
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

      console.log(newData)

      svg.selectAll('path')
        .data(newData)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', d => pathGenerator(d))
        .on("mouseover", function (d) {
          return tooltip.style("visibility", "visible").html(() => {
            if (d.country) {
              return `<p>country</p>`
            } else {
              return `<p>no country</p>`
            }
          })
        })
        .on("mousemove", function (d) { return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"); })
        .on("mouseout", function (d) { return tooltip.style("visibility", "hidden"); });
    });
  }

  useEffect(() => {
    axios.get('https://api.covid19api.com/summary').then(res => {
      renderMap(res.data.Countries)
    })
  }, []);

  return (
    <div style={{ 'position': 'relative' }}>
      <svg width='960' height='500'></svg>
    </div>
  )
}


export default App;
