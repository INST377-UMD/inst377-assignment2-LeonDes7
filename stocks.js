const API_KEY = 'X_so89rIC5tlGibGUCa6bBrbAOHv9W2K';
const tradeLink = 'https://tradestie.com/api/v1/apps/reddit?date=2022-04-03';

const ctx = document.getElementById('myChart').getContext('2d');
const stockChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Closing Price',
      data: [],
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      tension: 0.2
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: false }
    }
  }
});

function formatDate(dateObj) {
  return dateObj.toISOString().split('T')[0];
}

async function stockGraph(ticker, range) {
  document.getElementById("chart").hidden = false;
  ticker = ticker.toUpperCase();
  range = parseInt(range);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 90);

  const startStr = formatDate(startDate);
  const endStr = formatDate(endDate);

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startStr}/${endStr}?adjusted=true&sort=asc&limit=120&apiKey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    if (!json.results || json.results.length === 0) {
      alert("No stock data found.");
      return;
    }

    const sliced = json.results.slice(-range);
    const labels = sliced.map(d => new Date(d.t).toLocaleDateString());
    const prices = sliced.map(d => d.c);

    stockChart.data.labels = labels;
    stockChart.data.datasets[0].data = prices;
    stockChart.data.datasets[0].label = `Closing Price for ${ticker} (${range} Days)`;
    stockChart.update();
  } catch (err) {
    console.error("Fetch exploded:", err);
    alert("Error fetching stock data.");
  }
}

async function topFiveReditStock(url) {
  const tbody = document.getElementById("stocksTable");
  tbody.innerHTML = "";
  try {
    const res = await fetch(url);
    const data = await res.json();
    const topFive = data.sort((a, b) => b.no_of_comments - a.no_of_comments).slice(0, 5);

    topFive.forEach(stock => {
      const sentimentIcon = stock.sentiment === "Bullish" ? "📈" : "📉";
      tbody.innerHTML += `
        <tr>
          <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
          <td>${stock.no_of_comments}</td>
          <td>${stock.sentiment} ${sentimentIcon}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Reddit fetch failed:", err);
  }
}

topFiveReditStock(tradeLink);

if (annyang) {
  const commands = {
    'hello': () => alert('Hello World'),
    'change the color to *color': color => document.body.style.backgroundColor = color,
    'navigate to *page': page => {
      const dest = page.toLowerCase();
      if (dest === 'home') window.location.href = 'index.html';
      else if (dest === 'stocks') window.location.href = 'stocks.html';
      else if (dest === 'dogs') window.location.href = 'dogs.html';
    },
    'lookup *ticker': ticker => stockGraph(ticker.toUpperCase(), 30)
  };
  annyang.addCommands(commands);
}