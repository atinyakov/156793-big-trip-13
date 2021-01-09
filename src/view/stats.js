import Smart from './smart';

import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import dayjs from 'dayjs';

const createChart = (target, config) => {
  return new Chart(target, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: config.labels,
      datasets: [{
        data: config.data,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: config.formatter,
        }
      },
      title: {
        display: true,
        text: config.text,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};
const createStats = () => {
  return `<section class="statistics statistics--hidden">
  <h2 class="visually-hidden">Trip statistics</h2>

  <div class="statistics__item statistics__item--money">
    <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
  </div>

  <div class="statistics__item statistics__item--transport">
    <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
  </div>

  <div class="statistics__item statistics__item--time-spend">
    <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
  </div>
</section>`;
};

export default class Stats extends Smart {
  constructor(data) {
    super();
    this._data = data;

    this._colorsCart = null;
    this._daysChart = null;
    this._setCharts();
  }

  getTemplate() {
    return createStats();
  }

  _prepareMoneyData() {
    return this._data.reduce((acc, current) => {
      return Object.assign(acc, {[current.type]: acc[current.type] ? acc[current.type] + +current.price : +current.price});
    }, {});
  }

  _prepareTypeData() {
    return this._data.reduce((acc, current) => {
      return Object.assign(acc, {[current.type]: acc[current.type] ? acc[current.type] + 1 : 1});
    }, {});
  }

  _prepareTimeData() {
    return this._data.reduce((acc, current) => {
      return Object.assign(acc, {[current.type]: acc[current.type] ? acc[current.type] + dayjs(dayjs(current.endTime).diff(current.startTime, `ms`)) : +dayjs(dayjs(current.endTime).diff(current.startTime, `ms`))});
    }, {});
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }

    const moneyChartData = this._prepareMoneyData();
    const typeChartData = this._prepareTypeData();
    const timeChartData = this._prepareTimeData();

    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const typeCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeCtx = this.getElement().querySelector(`.statistics__chart--time`);

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * Object.keys(moneyChartData).length;
    typeCtx.height = BAR_HEIGHT * Object.keys(typeChartData).length;
    timeCtx.height = BAR_HEIGHT * Object.keys(moneyChartData).length;

    this._moneyChart = createChart(moneyCtx, {
      labels: Object.keys(moneyChartData).map((lbl) => lbl.toUpperCase()),
      data: Object.values(moneyChartData),
      formatter: (val) => `€ ${val}`,
      text: `MONEY`,
    });

    this._typeChart = createChart(typeCtx, {
      labels: Object.keys(typeChartData).map((lbl) => lbl.toUpperCase()),
      data: Object.values(typeChartData),
      formatter: (val) => `${val}x`,
      text: `TYPE`,
    });

    this._timeChart = createChart(timeCtx, {
      labels: Object.keys(timeChartData).map((lbl) => lbl.toUpperCase()),
      data: Object.values(timeChartData).map((ms) => dayjs(ms).format(`D`)),
      formatter: (val) => `${val}D`,
      text: `TIME`,
    });
  }

  restoreHandlers() {
  }
}


