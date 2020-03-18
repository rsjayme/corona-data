let data;


requestData().then((data) => { 
    console.log(data);
    //console.log(data);
    let myCountryData = getDataByCountry(data, 'Brazil');
    console.log(myCountryData);
})