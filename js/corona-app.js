const countryInput = document.querySelector('#countryInput');
const searchBtn = document.querySelector('#searchBtn');
const containerChart = document.querySelector('#containerChart');
let chartIsOpen = false;

// TODO LIST
// !!!! ARRUMAR OS BOTOES DO NAV BAR [x]
// NEW SEARCH SYSTEM [x]
// GRAPHS [x]
// FIX MOBILE LAYOUT [X]
// TENTAR ADICIONAR UM MODO DE COMAPARAÇÃO DE GRÁFICOS []
// Adicionar o campo country_pt em todos os dados [X]

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

    document.querySelector("#containerChart").style.display = 'block';

requestData().then(async (data) => { 
    data = fixData(data);
    
    const countriesLanguageData = await requestCountriesJson();
    data = translateData(data, countriesLanguageData);
    let lastData = data.lastData;
    data = data.fullData;



    const breadCrumbs = document.querySelectorAll('.letterItem');
    breadCrumbs.forEach((breadCrumb) => {
        breadCrumb.addEventListener('click', (e) => {
            countryList = getCountryByLetter(e.target.text, data);

            renderCountryList(countryList);
        });
    });

    renderHome(lastData);
    

    countryInput.addEventListener('input', (e) => {  
        const input = e.target.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
        if(e.target.value)     
            renderCountryList(data, input);
        else
            renderHome(lastData);
    });


    document.querySelector('#alertClose').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('#alert').style.display = 'none';
    });

    document.querySelector('#btnCloseChart').addEventListener('click', (e) => {
        e.preventDefault();
        containerChart.style.left = '-9999px';
        //document.querySelector('#containerChart').style.visibility = 'hidden';
    });



});


