import * as d3 from 'd3';
import { FeatureCollection } from 'geojson';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import * as topojson from 'topojson-client';
import { Topology, GeometryObject } from 'topojson-specification';

import us from '../../data/states-albers-10m.json';

const StateMap = () => {
  // Const values
  const width = 900;
  const height = 600;

  // Does magic, converts geomtry to array of numbers, that makes possible to use them to draw line
  const path = d3.geoPath();
  const [infobox, setInfobox] = useState('');

  const svgRef = useRef(null);

  useEffect(() => {
    const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed);
    const svg = d3.select(svgRef.current).on('click', reset);
    svg.selectAll('*').remove();
    const g = svg.append('g');

    const states = g
      .attr('fill', '#444')
      .attr('cursor', 'pointer')
      .selectAll('path')
      .data(
        (
          topojson.feature(
            us as unknown as Topology,
            us.objects.states as GeometryObject
          ) as FeatureCollection
        ).features
      )
      .join('path')
      .on('click', clicked)
      .attr('d', path);

    states.append('title').text((d) => d.properties.name);

    g.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-linejoin', 'round')
      .attr(
        'd',
        path(
          topojson.mesh(
            us as unknown as Topology,
            us.objects.states as GeometryObject,
            (a, b) => a !== b
          )
        )
      );
    function reset() {
      states.transition().style('fill', null);
      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform,
          d3.zoomIdentity,
          d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
        );
      setInfobox('');
    }

    function clicked(event, d) {
      const [[x0, y0], [x1, y1]] = path.bounds(d);
      event.stopPropagation();
      states.transition().style('fill', null);

      setInfobox(d.properties.name);
      d3.select(this).transition().style('fill', 'red');
      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform,
          d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(
              Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
            )
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
          d3.pointer(event, svg.node())
        );
    }

    function zoomed(event) {
      const { transform } = event;
      g.attr('transform', transform);
      g.attr('stroke-width', 1 / transform.k);
    }
  }, []);

  return (
    <>
      {infobox && (
        <div className='infobox'>
          <p>{infobox}</p>
        </div>
      )}
      <svg
        className='svg_info'
        ref={svgRef}
        viewBox={`0,0,${width},${height}`}
        width={width}
        height={height}></svg>
    </>
  );
};

export default StateMap;
