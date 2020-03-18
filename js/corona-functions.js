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


const getDataByCountry = (data, countryName) => {
    let myCountryObj;
    data.find((data) => {
        if(data.country === countryName) {
            myCountryObj = {
                lastData: data,
                countryName: data.country
            }
        }
    });
    return myCountryObj;
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