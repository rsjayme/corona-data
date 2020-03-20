


requestData().then(async (data) => { 
    data = fixData(data);
    const fullData = data.fullData;
    data = data.lastData;

    // MOSTRAM A MESMA COISA
    //
    // fullData.forEach((data) => {
    //     if(data.country === 'Brazil') {
    //         console.log(data[data.length-1]);
    //     }
    // })

    // data.forEach((data) => {
    //     if(data.country === 'Brazil') {
    //         console.log(data);
    //     }
    // })



    const totalConfirmed = getTotalConfirmed(data);
    const totalRecovered = getTotalRecovered(data);
    const totalDeaths = getTotalDeaths(data);
    const realDeathsPercent = parseFloat((totalDeaths / (totalRecovered + totalDeaths)) * 100).toFixed(2); 

    const breadCrumbs = document.querySelectorAll('.letterItem');
    breadCrumbs.forEach((breadCrumb) => {
        breadCrumb.addEventListener('click', (e) => {
            countryList = getCountryByLetter(e.target.text, data);

            renderCountryList(countryList);
        });
    });

    
    const dataDate = new Date(data[0].date);
    const month = ("0" + (dataDate.getMonth() + 1)).slice(-2);
    document.querySelector('#col1').innerHTML = `
        <p> Estamos com um total de ${totalConfirmed} casos confirmados no mundo. </p>
        <p> ${totalRecovered} pessoas se recuperaram.. </p>
        <p> ${totalDeaths} pessoas que morreram. São ${realDeathsPercent}% de todos os casos concluidos (Recuperados ou mortos).
        <span class='data-info'>Dados de ${dataDate.getDate()}/${month}/${dataDate.getFullYear()}</span>
    `;
    


    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();     

        requestCountriesJson().then((countriesJSON) => {
            countriesJSON.find((countryFiltered) => {
                const inputNormalized = countryInput.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
                const dataNormalized = countryFiltered.nome_pais.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
                console.log(dataNormalized);
                if(dataNormalized === inputNormalized) {
                    countryInput.value = countryFiltered.nome_pais_int;
                }
            })

            const txtInput = countryInput.value;
            const countryData = getDataByCountry(data, txtInput);
   

            if(countryData) {
                renderCountryList(getCountryByLetter(txtInput[0], data))
                renderCountrySummary(countryData, document.querySelector('#col2'));
            } else
            {
                document.querySelector('#alert').style.display = 'flex';
            }
        })
    });


    document.querySelector('#alertClose').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('#alert').style.display = 'none';
    })
})