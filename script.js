async function getData(url) {
	const res = await fetch(url);
	const textfile = await res.text();

	let rows = textfile.split("\n");

	rows = rows.slice(1);

	let years = [];
	let temps = [];

	rows.forEach((row) => {
		row = row.split(",");
		row = row.slice(0, 2);
		years.push(row[0]);
		temps.push(row[1]);
	});

	return { years, temps };
}

async function makeChart(datax, datay, id, chartLabel, chartType, fromZero) {
	const ctx = document.getElementById(id).getContext("2d");

	const myChart = new Chart(ctx, {
		type: chartType,
		data: {
			labels: datax,
			datasets: [
				{
					label: chartLabel,
					data: datay,
					backgroundColor: "rgba(255, 99, 132, 0.2)",
					borderColor: "rgba(255, 99, 132, 1)",
					borderWidth: 1,
				},
			],
		},
		options: {
			scales: {
				y: {
					beginAtZero: fromZero,
				},
			},
		},
	});
}

(async function () {
	const data = await getData("ZonAnn.Ts+dSST.csv");
	await makeChart(
		data.years,
		data.temps,
		"myChart",
		`"Global average temperature" by mean(14°C)`,
		"line",
		false
	);
	let newTemps = [];

	data.temps.forEach((temp) => {
		newTemps.push(parseFloat(temp) + 14);
	});

	await makeChart(
		data.years,
		newTemps,
		"myChart2",
		`"Global average temperature"`,
		"bar",
		true
	);
})();
