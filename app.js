const currencies = {
    USD: 'United States Dollar',
    AUD: 'Australian Dollar',
    BGN: 'Bulgarian Lev',
    BRL: 'Brazilian Real',
    CAD: 'Canadian Dollar',
    CHF: 'Swiss Franc',
    CNY: 'Chinese Yuan',
    CZK: 'Czech Republic Koruna',
    DKK: 'Danish Krone',
    GBP: 'British Pound Sterling',
    HKD: 'Hong Kong Dollar',
    HRK: 'Croatian Kuna',
    HUF: 'Hungarian Forint',
    IDR: 'Indonesian Rupiah',
    ILS: 'Israeli New Sheqel',
    INR: 'Indian Rupee',
    JPY: 'Japanese Yen',
    KRW: 'South Korean Won',
    MXN: 'Mexican Peso',
    MYR: 'Malaysian Ringgit',
    NOK: 'Norwegian Krone',
    NZD: 'New Zealand Dollar',
    PHP: 'Philippine Peso',
    PLN: 'Polish Zloty',
    RON: 'Romanian Leu',
    RUB: 'Russian Ruble',
    SEK: 'Swedish Krona',
    SGD: 'Singapore Dollar',
    THB: 'Thai Baht',
    TRY: 'Turkish Lira',
    ZAR: 'South African Rand',
    EUR: 'Euro',
  };

const from_currency = document.querySelector('[name="from_currency"]');
const to_currency = document.querySelector('[name="to_currency"]');
const api_endpoint = 'https://api.exchangeratesapi.io/latest';
const rateMap = new Map();
const staleThreshold = 10;


function generateOptions(currencies) {
    return Object.entries(currencies)
            .map(([currencyValue, currencyName]) => `<option value="${currencyValue}">${currencyValue} - ${currencyName}</option>`)
            .join('');
}

let options = generateOptions(currencies);
from_currency.innerHTML = options;
to_currency.innerHTML = options;



async function getRates(base = 'CAD') {
    const response = await fetch(`${api_endpoint}?base=${base}`);
    //console.log({response});
    const rates = await response.json();
    
    return rates;
}


async function convert(from, to, amount) {
    //check if from rate is available in rateMap
    //check if rates are state
    //if not get fresh rates
    const start = Date.now();
    let fetchRates = false;
   
    
    if(rateMap.has(from)) {
        fetchRates = false;
        const { updatedOn } = rateMap.get(from);
        const diffInSeconds = Math.floor((start - updatedOn) / 1000);

        if(diffInSeconds > staleThreshold) {
            fetchRates = true; //possible stale rates
        }
      

    } else {
        fetchRates = true;
    }
    

    if(fetchRates) {
        const { rates } = await getRates(from);
        rateMap.set(from, {rates, updatedOn: Date.now()});
        
    } 

    let convertedAmt = 0;
    
    if(rateMap.has(from)) {

        const rate  = rateMap.get(from);
       
        if(rate.rates.hasOwnProperty(to)) {

            convertedAmt = (rate.rates[to] * amount).toFixed(2);
        }
        
    }
   
    
    //console.log({convertedAmt});
    return;

}


//getRates();
//console.log({from_currency, to_currency, options})
convert('CAD', 'INR', 1000);

setTimeout(() => convert('CAD', 'INR', 1000), 3000);
