<script>
    import LineChart from "$lib/components/LineChart.svelte";
    import { onMount } from "svelte";
    import {direcstore as ds} from 'direcbase';
    import config from '$lib/config';
    ds.useEndpoint(config.endpoint);
    let latestPrice = 0;
    let firstPrice = 0;
    let reqs  = [];
    let labels = [];
    let chart;
    let delta = 0;
    let stockData = [];
    let subscriptionId;
    
    function getChartData(data){
        let x = [];
        let y = [];
        let minutes = 0;
        let minute;
        let range = 60;
        let lastPrice = 0;
        let count = 0;
        data.forEach((entry, index) => {
            minute = `${entry.datetime.trim().substring(8, 10)}:${entry.datetime.trim().substring(10, 12)}`;
            if(minutes == 0) {
                x.push(minute);
                y.push({x: minute, y: entry.priceUSD});
            } else{
                if(count > 5){
                    x.push(minute);
                    y.push({x: minute, y: entry.priceUSD});
                    count = 0;
                }
            }
            count = count + 1;
            minutes = minutes + 1;
            if(minutes === range) minutes = 0;
            lastPrice = entry.priceUSD;
        })
        if(data.length > 1) 
        {
            let entry = data[data.length - 1];
            minute = `${entry.datetime.trim().substring(8, 10)}:${entry.datetime.trim().substring(10, 12)}`;
            x.push(minute);
            y.push({x: minute, y: entry.priceUSD});
        }
        return {x, y, lastPrice};
    }
    function addData(data){
        //reqs = [...result.data.rows];
        stockData = [...stockData, ...data.rows]
        const {x, y, lastPrice} = getChartData(stockData);
        reqs = [...y];
        labels = [...x];
        latestPrice = lastPrice;
        //refresh();
        if (!chart) return;
        chart.data.labels = [...labels];
        chart.data.datasets[0].data = [...reqs];
        //chart.data.datasets[1].data = [...subs];
        chart.data.datasets = [...chart.data.datasets];
        //Object.assign(chart.options, options);
        chart.update();  
    }
    function leadingZero(input){
        let result = `00${input}`;
        input = result.substring(result.length-2, result.length);
        return input;
    }
    onMount(async () => {
        let currentdate = new Date(); 
        let datetime =  currentdate.getFullYear().toString()
                        + leadingZero((currentdate.getMonth()+1).toString())
                        + leadingZero(currentdate.getDate().toString())
                        + '000000';
        await ds.select().from('coins_price').where('datetime', '>', datetime)
            .onChange((event) => {
                let {subId, result, initial} = event;
                console.log('initial', initial);
                subscriptionId = subId;
                if(result && result.data){
                    if(initial){
                        let firstEntry = result.data.rows[0];
                        if(firstEntry){
                            firstPrice = firstEntry.priceUSD;
                        }
                    }
                    addData(result.data);
                    if(firstPrice !== 0){
                        delta = (latestPrice - firstPrice )/ firstPrice * 100;
                        delta = Math.round(delta * 100) / 100;
                    }
                }
            }
        );
    })
    
</script>
<div class="content-center w-full">
    <div class="flex px-6 py-2">
        <div class="card w-80 bg-base-100 shadow-xl">
            <div class="card-body">
                <div class="flex"> 
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="card-title">{latestPrice}</span>
                </div>
                <div class="flex">
                    <div class="flex flex-row"> 
                        {#if delta > 0}
                            <span class="text-green-500 px-4"> {delta} % </span>
                            <svg class="h-6 w-6 stroke-green-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"></path>
                            </svg>
                            <span class="text-green-500">today</span>
                        {:else}
                            <span class="text-red-500 px-4"> {delta} % </span>
                            <svg class="h-6 w-6 stroke-red-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"></path>
                            </svg>
                            <span class="text-red-500">today</span>
                        {/if}
                    </div>
                    <div class="px-4"> </div>
                </div>
                <div class="card-actions justify-end">
                    <button disabled class="btn btn-primary btn-sm">View More</button>
                </div>
            </div>
        </div>
        <div class="px-2"> </div>
        <div class="card w-96 bg-base-100 shadow-xl">
            <div class="card-body">
                <div class="flex"> 
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    <span class="card-title">-</span>
                </div>
                <div class="flex">
                    <div class="px-4"> </div>
                    <div class="px-4"></div>
                    <div class="px-4"></div>
                </div>
                <div class="card-actions justify-end">
                    
                </div>
            </div>
        </div><div class="px-2"> </div>
        <div class="card w-80 bg-base-100 shadow-xl">
            <div class="card-body">
                <div class="flex"> 
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.121 7.629A3 3 0 009.017 9.43c-.023.212-.002.425.028.636l.506 3.541a4.5 4.5 0 01-.43 2.65L9 16.5l1.539-.513a2.25 2.25 0 011.422 0l.655.218a2.25 2.25 0 001.718-.122L15 15.75M8.25 12H12m9 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="card-title">-</span>
                </div>
                <div class="flex">
                    <div class="px-4"> </div>
                    <div class="px-4"></div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="flex flex-wrap px-4">
        <div class="w-full mb-12 xl:mb-0 px-2">
            <LineChart bind:chart={chart} bind:latestPrice={latestPrice}/>
        </div>
    </div>
</div>