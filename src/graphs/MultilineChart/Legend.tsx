import React from 'react';

interface LegendProps {
  data: any;
  selectedItems: any;
  onChange: any;
}

const Legend: React.FC<LegendProps> = ({ data, selectedItems, onChange }) => {
  return (
    <div className='legendContainer'>
      {data.map((d) => (
        <div className='checkbox' style={{ color: d.color }} key={d.name}>
          <label>
            {d.name !== 'Portfolio' && (
              <input
                type='checkbox'
                checked={selectedItems.includes(d.name)}
                onChange={() => onChange(d.name)}
              />
            )}
            {d.name}
          </label>
        </div>
      ))}
    </div>
  );
};

export default Legend;
