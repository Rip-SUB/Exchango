const currencyData = [
  // 🌍 Asia (Complete & Fixed)
  { country: "Afghanistan", code: "AFN", currency: "Afghan Afghani" },
  { country: "Armenia", code: "AMD", currency: "Armenian Dram" },
  { country: "Azerbaijan", code: "AZN", currency: "Azerbaijani Manat" },
  { country: "Bangladesh", code: "BDT", currency: "Bangladeshi Taka" },
  { country: "Bhutan", code: "BTN", currency: "Bhutanese Ngultrum" },
  { country: "Brunei", code: "BND", currency: "Brunei Dollar" },
  { country: "Myanmar (Burma)", code: "MMK", currency: "Burmese Kyat" },
  { country: "Cambodia", code: "KHR", currency: "Cambodian Riel" },
  { country: "China", code: "CNY", currency: "Chinese Yuan" },
  { country: "Georgia", code: "GEL", currency: "Georgian Lari" },
  { country: "India", code: "INR", currency: "Indian Rupee" },
  { country: "Indonesia", code: "IDR", currency: "Indonesian Rupiah" },
  { country: "Iran", code: "IRR", currency: "Iranian Rial" },
  { country: "Iraq", code: "IQD", currency: "Iraqi Dinar" },
  { country: "Israel", code: "ILS", currency: "Israeli New Shekel" },
  { country: "Japan", code: "JPY", currency: "Japanese Yen" },
  { country: "Kazakhstan", code: "KZT", currency: "Kazakhstani Tenge" },
  { country: "Malaysia", code: "MYR", currency: "Malaysian Ringgit" },
  { country: "Mongolia", code: "MNT", currency: "Mongolian Tögrög" },
  { country: "Nepal", code: "NPR", currency: "Nepalese Rupee" },
  { country: "Pakistan", code: "PKR", currency: "Pakistani Rupee" },
  { country: "Philippines", code: "PHP", currency: "Philippine Peso" },
  { country: "Qatar", code: "QAR", currency: "Qatari Riyal" },
  { country: "Saudi Arabia", code: "SAR", currency: "Saudi Riyal" },
  { country: "Singapore", code: "SGD", currency: "Singapore Dollar" },
  { country: "South Korea", code: "KRW", currency: "South Korean Won" },
  { country: "Thailand", code: "THB", currency: "Thai Baht" },
  { country: "Vietnam", code: "VND", currency: "Vietnamese Dong" },

  // 🌍 Europe (Including Russia)
  { country: "United Kingdom", code: "GBP", currency: "British Pound Sterling" },
  { country: "Germany", code: "EUR", currency: "Euro" },
  { country: "France", code: "EUR", currency: "Euro" },
  { country: "Italy", code: "EUR", currency: "Euro" },
  { country: "Spain", code: "EUR", currency: "Euro" },
  { country: "Russia", code: "RUB", currency: "Russian Ruble" },

  // 🌎 North America
  { country: "United States", code: "USD", currency: "United States Dollar" },
  { country: "Canada", code: "CAD", currency: "Canadian Dollar" },
  { country: "Mexico", code: "MXN", currency: "Mexican Peso" },

  // 🌍 South America (Newly Added)
  { country: "Argentina", code: "ARS", currency: "Argentine Peso" },
  { country: "Brazil", code: "BRL", currency: "Brazilian Real" },
  { country: "Chile", code: "CLP", currency: "Chilean Peso" },
  { country: "Colombia", code: "COP", currency: "Colombian Peso" },
  { country: "Peru", code: "PEN", currency: "Peruvian Sol" },
  { country: "Venezuela", code: "VES", currency: "Venezuelan Bolívar" },

  // 🌍 Africa
  { country: "South Africa", code: "ZAR", currency: "South African Rand" },
  { country: "Nigeria", code: "NGN", currency: "Nigerian Naira" },
  { country: "Egypt", code: "EGP", currency: "Egyptian Pound" },

  // 🌏 Australia & Pacific
  { country: "Australia", code: "AUD", currency: "Australian Dollar" },
  { country: "New Zealand", code: "NZD", currency: "New Zealand Dollar" }
];

