const ctx = document.getElementById('grafica').getContext('2d');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['1', '2', '3', '4', '5', '6'], // Minutos
    datasets: [
      {
        label: 'Ozono',
        data: [5, 5, 5, 6, 7, 25],
        borderColor: '#3a5335', // Verde oscuro
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#3a5335',
      },
      {
        label: 'Temperatura',
        data: [30, 29, 29, 29, 30, 30],
        borderColor: '#e4d8c3', // Beige claro
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#e4d8c3',
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#3b3b3b', // Gris oscuro
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 't (min)',
          color: '#3b3b3b',
          font: {
            size: 14,
          },
        },
        ticks: {
          color: '#3b3b3b',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'T (°C) / Ozono (ppm * 100)',
          color: '#3b3b3b',
          font: {
            size: 14,
          },
        },
        ticks: {
          color: '#3b3b3b',
        },
      },
    },
  },
});

