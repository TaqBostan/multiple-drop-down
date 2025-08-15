import { useState } from 'react';
import './App.scss';
import MultiDropDown from './components/drop-down';
const items = [
  { txt: 'test', icon: '⚽' },
  { txt: 'test1', icon: '🧑‍🎨' },
  { txt: 'test2', icon: '🎮' },
  { txt: 'test3', icon: '⚕️' }
]

function App() {
  const [selectedItems, setSelectedItems] = useState([items[0]]);

  const handleChange = (items: Item[]) => {
    setSelectedItems(items);
  };

  return (
    <div style={{ padding: '15px' }}>
      <div>
        <MultiDropDown
          selectedItems={selectedItems}
          onChange={handleChange}
          addItem={c => ({ txt: c })}
          getItemLabel={c => c.txt}
          renderItem={item => <span>{item.txt}  {item.icon}</span>}
          items={items}
          style={{ width: '400px' }} />
      </div>
    </div>
  );
}

type Item = { txt: string, icon: string }

export default App;
