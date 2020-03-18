const coronaData = 'https://pomber.github.io/covid19/timeseries.json';

// add Countryname to object, sort by name, get data only from the last day avaiable;
const fixData = (data) => {
    let dataArray = Object.values(data);  
    let newData = [];
    const countryList = Object.getOwnPropertyNames(data);
    for(let i = 0;i< dataArray.length; i++) {
        //dataArray[i] = dataArray[i].splice(dataArray[i].length-1, 1);
        newData[i] = dataArray[i][dataArray[i].length-1];
        newData[i].country = countryList[i];
    }
    newData.sort((a, b) => {
        if(a.country < b.country) return -1;
        else if(a.country > b.country) return 1;
        else return 0;
    });
    return newData;    
}

const requestData = async () => {
    const response = await fetch(coronaData);
    if(response.status === 200) {
        const data = await response.json();
        return fixData(data);
    }
    else {
        throw new Error('Unable to fetch data.');
    }
}


const requestCountriesJson = async () => {
    const responseCountries = await fetch('https://gist.githubusercontent.com/jonasruth/61bde1fcf0893bd35eea/raw/10ce80ddeec6b893b514c3537985072bbe9bb265/paises-gentilicos-google-maps.json');
    if(responseCountries.status === 200) {
        const jsonCountries = await responseCountries.json();
        return jsonCountries;
    }
}

const getDataByCountry = (data, countryName) => {
    const myCountry = data.find((data) => {
        if(data.country.toLowerCase() === countryName.toLowerCase()) {
            return data;
        }
    });
    return myCountry;
}


const getTotalDeaths = (data) => {
    let totaldeaths = 0;
    data.forEach((data) => {
        totaldeaths = totaldeaths + parseInt(data.deaths);
    })

    return totaldeaths;
}

const getTotalConfirmed = (data) => {
    let confirmed = 0;
    data.forEach((data) => {
        confirmed = confirmed + parseInt(data.confirmed);
    })

    return confirmed;
}

const getTotalRecovered = (data) => {
    let recovered = 0;
    data.forEach((data) => {
        recovered = recovered + parseInt(data.recovered);
    }); 

    return recovered;
}

const getCountryByLetter = (letter, data) => {
    const filteredList = [];
    data.forEach((data) => {
        if(data.country[0].toLowerCase() === letter.toLowerCase()) {
            filteredList.push(data);
        }
    })
    return filteredList;
}

const renderCountryList = (countryList) => {

    document.querySelector('#title').textContent = 'Lista de paises';
    const contentEl1 = document.querySelector('#col1');
    const contentEl2 = document.querySelector('#col2');
    contentEl1.textContent = '';
    
    countryList.forEach((country) => {
        const textEl = document.createElement('a');
        textEl.textContent = country.country;
        textEl.setAttribute('href','#');
        textEl.addEventListener('click', (e) => {
            const myCountry = countryList.find((country) => {
                if(country.country === e.target.text) {
                    return country;
                }
            });
            renderCountrySummary(myCountry, contentEl2);
        })

        contentEl1.appendChild(textEl);
    })
}


const renderCountrySummary = (countryData, element) => {
    element.innerHTML  = `
    <div class="data-container">
        <h5>${countryData.country}</h5>
        <p>Casos confirmados: ${countryData.confirmed}</p>
        <p>Mortes: ${countryData.deaths}</p>
        <p>Recuperados: ${countryData.recovered}</p>
    </div>
`;
};