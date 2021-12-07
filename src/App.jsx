import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const KEY = "stocks";
const API_URL = "https://yh-finance.p.rapidapi.com/";
const STOCK_SUMMARY = "stock/v2/get-summary";

// to be private
const X_RAPID_KEY = "58580ffebemsh82090c08f424cb2p1ca11djsnd897f9c7bc9c";

const App = () => {

  const [stocks, setStocks] = useState({
    list: [],
    updateCounter: 0,
  });

  const [display, setDisplay] = useState([])

  return (
    <div className="App">
      <header className="App-header">
        <StocksList stocks={stocks} setStocks={setStocks}></StocksList>
        <SearchBar display={display} setDisplay={setDisplay}></SearchBar>
        <StockAdder stocks={stocks} setStocks={setStocks} display={display}></StockAdder>
        <StockSummaryDisplay display={display}></StockSummaryDisplay>
      </header>
    </div>
  );
}

const StockSummaryDisplay = ({display}) => {
  return (
    <div>
      {display.map(x => 
      <Grid key={Math.random()}>
        <Box key={Math.random()}>
          {x.symbol + ' ' + x.regularMarketPrice.raw}
        </Box>
      </Grid>
      )}
    </div>
  )
}

const SearchBar = ({display, setDisplay}) => {
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
      stock = data.data.price;
      console.log(stock);
    } catch (e) {
      console.error(e);
    }

    if (stock === "" || stock === undefined) {
      return;
    } else {
      let updatedList = [...display, stock];
      displaySearchlist(updatedList, display, setDisplay);
    }
  }

  return (
    <div>
      <input onChange={(term) => getSearchTerm(term, setSearchTerm)}/>
      <button onClick={searchStock}>Search Stock</button>
    </div>
  )
}

const StockAdder = ({stocks, setStocks, display}) => {
  const addStock = (stock) => {
    let copy = [...stocks.list, stock];
    updateStockList(copy, stocks, setStocks);
  }

  return (
    <div>
      <button onClick={() => {
        for (let i = 0; i < display.length; i++) {
          addStock(display[i].symbol);
        }
      }}>Add stocks</button>
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
        {stocks.list.map(x => 
          <Box>
            {x}
          </Box>)}
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

function displaySearchlist(list, display, setDisplay) {
  setDisplay(list);
}

// API functions

export default App;
