const countryInput = document.querySelector('#countryInput');
const searchBtn = document.querySelector('#searchBtn');
// TODO LIST
// !!!! ARRUMAR OS BOTOES DO NAV BAR
// Adicionar o campo country_pt em todos os dados

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


requestData().then(async (data) => { 
    data = fixData(data);
    //const fullData = data.fullData;
    data = data.lastData;


    const breadCrumbs = document.querySelectorAll('.letterItem');
    breadCrumbs.forEach((breadCrumb) => {
        breadCrumb.addEventListener('click', (e) => {
            countryList = getCountryByLetter(e.target.text, data);

            renderCountryList(countryList);
        });
    });

    renderHome(data);
    

    countryInput.addEventListener('input', (e) => {  
        const input = e.target.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
        if(e.target.value)     
            renderCountryList(data, input);
        else
            renderHome(data);
    });


    document.querySelector('#alertClose').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('#alert').style.display = 'none';
    })
})