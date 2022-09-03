import jwt_decode from "jwt-decode";
import { useEffect, useState, Fragment } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { DataGrid } from "@mui/x-data-grid";
import "./App.css";

function App() {
  const [user, setUser] = useState({});
  const [googleAccessToken, setGoogleAccessToken] = useState("");
  const [products, setProducts] = useState([]);
  const [vendingMachines, setVendingMachines] = useState([]);
  const [inventories, setInventoriesByProduct] = useState([]);
  const [inventoriesByLocation, setInventoriesByLocation] = useState([]);

  const products_columns = [
    { field: "id", headerName: "Product ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: false,
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      editable: false,
    },
    {
      field: "imageURL",
      headerName: "Image",
      width: 250,
      editable: false,
    },
    {
      field: "cost",
      headerName: "Cost",
      type: "number",
      width: 90,
      editable: false,
    },
  ];

  const vendingMachines_columns = [
    { field: "id", headerName: "Product ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: false,
    },
  ];

  const inventories_columns = [
    { field: "id", headerName: "Product ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: false,
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      editable: false,
    },
    {
      field: "imageURL",
      headerName: "Image",
      width: 250,
      editable: false,
    },
    {
      field: "cost",
      headerName: "Cost",
      type: "number",
      width: 90,
      editable: false,
    },
    {
      field: "count",
      headerName: "Count",
      type: "number",
      width: 90,
      editable: false,
    },
    {
      field: "locationName",
      headerName: "Location Name",
      width: 150,
      editable: false,
    },
  ];

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    setGoogleAccessToken(response.credential);
    let userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
  }

  function handleSignOut(event) {
    setUser({});
    setGoogleAccessToken("");
    setProducts([]);
    setInventoriesByProduct([]);
    setInventoriesByLocation([]);
    setVendingMachines([]);
    document.getElementById("signInDiv").hidden = false;
  }

  function getProducts(event) {
    setProducts([]);
    console.log("products: " + JSON.stringify(products));
    fetch("http://localhost:8080/api/v1/product", {
      headers: {
        Authorization: googleAccessToken,
      },
    })
      .then((response) => response.json())
      .then((_products) => setProducts(_products));
    console.log("products: " + JSON.stringify(products));
    document.getElementById("products").hidden = false;
    document.getElementById("vendingMachines").hidden = true;
    document.getElementById("inventories").hidden = true;
    document.getElementById("inventoriesByLocation").hidden = true;
  }

  function getVendingMachines(event) {
    setVendingMachines([]);
    console.log("vendingMachines: " + JSON.stringify(vendingMachines));
    fetch("http://localhost:8080/api/v1/vendingMachine", {
      headers: {
        Authorization: googleAccessToken,
      },
    })
      .then((response) => response.json())
      .then((_vendingMachines) => setVendingMachines(_vendingMachines));
    console.log("vendingMachines: " + JSON.stringify(vendingMachines));
    document.getElementById("products").hidden = true;
    document.getElementById("vendingMachines").hidden = false;
    document.getElementById("inventories").hidden = true;
    document.getElementById("inventoriesByLocation").hidden = true;
  }

  async function getInventoriesByProduct(params) {
    console.log(params);
    console.log("inventories: " + JSON.stringify(inventories));
    await setInventoriesByProduct([]);
    console.log("inventories: " + JSON.stringify(inventories));
    let response = await fetch(
      "http://localhost:8080/api/v1/inventory/product?product_id=" +
        params.row.id,
      {
        headers: {
          Authorization: googleAccessToken,
        },
      }
    );
    let _inventories = await response.json();
    console.log(_inventories);
    setInventoriesByProduct(_inventories);
    console.log("inventories: " + JSON.stringify(inventories));
    document.getElementById("products").hidden = true;
    document.getElementById("vendingMachines").hidden = true;
    document.getElementById("inventories").hidden = false;
    document.getElementById("inventoriesByLocation").hidden = true;
  }

  function getProductsByLocation(params) {
    let location_name = params.row.locationName
      ? params.row.locationName
      : params.row.name;

    console.log(params);
    console.log(
      "inventoriesByLocation: " + JSON.stringify(inventoriesByLocation)
    );
    setInventoriesByLocation([]);
    console.log(
      "inventoriesByLocation: " + JSON.stringify(inventoriesByLocation)
    );
    fetch(
      "http://localhost:8080/api/v1/product/location?location_name=" +
        location_name,
      {
        headers: {
          Authorization: googleAccessToken,
        },
      }
    )
      .then((response) => response.json())
      .then((_inventoriesByLocation) =>
        setInventoriesByLocation(_inventoriesByLocation)
      );
    console.log(
      "inventoriesByLocation: " + JSON.stringify(inventoriesByLocation)
    );
    document.getElementById("products").hidden = true;
    document.getElementById("vendingMachines").hidden = true;
    document.getElementById("inventories").hidden = true;
    document.getElementById("inventoriesByLocation").hidden = false;
  }

  useEffect(() => {
    const REACT_APP_CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    /* global google */
    google.accounts.id.initialize({
      //PLEASE MAKE AN ENV VARIABLE FOR CLIENT ID
      client_id: `${REACT_APP_CLIENT_ID}`, // "*********PLACE YOUR ********* GOOGLE CLIENT ID********* HERE*********",
      callback: handleCallbackResponse,
    });
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
    google.accounts.id.prompt();
  }, []);
  // if we have no user: sign in button
  // if we have a user: show the log out button
  return (
    <Fragment>
      <CssBaseline enableColorScheme />
      <div className="App">
        <div id="signInDiv"></div>
        {Object.keys(user).length !== 0 && (
          <Button variant="contained" onClick={(e) => handleSignOut(e)}>
            Sign Out
          </Button>
        )}
        {user && (
          <div>
            <img src={user.picture} alt=""></img>
            <h3>{user.name}</h3>
            <h4>{user.email}</h4>
            {Object.keys(user).length !== 0 && (
              <Box sx={{ width: "100%" }}>
                <Stack direction="row" spacing={5}>
                  <Button variant="contained" onClick={(e) => getProducts(e)}>
                    Retrieve Products
                  </Button>
                  <Button
                    variant="contained"
                    onClick={(e) => getVendingMachines(e)}
                  >
                    Retrieve Vending Machines
                  </Button>
                </Stack>
              </Box>
            )}
          </div>
        )}
        {products && (
          <div id="products">
            {Object.keys(products).length !== 0 && (
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  onRowClick={getInventoriesByProduct}
                  rows={products}
                  columns={products_columns}
                />
              </Box>
            )}
          </div>
        )}
        {vendingMachines && (
          <div id="vendingMachines">
            {Object.keys(vendingMachines).length !== 0 && (
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  onRowClick={getProductsByLocation}
                  rows={vendingMachines}
                  columns={vendingMachines_columns}
                />
              </Box>
            )}
          </div>
        )}
        {inventories && (
          <div id="inventories">
            {Object.keys(inventories).length !== 0 && (
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  onRowClick={getProductsByLocation}
                  rows={inventories}
                  columns={inventories_columns}
                />
              </Box>
            )}
          </div>
        )}
        {inventoriesByLocation && (
          <div id="inventoriesByLocation">
            {Object.keys(inventoriesByLocation).length !== 0 && (
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={inventoriesByLocation}
                  columns={inventories_columns}
                />
              </Box>
            )}
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default App;
