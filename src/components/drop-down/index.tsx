import React, { useEffect, useState, KeyboardEvent, CSSProperties, useRef } from 'react';
import './index.scss';

type Item = {
  origin: any,
  selected: boolean
}

function MultiDropDown(props: MultiDropDownProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const [inputVal, setInputVal] = useState('');
  const [items, setItems] = useState<Item[]>([]);

  const toggleTray = (open?: boolean) => {
    let arrow = boxRef.current!.querySelector('span')! as HTMLElement;
    let input = boxRef.current!.querySelector('input')! as HTMLInputElement;
    if (open === undefined) open = arrow.getAttribute('data-open') !== 'true';
    trayRef.current!.style.display = open ? 'block' : 'none';
    arrow.style.transform = open ? 'rotate(90deg)' : 'rotate(-90deg)';
    arrow.setAttribute('data-open', open ? 'true' : 'false');
    if (open) input.focus();
  }

  useEffect(() => {
    if (props.items) {
      setItems(props.items.map(origin => {
        return {
          origin,
          selected: (props.selectedItems?.indexOf(origin) ?? -1) >= 0
        }
      }));
      trayRef.current!.style.left = boxRef.current!.offsetLeft + 'px';
      trayRef.current!.style.width = boxRef.current!.offsetWidth + 'px';
    }

    const handleDocumentClick = () => toggleTray(false);
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    }
  }, [props.items]);

  const getLabelStr = () =>
    items
      .filter(c => c.selected)
      .map(c => props.getItemLabel(c.origin))
      .join(", ");

  const inputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let origin = props.addItem(e.currentTarget.value);
      items.push({ origin, selected: true });
      setItems([...items]);
      setInputVal('');
    }
  };

  const itemClick = (item: Item) => {
    item.selected = !item.selected;
    setItems([...items]);
  }

  const boxClick = (e: React.MouseEvent<HTMLDivElement>, open?: boolean) => {
    toggleTray(open);
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <>
      <div ref={boxRef} style={{ width: props.style?.width ?? '100%' }} className='multi-dropdown__box' onClick={e => boxClick(e)}>
        <label>{getLabelStr()}
          <input placeholder='Add new one'
            name='multi-dropdown__input'
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={inputKeyDown} />
        </label>
        <span data-open="false">‹</span>
      </div>
      <div ref={trayRef} className='multi-dropdown__tray' onClick={e => boxClick(e, true)}>
        <ul style={{ listStyleType: 'none', padding: '8px' }}>
          {items.map((item, index) =>
            <li
              key={index}
              className={(item.selected ? 'multi-dropdown__selected' : '')}
              onClick={() => itemClick(item)}>
              {props.renderItem(item.origin)}
              {item.selected && <span className='multi-dropdown__tick'>✓</span>}
            </li>)
          }
        </ul>
      </div>
    </>
  );
}

interface MultiDropDownProps {
  items?: any[],
  selectedItems?: any[],
  getItemLabel: (item: any) => string,
  renderItem: (item: any) => any,
  addItem: (item: string) => any,
  onChange: (items: any[]) => any,
  style?: CSSProperties
}

export default MultiDropDown;