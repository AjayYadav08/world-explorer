var allCountries = [];

var searchInput = document.getElementById('searchInput');
var regionFilter = document.getElementById('regionFilter');
var messageDiv = document.getElementById('message');
var gridDiv = document.getElementById('countriesGrid');
var sortOrder = document.getElementById('sortOrder');

searchInput.oninput = filterCountries;
regionFilter.onchange = filterCountries;
sortOrder.onchange = filterCountries;

fetch('https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        allCountries = data;
        messageDiv.style.display = 'none';
        filterCountries();
    })
    .catch(function (error) {
        messageDiv.innerText = 'Error loading countries.';
    });

function filterCountries() {
    var searchText = searchInput.value.toLowerCase();
    var regionText = regionFilter.value;

    var filtered = [];

    for (var i = 0; i < allCountries.length; i++) {
        var country = allCountries[i];
        var name = country.name.common.toLowerCase();
        var region = country.region ? country.region : '';

        var matchesSearch = name.indexOf(searchText) !== -1;
        var matchesRegion = regionText === '';
        if (regionText !== '') {
            matchesRegion = region === regionText;
        }

        if (matchesSearch && matchesRegion) {
            filtered.push(country);
        }
    }

    var sortVal = sortOrder.value;
    if (sortVal === 'asc') {
        filtered.sort(function(a, b) {
            return a.name.common.localeCompare(b.name.common);
        });
    } else if (sortVal === 'desc') {
        filtered.sort(function(a, b) {
            return b.name.common.localeCompare(a.name.common);
        });
    }

    renderCountries(filtered);
}

function renderCountries(countries) {
    var htmlContent = '';

    if (countries.length === 0) {
        messageDiv.innerText = 'No countries found.';
        messageDiv.style.display = 'block';
        gridDiv.innerHTML = '';
        return;
    } else {
        messageDiv.style.display = 'none';
    }

    for (var i = 0; i < countries.length; i++) {
        var country = countries[i];
        var capital = 'N/A';
        if (country.capital && country.capital.length > 0) {
            capital = country.capital[0];
        }

        var flagUrl = country.flags.svg;
        if (!flagUrl) {
            flagUrl = country.flags.png;
        }

        htmlContent += '<div class="card">' +
            '<img class="flag" src="' + flagUrl + '" alt="Flag of ' + country.name.common + '">' +
            '<div class="info">' +
            '<h2>' + country.name.common + '</h2>' +
            '<p><b>Population:</b> ' + country.population.toLocaleString() + '</p>' +
            '<p><b>Region:</b> ' + country.region + '</p>' +
            '<p><b>Capital:</b> ' + capital + '</p>' +
            '</div>' +
            '</div>';
    }

    gridDiv.innerHTML = htmlContent;
}
