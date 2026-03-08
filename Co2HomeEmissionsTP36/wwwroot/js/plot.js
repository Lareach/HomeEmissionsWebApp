
if(document.getElementById('plotly-graph') !== null) {
    fetch('/api/rain-temp.json')
        .then(response => response.json())
        .then(yearlyData => {
            fetch('/api/co2.json')
                .then(response => response.json())
                .then(co2Data => {

                    const groupedData = yearlyData.reduce((acc, curr) => {
                        const {Year, Mean_Temp} = curr;
                        if (!acc[Year]) {
                            acc[Year] = [];
                        }
                        acc[Year].push(parseFloat(Mean_Temp));
                        return acc;
                    }, {});

                    const meanData = {};
                    for (const year in groupedData) {
                        const temperatures = groupedData[year];
                        const sum = temperatures.reduce((total, temp) => total + temp, 0);
                        const mean = sum / temperatures.length;
                        meanData[year] = parseFloat(mean.toFixed(6));
                    }

                    const droughtYears = [1982, 1983, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2017, 2018, 2019];
                    const drought = {};
                    for (const year in meanData) {
                        drought[year] = droughtYears.includes(parseInt(year)) ? 1 : 0;
                    }

                    const yearlyYears = Object.keys(meanData).map(year => parseInt(year))
                    const yearlyMeanTemp = Object.values(meanData).map(year => parseFloat(year))
                    const hasDrought = Object.values(drought).map(year => parseInt(year))
                    const co2Years = co2Data.map(item => parseInt(item.Year));
                    const co2Levels = co2Data.map(item => parseFloat(item.Co2_Ave_ppm));

                    const trace1 = {
                        x: yearlyYears,
                        y: yearlyMeanTemp,
                        name: 'Mean Yearly Temperature',
                        mode: 'lines+markers',
                        marker: {
                            size: 8,
                            color: hasDrought.map(year => year === 1 ? 'yellow' : '#00008B')
                        }
                    };

                    const trace2 = {
                        x: co2Years,
                        y: co2Levels,
                        name: 'Atmospheric CO2 levels',
                        yaxis: 'y2',
                        type: 'scatter'
                    };

                    // Define layout options
                    const layout = {
                        xaxis: {
                            rangeselector: {
                                buttons: [
                                    {
                                        count: 10,
                                        label: 'Decade View',
                                        step: 'year',
                                        stepmode: 'todate'
                                    },
                                    {
                                        count: 20,
                                        label: '2 Decade View',
                                        step: 'year',
                                        stepmode: 'backward'
                                    },
                                    {step: 'all'}
                                ]
                            },
                            rangeslider: {visible: true},
                            type: 'date'
                        },
                        yaxis: {title: 'Temperature (Celsius)'},
                        yaxis2: {
                            title: 'CO2 levels (ppm)',
                            overlaying: 'y',
                            side: 'right'
                        },
                        title: 'Average Yearly Temperature in Melbourne and Atmospheric CO2 levels'
                    };

                    const data = [trace1, trace2];
                    const config = {responsive: true};

                    // Plot the graph
                    Plotly.newPlot('plotly-graph', data, layout, config);
                })
                .catch(error => console.error('Error fetching CO2 data:', error));
        })
        .catch(error => console.error('Error fetching yearly temperature data:', error));
}

if(document.getElementById('solar-installations') !== null) {
    fetch('/api/solarinstallations.json')
        .then(response => response.json())
        .then(data_grouped => {
            const years = Array.from(new Set(data_grouped.map(entry => entry.Year)));
            const sa4names = Array.from(new Set(data_grouped.map(entry => entry.sa4name)));
            const data = [];

            sa4names.forEach(sa4name => {
                const yData = [];

                years.forEach(year => {
                    const filteredData = data_grouped.find(entry => entry.sa4name === sa4name && entry.Year === year);
                    yData.push(filteredData ? filteredData.Installations : 0);
                });

                data.push({
                    x: years,
                    y: yData,
                    name: sa4name,
                    type: 'bar',
                    hovertemplate: 'Year: %{x}<br>Installations: %{y}'
                });
            });

            const layout = {
                title: 'Solar Installations by Victorian Area',
                xaxis: { title: 'Year' },
                yaxis: { title: 'Installations' },
                barmode: 'stack',
                legend: { traceorder: 'normal' }
            };

            Plotly.newPlot('solar-installations', data, layout);
    })
    .catch(error => console.error('Error fetching solar installation data:', error));
}
