import React from 'react';
import MultilineChart from './graphs/MultilineChart';
import schc from './data/SCHC.json';
import vcit from './data/VCIT.json';
import portfolio from './data/portfolio.json';
import Legend from './graphs/MultilineChart/Legend';
import StateMap from './graphs/StateMap';
import ForceDirectedChart from './graphs/ForceDirected';

const portfolioData = {
  name: 'Portfolio',
  color: '#ffffff',
  items: portfolio,
};
const schcData = { name: 'SCHC', color: '#d53e4f', items: schc };
const vcitData = { name: 'VCIT', color: '#5e4fa2', items: vcit };
const dimensions = {
  width: 600,
  height: 300,
  margin: { top: 30, right: 30, bottom: 30, left: 60 },
};

export default function App() {
  const [selectedItems, setSelectedItems] = React.useState([]);
  const legendData = [portfolioData, schcData, vcitData];
  const chartData = [
    portfolioData,
    ...[schcData, vcitData].filter((d) => selectedItems.includes(d.name)),
  ];

  const onChangeSelection = (name) => {
    const newSelectedItems = selectedItems.includes(name)
      ? selectedItems.filter((item) => item !== name)
      : [...selectedItems, name];
    setSelectedItems(newSelectedItems);
  };
  return (
    // Uncomment one of the components
    <div className='App'>
      {/* <Legend
        data={legendData}
        selectedItems={selectedItems}
        onChange={onChangeSelection}
      />
      <MultilineChart data={chartData} dimensions={dimensions} /> */}
      {/* <StateMap /> */}
      <ForceDirectedChart />
    </div>
  );
}
