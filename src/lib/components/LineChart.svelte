<script>
    import { onMount , afterUpdate, onDestroy} from "svelte";
    // library that creates chart objects in page
    import {
        Chart as ChartJS,
        CategoryScale,
        LineController,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
        Filler
        } from 'chart.js';
    export let title = 'Real time price';
    export let labelsData = [];
    export let reqsData = [];
    export let subsData = [];
    export const refresh = () => {
        if (!chart) return;
        chart.data.labels = [...labels];
        chart.data.datasets[0].data = [...reqsData];
        //chart.data.datasets[1].data = [...subsData];
        Object.assign(chart.options, options);
        chart.update();         
    };
    let updateMode;
    let labels ;
    let data ;
    let options;
    let plugins;
    export let threshold = 300;

    function initChart(ctx){
        labels = labelsData;
        const yGradient = ctx.createLinearGradient(0, 0, 0, 400);
            yGradient.addColorStop(0, 'rgba(53, 162, 235, 1)');   
            yGradient.addColorStop(1, 'rgba(53, 162, 235, 0)');
        const y1Gradient = ctx.createLinearGradient(0, 0, 0, 400);
            y1Gradient.addColorStop(0, 'rgba(255, 99, 132, 1)');   
            y1Gradient.addColorStop(1, 'rgba(255, 99, 132, 0)');
        plugins = [{
            afterLayout: chart => {
                let ctx = chart.ctx;
                ctx.save();
                let yAxis = chart.scales.y;
                let yThreshold = yAxis.getPixelForValue(threshold);
                let gradient = ctx.createLinearGradient(0, yAxis.top, 0, yAxis.bottom);
                gradient.addColorStop(0, 'green');
                let offset = 1 / yAxis.bottom * yThreshold;
                console.log(yAxis,yThreshold, offset);
                gradient.addColorStop(offset, 'green');
                gradient.addColorStop(offset, 'red');
                gradient.addColorStop(1, 'red');
                chart.data.datasets[0].borderColor = gradient;
                ctx.restore();
            }
        }]
        data = {
            labels: labels,
            datasets: [
                {
                    label: 'Demo Stock',
                    data: reqsData,
                    yAxisID: 'y',
                    lineTension: 0.2,   
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: yGradient,//'rgba(53, 162, 235, 0.5)',
                    //fillColor: yGradient,
                    fill: true,
                },
                /*
                {
                    label: 'Realtime Subscribers',
                    data: subsData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: y1Gradient,//'rgba(255, 99, 132, 0.5)',
                    yAxisID: 'y1',
                    lineTension: 0.2,
                    fill: true,
                },*/
                
            ]
        };
        options = {
            responsive: true,
            interaction: {
                mode: 'index' ,
                intersect: false,
            },
            //stacked: true,
            plugins: {
                title: {
                    display: true,
                    text: title,
                },
            },
            animation: {
                duration: 500,
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },
                    title: {
                        display: false,
                        text: 'Time'
                    }
                },
                y: {
                    type: 'linear' ,
                    display: true,
                    position: 'left' ,
                    title: {
                        display: true,
                        text: 'Demo price'
                    }
                },
            },
        };
        return {
                type: 'line',
                //plugins,
                data,
                options
            };
    }
    let config;
    let chartCanvas;
    export let chart;
    // init chart
    onMount(() => {
        
        ChartJS.register(
            LineController,
            CategoryScale,
            LinearScale,
            PointElement,
            LineElement,
            Title,
            Tooltip,
            Legend,
            Filler
            );
        const ctx = chartCanvas.getContext('2d');//document.getElementById('line-chart').getContext('2d');
        config = initChart(ctx);
        chart = new ChartJS(ctx, config);
    });

    afterUpdate(() => {
        if (!chart) return;
        //chart.data.labels = [...labels];
        //chart.data.datasets[0].data = [...reqsData];
        //chart.data.datasets[1].data = [...subsData];
        //chart.data.datasets = [...chart.data.datasets];
        //Object.assign(chart.options, options);
        //chart.update();                                       
    }
    );

    onDestroy(() => {
        if (chart) chart.destroy();
        chart = null;
    }
    );

    //$: chart = $chart;
  </script>
  <div
    class="relative flex flex-col min-w-0 break-words mb-6 shadow-lg rounded w-[66rem]"
  >
    <div class="p-4 flex-auto rounded h-[32rem] w-[66rem]">
      <!-- Chart -->
      <div class="relative h-[30rem] w-[66rem]">
        {#if labelsData.length >= 0}
            <canvas bind:this={chartCanvas} id="line-chart"></canvas>
        {:else}
            <div>Loading ...</div>
        {/if}
      </div>
    </div>
  </div>
  