// ✅ Flag Mapping
const countryCodeMap = {
  "INR": "in", "CNY": "cn", "JPY": "jp", "PKR": "pk", "SAR": "sa",
  "USD": "us", "EUR": "eu", "AUD": "au", "ZAR": "za",
  "MMK": "mm", "KHR": "kh", "KZT": "kz", "AZN": "az", "AFN": "af",
  "BDT": "bd", "IDR": "id", "KRW": "kr", "VND": "vn",
  "GBP": "gb", "CAD": "ca", "MXN": "mx", "EGP": "eg", "NGN": "ng",
  "THB": "th", "MYR": "my", "PHP": "ph", "NPR": "np",
  "RUB": "ru", "ARS": "ar", "BRL": "br", "CLP": "cl", "COP": "co",
  "PEN": "pe", "VES": "ve"
};


// ✅ Populate Dropdowns
function populateDropdowns() {
  let fromCurrency = document.getElementById("from-currency");
  let toCurrency = document.getElementById("to-currency");

  currencyData.forEach(currency => {
    let option = document.createElement("option");
    option.value = currency.code;
    option.textContent = `${currency.country} (${currency.code})`;
    option.setAttribute("data-country", countryCodeMap[currency.code] || "us");

    fromCurrency.appendChild(option);
    toCurrency.appendChild(option.cloneNode(true));
  });

  updateFlag("from-currency", "from-flag");
  updateFlag("to-currency", "to-flag");
}

// ✅ Update Flag on Currency Change
function updateFlag(currencyId, flagId) {
  const selectElement = document.getElementById(currencyId);
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const countryCode = selectedOption.getAttribute("data-country");
  document.getElementById(flagId).src = `https://flagcdn.com/w40/${countryCode}.png`;
}

// Function to filter currencies based on search input
function filterCurrencies() {
    let searchText = document.getElementById("search").value.toLowerCase();
    let toCurrency = document.getElementById("to-currency");

    for (let option of toCurrency.options) {
        let countryName = option.textContent.toLowerCase();
        let currencyCode = option.value.toLowerCase();

        if (countryName.includes(searchText) || currencyCode.includes(searchText)) {
            toCurrency.value = option.value; // Select the matching currency
            updateFlag("to-currency", "to-flag");
            convertCurrency(); // Trigger conversion
            break; // Stop after finding the first match
        }
    }
}


// ✅ Currency Conversion (Using Free API)
async function convertCurrency() {
  let amount = document.getElementById("amount").value;
  let fromCurrency = document.getElementById("from-currency").value;
  let toCurrency = document.getElementById("to-currency").value;

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  try {
    let response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    let data = await response.json();
    let rate = data.rates[toCurrency];
    let convertedAmount = (amount * rate).toFixed(2);

    document.getElementById("result").textContent = `${convertedAmount} ${toCurrency}`;
  } catch (error) {
    alert("Error fetching exchange rates. Try again later!");
  }
}

// ✅ Initialize Dropdowns
window.onload = () => {
  populateDropdowns();
  document.getElementById("from-currency").addEventListener("change", () => updateFlag("from-currency", "from-flag"));
  document.getElementById("to-currency").addEventListener("change", () => updateFlag("to-currency", "to-flag"));
};

function filterFromCurrency() {
    let input = document.getElementById("from-search").value.toLowerCase();
    let dropdown = document.getElementById("from-currency");
    filterDropdown(input, dropdown);
}

function filterToCurrency() {
    let input = document.getElementById("to-search").value.toLowerCase();
    let dropdown = document.getElementById("to-currency");
    filterDropdown(input, dropdown);
}

function filterDropdown(input, dropdown) {
    let options = dropdown.getElementsByTagName("option");
    for (let option of options) {
        let text = option.textContent.toLowerCase();
        option.style.display = text.includes(input) ? "" : "none";
    }
}


function playClickSound() {
    let sound = document.getElementById("click-sound");
    sound.currentTime = 0;  // Restart sound if clicked multiple times
    sound.play();
}

document.querySelector("button").addEventListener("click", function() {
    playClickSound();
});


