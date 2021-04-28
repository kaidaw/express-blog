import React from "react";

function App() {
  return (
    <div className="App">
      SOME DATA SHOULD BE BELOW
      <Data></Data>
    </div>
  );
}

function Data() {
  let [array, setArray] = React.useState(null);
  React.useEffect(() => {
    async function getData() {
      fetch("http://localhost:3000").then((data) => {
        setArray(data);
      });
    }
    getData();
  }, [array]);
  return <div>{array ? array : null}</div>;
}

export default App;
