let allCountries = [];
const flagTrack = document.getElementById('flagTrack');

const searchInput = document.getElementById('searchInput');
const regionFilter = document.getElementById('regionFilter');
const messageDiv = document.getElementById('message');
const gridDiv = document.getElementById('countriesGrid');
const sortOrder = document.getElementById('sortOrder');

searchInput.oninput = filterCountries;
regionFilter.onchange = filterCountries;
sortOrder.onchange = filterCountries;

fetch('https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population')
    .then(response => response.json())
    .then(data => {
        allCountries = data;
        messageDiv.style.display = 'none';
        initializeFlagTicker();
        filterCountries();
    })
    .catch(error => {
        messageDiv.innerText = 'Error loading countries.';
    });

function initializeFlagTicker() {
    let flagHtml = '';

    for (let i = 0; i < allCountries.length; i++) {
        const country = allCountries[i];

        if (!country.flags) {
            console.warn('No flags object for:', country.name.common);
            continue;
        }

        const flagUrl = country.flags.svg || country.flags.png;

        if (!flagUrl) {
            continue;
        }

        const countryName = country.name.common;

        flagHtml += `<div class="flag-item">
            <img src="${flagUrl}" alt="Flag of ${countryName}" title="${countryName}">
        </div>`;
    }

    flagTrack.innerHTML = flagHtml;
}

function filterCountries() {
    const searchText = searchInput.value.toLowerCase();
    const regionText = regionFilter.value;

    const filtered = [];

    for (let i = 0; i < allCountries.length; i++) {
        const country = allCountries[i];
        const name = country.name.common.toLowerCase();
        const region = country.region ? country.region : '';

        const matchesSearch = name.includes(searchText);

        let matchesRegion = true;
        if (regionText !== '') {
            matchesRegion = region === regionText;
        }

        if (matchesSearch && matchesRegion) {
            filtered.push(country);
        }
    }

    const sortVal = sortOrder.value;
    if (sortVal === 'asc') {
        filtered.sort((a, b) => a.name.common.localeCompare(b.name.common));
    } else if (sortVal === 'desc') {
        filtered.sort((a, b) => b.name.common.localeCompare(a.name.common));
    }

    renderCountries(filtered);
}

function renderCountries(countries) {
    let htmlContent = '';

    if (countries.length === 0) {
        messageDiv.innerText = 'No countries found.';
        messageDiv.style.display = 'block';
        gridDiv.innerHTML = '';
        return;
    } else {
        messageDiv.style.display = 'none';
    }

    for (let i = 0; i < countries.length; i++) {
        const country = countries[i];

        let capital = 'N/A';
        if (country.capital && country.capital.length > 0) {
            capital = country.capital[0];
        }

        let flagUrl = country.flags.svg;
        if (!flagUrl) {
            flagUrl = country.flags.png;
        }

        htmlContent += `
            <div class="card">
                <img class="flag" src="${flagUrl}" alt="Flag of ${country.name.common}">
                <div class="info">
                    <h2>${country.name.common}</h2>
                    <p><b>Population:</b> ${country.population.toLocaleString()}</p>
                    <p><b>Region:</b> ${country.region}</p>
                    <p><b>Capital:</b> ${capital}</p>
                </div>
            </div>
        `;
    }

    gridDiv.innerHTML = htmlContent;
}