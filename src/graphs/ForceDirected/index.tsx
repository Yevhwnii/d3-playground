import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import data from '../../data/miserables.json';

const ForceDirectedChart = () => {
  const width = 900;
  const height = 600;
  const svgRef = useRef(null);

  useEffect(() => {
    const links = data.links.map((d) => {
      return d as any;
    });
    const nodes = data.nodes.map((d) => {
      return d as any;
    });

    const scale = d3.scaleOrdinal(d3.schemeCategory10);
    const color = (d) => scale(d.group);

    const drag = (simulation: d3.Simulation<any, undefined>) => {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    };

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink<any, any>(links).id((d) => {
          //   console.log(d);

          return d.id;
        })
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    const svg = d3.select(svgRef.current);
    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d) => Math.sqrt(d.value));

    const node = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', color)
      .call(drag(simulation));

    node.append('title').text((d) => d.id);

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    });

    //   invalidation.then(() => simulation.stop());
    return () => {
      simulation.stop();
    };
  }, []);
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}></svg>
  );
};

export default ForceDirectedChart;
