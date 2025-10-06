import React from 'react'
import "../assets/styles/dashboard.css";
import { Bar, Line, Doughnut, Pie, Radar, PolarArea } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, RadialLinearScale, Filler, Title } from "chart.js";
import { AnalyticData, ChartsData } from '../data/Data.ts';

// Register required components
ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale, RadialLinearScale, PointElement, ArcElement, Filler, Title, Tooltip, Legend);



const Dashboard = () => {


    const BarChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
            },
        },
    };

    const DoughnutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
            },
        },
    };

    const PieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
            },
        },
    };

    const LineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
            },
        }
    };

    const HorizontalBarChartOptions = {
        indexAxis: "y" as const,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
            },
        },
    };

    const MultiPieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                    },
                },
            },
        },
    };

    const RadarChartOptions = {
        scales: {
            r: {
                angleLines: {
                    display: false,
                },
                suggestedMin: 0,
                suggestedMax: 100,
            },
        },
    };

    const PolarChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    },
                },
            },
        },
    };




    const demoData = [
        {
            "id": 1,
            "order": 1,
            "chartType": "Bar Chart",
            "chartName": "Daily Hours Per Project",
            "chart": {
                "labels": ["Project A", "Project B", "Project C"],
                "datasets": [
                    {
                        "label": "Hours Spent",
                        "data": [120, 90, 75], // Total hours for each project (daily)
                        "backgroundColor": ["#36A2EB", "#FF6384", "#FFCE56"],
                    },
                ],
            },
        },
        {
            "id": 2,
            "order": 2,
            "chartType": "Bar Chart",
            "chartName": "Weekly Hours Per Project",
            "chart": {
                "labels": ["Project A", "Project B", "Project C"],
                "datasets": [
                    {
                        "label": "Hours Spent",
                        "data": [850, 600, 500], // Total hours for each project (weekly)
                        "backgroundColor": ["#36A2EB", "#FF6384", "#FFCE56"],
                    },
                ],
            },
        },
        {
            "id": 3,
            "order": 3,
            "chartType": "Bar Chart",
            "chartName": "Monthly Hours Per Project",
            "chart": {
                "labels": ["Project A", "Project B", "Project C"],
                "datasets": [
                    {
                        "label": "Hours Spent",
                        "data": [3200, 2700, 2300], // Total hours for each project (monthly)
                        "backgroundColor": ["#36A2EB", "#FF6384", "#FFCE56"],
                    },
                ],
            },
        },
        {
            "id": 4,
            "order": 4,
            "chartType": "Bar Chart",
            "chartName": "Yearly Hours Per Project",
            "chart": {
                "labels": ["Project A", "Project B", "Project C"],
                "datasets": [
                    {
                        "label": "Hours Spent",
                        "data": [40000, 35000, 28000],
                        "backgroundColor": ["#36A2EB", "#FF6384", "#FFCE56"],
                    },
                ],
            },
        },
    ];


  return (
    <>
     {/* <div className="parent-container"> */}

<div className="dashboard-main-container">

    <div className="analytic-cards-container">

        {AnalyticData?.map((data: any) => {
            return <div className="analytic-cards" key={data?.id}>
                <div className="analytic-cards-heading">
                    {data?.heading}
                </div>
                <div className="analytic-cards-numbers">
                    {data?.amount}
                </div>
            </div>
        })}

    </div>

    {/* <div className="charts-main-container">
        {demoData.map((chartItem) => (
            <div key={chartItem.id} className="charts-wrapper">
                <h5>{chartItem.chartName}</h5>
                <div className="charts-box">
                    <Bar data={chartItem.chart} options={BarChartOptions} />
                </div>
            </div>
        ))}
    </div> */}





    <div className="charts-main-container">

        {
            ChartsData.sort((a:any, b:any) => a.order - b.order).map((section: any) => {
                switch (section.chartType) {
                    case "Bar Chart":
                        return <div className="charts-wrapper" key={section.id} >
                            <h5>{section.chartName}</h5>
                            <div className="charts-box">
                                <Bar data={section.chart} options={BarChartOptions} />
                            </div>
                        </div>;
                    case "Doughnut Chart":
                        return  <div className="charts-wrapper" key={section.id} >
                        <h5>{section.chartName}</h5>
                        <div className="charts-box">
                                <Doughnut data={section.chart}
                                    options={DoughnutChartOptions} />
                            </div>
                        </div>;
                    case "Pie Chart":
                        return  <div className="charts-wrapper" key={section.id} >
                        <h5>{section.chartName}</h5>
                        <div className="charts-box">
                                <Pie data={section.chart} options={PieChartOptions} />
                            </div>
                        </div>;
                    case "Line Chart":
                        return  <div className="charts-wrapper" key={section.id} >
                        <h5>{section.chartName}</h5>
                        <div className="charts-box">
                                <Line data={section.chart} options={LineChartOptions} />
                            </div>
                        </div>;
                    case "Horizontal Bar Chart":
                        return <div className="charts-wrapper" key={section.id} >
                        <h5>{section.chartName}</h5>
                        <div className="charts-box">
                                <Bar data={section.chart} options={HorizontalBarChartOptions} />
                            </div>
                        </div>;
                    case "Multi Series Pie Chart":
                        return <div className="charts-wrapper" key={section.id} >
                        <h5>{section.chartName}</h5>
                        <div className="charts-box">
                                <Pie data={section.chart} options={MultiPieChartOptions} />
                            </div>
                        </div>;
                    case "Radar Chart":
                        return <div className="charts-wrapper" key={section.id} >
                        <h5>{section.chartName}</h5>
                        <div className="charts-box">
                            <Radar data={section.chart} options={RadarChartOptions} />
                            </div>
                        </div>;
                    case "PolarArea Chart":
                        return <div className="charts-wrapper" key={section.id} >
                        <h5>{section.chartName}</h5>
                        <div className="charts-box">
                        <PolarArea data={section.chart} options={PolarChartOptions} />
                            </div>
                        </div>;
                    default: return null;
                }
            })
        }
    </div>

</div>

{/* </div> */}
    </>
  )
}

export default Dashboard