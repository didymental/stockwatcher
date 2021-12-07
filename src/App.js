import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

const KEY = "stocks";
const API_URL = "https://yh-finance.p.rapidapi.com/";
const STOCK_SUMMARY = "stock/v2/get-summary";

// to be privated
const X_RAPID_KEY = "58580ffebemsh82090c08f424cb2p1ca11djsnd897f9c7bc9c";

const App = () => {

  const [stocks, setStocks] = useState({
    list: [],
    updateCounter: 0,
  });

  return (
    <div className="App">
      <header className="App-header">
        <StocksList stocks={stocks} setStocks={setStocks}></StocksList>
        <StockAdder stocks={stocks} setStocks={setStocks}></StockAdder>
        <SearchBar stocks={stocks} setStocks={setStocks}></SearchBar>
        <StockSummaryDisplay></StockSummaryDisplay>
      </header>
    </div>
  );
}

const StockSummaryDisplay = () => {
  return (
    <div>
      
    </div>
  )
}

const SearchBar = ({stocks, setStocks}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const searchStock = async () => {
    let stock = ""
    try {
      let data = await axios.get(API_URL + STOCK_SUMMARY, {
        headers: {
          'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
          'x-rapidapi-key': `${X_RAPID_KEY}`
        },
        params: {
          symbol: `${searchTerm}`,
          region: 'US'
        }
      });
      stock = data.data.financialData.currentPrice.raw;
    } catch (e) {
      console.error(e);
    }

    if (stock === "") {
      return;
    } else {
      let updatedList = [...stocks.list, stock];
      // updateStockList(updatedList, stocks, setStocks);
    }
  }

  return (
    <div>
      <input onChange={(term) => getSearchTerm(term, setSearchTerm)}/>
      <button onClick={searchStock}>Search Stock</button>
    </div>
  )
}

const StockAdder = ({stocks, setStocks}) => {
  const addStocks = (stock) => {
    let copy = [...stocks.list, stock];
    updateStockList(copy, stocks, setStocks);
  }

  return (
    <div>
      <button onClick={() => addStocks("testing")}>Add stock</button>
    </div>
  )
}

const StocksList = ({stocks, setStocks}) => {

  const getStocks = () => {
    if (!storageIsEmpty()) {
      setStocks({...stocks, list: getStockList().map(x => x)});
    }
  }

  useEffect(() => {
    // side effect
    getStocks();

    // cleanup function -- called when dependencies change or component is unmounted
    return () => {
      setStocks({...stocks, list: []});
    };
  }, [stocks.updateCounter])

  return (
    <div>
        {stocks.list}
    </div>
  )
  
}

// StockList helper functions
function storageIsEmpty() {
  return localStorage.getItem(KEY) === null;
}

function getStockList() {
  return JSON.parse(localStorage.getItem(KEY));
}

// StockAdder helper functions
function updateStockList(list, stocks, setStocks) {
  localStorage.setItem(KEY, JSON.stringify(list));
  setStocks({...stocks, updateCounter: stocks.updateCounter + 1});
}

// SearchBar helper functions
function getSearchTerm(term, setSearchTerm) {
  setSearchTerm(term.target.value);
}

// API functions

export default App;
