import { useState } from "react";
import styles from './ListGroup.module.css';

interface ListGroupProps {
  items: string[];
  heading: string;
  onSelectItem: (item: string) => void;
}

export default function ListGroup({items, heading, onSelectItem}: ListGroupProps) {



  const [ selectedIndx, setSelectedIndx ] = useState(-1);

  const handleClick = (indx: number) => {
    setSelectedIndx(indx);
  };

  return (
    <>
      <h1>{heading}</h1>
      {(items.length > 0) && ( 
        <ul className={styles['list-group']}>
          {items.map((item, indx) => (
            <li
              key={item}
              onClick={() => {
                handleClick(indx);
                onSelectItem(item);
              }}
              className={`item ${(selectedIndx === indx) ? 'selected-item' : ''}`}
            >
              item: {item}
            </li>
          ))}
        </ul>
      )}
      {(items.length > 0) || (
        <p>No items found</p>
      )}
    </>
  );
}