import { useEffect, useRef, useState } from "react";
import Alert from "./components/Alert";
import Button from "./components/Button";
import ListGroup from "./components/ListGroup/ListGroup";
import ExpandableText from "./components/ExpandableText";
import Form from "./components/Form";
import ExpenseProject from "./components/ExpenseProject";
import ProductList from "./components/ProductList";
import HttpApp from "./components/HttpApp";

function App() {
  let items = [
    'Detroit',
    'Indianapolis',
    'Chicago',
    'Nashville'
  ];

  function handleSelectItem(item: string) {
    console.log(item);
  }

  const [shouldShowAlert, setShouldShowAlert] = useState(false);


  // return <div><ListGroup heading="My List" items={items} onSelectItem={handleSelectItem}/></div>
  // return <Alert><div>Hello Hello</div></Alert>;
  // return (
  //   <>
  //     <Alert onClose={() => setShouldShowAlert(false)} shouldShowAlert={shouldShowAlert}>My Alert</Alert>
  //     <Button onClick={() => { 
  //       setShouldShowAlert(true);
  //       console.log(shouldShowAlert);
  //     }}>
  //       Click me!
  //     </Button>
  //   </>
  // );

  // const [firstName, setFirstName] = useState('');
  // const [lastName, setLastName] = useState('');
  const [sports, setSports] = useState([
    'basketball',
    'football',
    'baseball',
    'tennis',
    'hockey'
  ]);


  function handleClick() {
    setSports(sports.map((sport) => {
      if (sport !== 'baseball') return sport;
      return 'soccer';
  }));
    console.log('clicked');
  }

  // return (
  // <>
  //   <ExpandableText>
  //     hello world
  //   </ExpandableText>
  // </>
  // );

  // return (
  //   <>
  //     <Form />
  //   </>
  // );


  // return (
  //   <ExpenseProject />
  // );

  // const inputElementRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   inputElementRef.current?.focus();
  // });

  // useEffect(() => {
  //   document.title = 'My React App';
  // });

  // return (
  //   <div>
  //     <input type="text" ref={inputElementRef} />
  //   </div>
  // );


  // const [category, setCategory] = useState('');
  // return (
  //   <>
  //     <select onChange={(event) => setCategory(event.target.value)}>
  //       <option value=""></option>
  //       <option value="Clothing">Clothing</option>
  //       <option value="Household">Household</option>
  //     </select>
  //     <ProductList category={category} />
  //   </>
  // );


  //   const connect = () => console.log('Connecting');
  //   const disconnect = () => console.log('Disconnecting');

  //   useEffect(() => {
  //     connect();

  //     return disconnect;
  //   });
    
  //   return (
  //     <>
  //       <div></div>
  //     </>
  //   );


  return  (
    <HttpApp />
  );
}



export default App;
