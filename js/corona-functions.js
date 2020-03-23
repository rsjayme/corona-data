//const coronaData = 'https://pomber.github.io/covid19/timeseries.json';
const coronaData = 'https://icebob.info/covid19/timeseries.json';
// add Countryname to object, sort by name, get data only from the last day avaiable;
const fixData = (data) => {
    let dataArray = Object.values(data);  
    let newestData = [];
    const countryList = Object.getOwnPropertyNames(data);
    for(let i = 0;i< dataArray.length; i++) {
        //dataArray[i] = dataArray[i].splice(dataArray[i].length-1, 1);
        newestData[i] = dataArray[i][dataArray[i].length-1];
        newestData[i].country = countryList[i];
        dataArray[i].country = countryList[i];
    }

    newestData.sort((a, b) => {
        if(a.country < b.country) return -1;
        else if(a.country > b.country) return 1;
        else return 0;
    });

    const returnObject = {
        fullData: dataArray,
        lastData: newestData
    }

    return returnObject;   
}

const requestData = async () => {
    const response = await fetch(coronaData);
    if(response.status === 200) {
        const data = await response.json();
        return data;
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

const translateData = (data, translateData) => {
    data.lastData.forEach((data) => {
        translateData.find((dataTranslate) => {
            if(dataTranslate.nome_pais_int === data.country) {
                data.countryPT = dataTranslate.nome_pais
            }
        });
        if(data.country === 'US') data.countryPT = 'Estados Unidos';
    });

    data.fullData.forEach((data) => {
        translateData.find((dataTranslate) => {
            if(dataTranslate.nome_pais_int === data.country) {
                data.countryPT = dataTranslate.nome_pais
            }
        });
        if(data.country === 'US') data.countryPT = 'Estados Unidos';
        if(data.country === 'South Africa') data.countryPT = 'África do Sul';
    });
    return data;
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
    let countryName;
    data.forEach((data) => {
        if(data.countryPT) countryName = data.countryPT;
        else countryName = data.country;
        if(countryName[0].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase() === letter.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()) {
            filteredList.push(data);
        }
    })
    return filteredList;
}

const renderHome = (data) => {
    const totalConfirmed = getTotalConfirmed(data);
    const totalRecovered = getTotalRecovered(data);
    const totalDeaths = getTotalDeaths(data);
    const realDeathsPercent = parseFloat((totalDeaths / (totalRecovered + totalDeaths)) * 100).toFixed(2); 
    
    const dataDate = new Date(data[0].date);
    const month = ("0" + (dataDate.getMonth() + 1)).slice(-2);
    document.querySelector('#title').textContent = 'Dados gerais';
    document.querySelector('#col1').innerHTML = `
        <p> Estamos com um total de ${totalConfirmed} casos confirmados no mundo. </p>
        <p> ${totalRecovered} pessoas se recuperaram. </p>
        <p> ${totalDeaths} pessoas que morreram.
        <span class='data-info'>Dados de ${dataDate.getDate()}/${month}/${dataDate.getFullYear()}</span>
    `;
}

const renderCountryList = (countryList, filter) => {
    let countryListFiltered = [];
    document.querySelector('#title').textContent = 'Lista de paises';
    const contentEl1 = document.querySelector('#col1');
    const contentEl2 = document.querySelector('#col2');
    let countryName;
    contentEl1.textContent = ' ';
        if(filter) {
            countryList.forEach((country) => {
                if(country.countryPT) countryName = country.countryPT;
                else countryName = country.country;
                if(stringSearch(countryName, filter)) {
                    countryListFiltered.push(country);
                }
            });
        }
        else { 
            countryListFiltered = countryList; 
        }

        countryListFiltered.forEach((country) => {
            const textEl = document.createElement('a');
            if(country.countryPT) textEl.textContent = country.countryPT;
            else textEl.textContent = country.country;
            textEl.setAttribute('href','#');
            textEl.addEventListener('click', (e) => {
                const myCountry = countryListFiltered.find((country) => {
                    if(country.country === e.target.text || country.countryPT === e.target.text) {
                        return country;
                    }
                });
                renderCountrySummary(myCountry, contentEl2);
            })

            contentEl1.appendChild(textEl);
    });
    
     
}

const stringSearch = (word, searchWord) => {
    let matches = 0;
    for(let i = 0;i < searchWord.length; i++) {
            if(word[i].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase() !== searchWord[i].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase())
                return false;
            else matches = matches + 1;
    }
    if(matches === searchWord.length) return true;
}


const renderCountrySummary = (countryData, element) => {
    // CONFIRMED GRAPHS.

    let graphDates = [];
    let graphConfirmed = [];
    let graphDeaths = [];
    let graphRecovered = [];

    countryData.forEach((data) => {

        graphDates.push(data.date);
        graphConfirmed.push(data.confirmed);
        graphDeaths.push(data.deaths);
        graphRecovered.push(data.recovered);
    })
    const graphData = {
        dates: graphDates,
        confirmed: graphConfirmed,
        deaths: graphDeaths,
        recovered: graphRecovered
    }

    lastData = countryData[countryData.length-1];
    let countryName;
    if(lastData.countryPT) countryName = lastData.countryPT;
    else countryName = lastData.country;

    element.innerHTML  = `
    <div class="data-container">
        <h5>${countryName}</h5>
        <p>Casos confirmados: ${lastData.confirmed}</p>
        <p>Mortes: ${lastData.deaths}</p>
        <p>Recuperados: ${lastData.recovered}</p>
        <p><a href="#" id="showGraph">Gráfico</a>
    </div>
`;

    document.querySelector('#showGraph').addEventListener('click', (e) => {
        document.querySelector('#containerChart').style.left = '0%';
        renderGraph(graphDates, graphData, lastData.country);
        chartIsOpen = true;
    })


};


const renderGraph = (dates, data, title) => {
    var trace1 = {
        x: dates,
        y: data.confirmed,
        name: "Confirmados",
        type: 'scatter'
    };

    var trace2 = {
        x: dates,
        y: data.deaths,
        name: "Mortes",
        type: 'scatter'
    };

    var trace3 = {
        x: dates,
        y: data.recovered,
        name: "Recuperados",
        type: 'scatter'
    };
    
    
    
    var data = [trace1, trace2, trace3];
    
    var layout = {
        title: title,
        showlegend: false,
        xaxis: {
            title: 'Data'
        }
    };
    
    Plotly.newPlot('chart', data, layout, {displayModeBar: false, responsive: true});
}

