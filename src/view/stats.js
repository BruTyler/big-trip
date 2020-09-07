import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AbstractView from '../abstract/simple-view.js';
import {StatsType} from '../const.js';
import {calculateStat} from '../utils/stats.js';

const BAR_HEIGHT = 40;

const renderMoneyChart = (moneyCtx, tripEvents) => {
  const statData = calculateStat(tripEvents, StatsType.MONEY);
  const statLabel = Object.keys(statData).map((label) => label.toUpperCase().padStart(12));
  moneyCtx.height = BAR_HEIGHT * Object.keys(statData).length;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: statLabel,
      datasets: [{
        data: Object.values(statData),
        backgroundColor: `#fff`,
        hoverBackgroundColor: `#f9f9f9`,
        borderWidth: 0.5,
        borderColor: `#33d`,
        borderSkipped: `none`,
        anchor: `end`,
        align: `end`,
        barThickness: 40,
        minBarLength: 40,
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
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: `MONEY`,
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

const renderTransportChart = (transportCtx, tripEvents) => {
  const statData = calculateStat(tripEvents, StatsType.TRANSPORT);
  const statLabel = Object.keys(statData).map((label) => label.toUpperCase().padStart(12));
  transportCtx.height = BAR_HEIGHT * Object.keys(statData).length;

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: statLabel,
      datasets: [{
        data: Object.values(statData),
        backgroundColor: `#fff`,
        hoverBackgroundColor: `#f9f9f9`,
        borderWidth: 0.5,
        borderColor: `#33d`,
        borderSkipped: `none`,
        anchor: `end`,
        align: `end`,
        barThickness: 40,
        minBarLength: 40,
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
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
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

const renderTimeSpendChart = (timeSpendCtx, tripEvents) => {
  const statData = calculateStat(tripEvents, StatsType.TIME_SPENT);
  const statLabel = Object.keys(statData).map((label) => label.toUpperCase().padStart(12));
  timeSpendCtx.height = BAR_HEIGHT * Object.keys(statData).length;

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: statLabel,
      datasets: [{
        data: Object.values(statData),
        backgroundColor: `#fff`,
        hoverBackgroundColor: `#f9f9f9`,
        borderWidth: 0.5,
        borderColor: `#33d`,
        borderSkipped: `none`,
        anchor: `end`,
        align: `end`,
        barThickness: 40,
        minBarLength: 40,
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
          formatter: (val) => `${val}H`
        }
      },
      title: {
        display: true,
        text: `TIME SPENT`,
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

const createStatsTemplate = () => {
  return `<section class="statistics">
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

export default class Stats extends AbstractView {
  constructor(tripEvents) {
    super();

    this._tripEvents = tripEvents;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  _setCharts() {
    if (this._moneyChart !== null || this._transportChart !== null || this._timeSpendChart !== null) {
      this._moneyChart = null;
      this._transportChart = null;
      this._timeSpendChart = null;
    }

    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = this.getElement().querySelector(`.statistics__chart--time`);

    this._moneyChart = renderMoneyChart(moneyCtx, this._tripEvents);
    this._transportChart = renderTransportChart(transportCtx, this._tripEvents);
    this._timeSpendChart = renderTimeSpendChart(timeSpendCtx, this._tripEvents);
  }
}
