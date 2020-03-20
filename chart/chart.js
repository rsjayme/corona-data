var trace1 = {
    x:['2020-11-04', '2020-11-05', '2020-11-06'],
    y: [90, 40, 60],
    type: 'scatter'
};

var trace2 = {
    x:['2020-11-04', '2020-11-05', '2020-11-06'],
    y: [10, 20, 30],
    type: 'scatter'
};


var data = [trace1, trace2];

var layout = {
    title: 'Scroll and Zoom',
    showlegend: false
};

Plotly.newPlot('myDiv', data, layout, {scrollZoom: true});