import React, { Component } from "react";
import ERC721Brands from "./contracts/ERC721Brands.json";
import getWeb3 from "./getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import ReactDOM from 'react-dom';

import "./App.css";

class App extends Component {
  state = { 
      loaded: false,
      brands: [],
      brand: '',
   };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.deployedNetwork = ERC721Brands.networks[this.networkId];
      this.instance = new this.web3.eth.Contract(
        ERC721Brands.abi,
        this.deployedNetwork && this.deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded: true }, this.setBrands);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  setBrands = async() => {
    this.setState({brands: await this.instance.methods.getBrands().call()});
  }

  handleChange = event => {
    const value = event.target.value;
    const inputId = event.target.id;

    if(inputId === 'brand') {
      this.setState({brand: value});
    }
  }

  submit = async(event) => {
    event.preventDefault();
    const brand = this.state.brand;
    if(brand.length > 0) {
      await this.instance.methods.mint(brand).send({from: this.accounts[0]})
        .once('receipt', (receipt) => {
          this.setState({
            brands: [...this.state.brands, brand]
          });
        });
    }
  }

  render() {
    const brands = this.state.brands;
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div>
          <Form>
            <Form.Group controlId="brand">
              <Form.Control type="text" required placeholder="Enter a Brand to register(Eg : Shikari)" onChange={this.handleChange} autocomplete="off" />
            </Form.Group>
            <Button variant="primary" onClick={this.submit} type="Submit">
              Create Brand
            </Button>
          </Form>
          <br/>
          <div className="itemHead">
            {brands !== [] ? brands.map((item, key) => (
              <div className="itemBrand"> {item}</div>
            )) :null}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
