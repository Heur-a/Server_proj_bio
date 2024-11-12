   // Inicializar el mapa
   var map = L.map('map').setView([40.4168, -3.7038], 6); // Coordenadas de España

   // Añadir el mapa base
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       maxZoom: 18,
       attribution: '© OpenStreetMap'
   }).addTo(map);

   // Función para generar datos aleatorios de calidad del aire
   function generarDatosAleatorios(lat, lon) {
       var calidad = Math.random();
       var color;
       var descripcion;
       var medicion;

       if (calidad < 0.4) {
           color = "green";
           descripcion = "Buena";
           medicion = (Math.random() * (30 - 0) + 0).toFixed(2) + " µg/m³";
       } else if (calidad < 0.7) {
           color = "yellow";
           descripcion = "Moderada";
           medicion = (Math.random() * (60 - 31) + 31).toFixed(2) + " µg/m³";
       } else {
           color = "red";
           descripcion = "Mala";
           medicion = (Math.random() * (150 - 61) + 61).toFixed(2) + " µg/m³";
       }

       // Añadir el marcador con los datos de calidad
       var marker = L.circleMarker([lat, lon], {
           radius: 30,  // Círculo más grande
           color: color,
           fillColor: color,
           fillOpacity: 0.8
       }).addTo(map);

       // Crear un popup que muestre los datos de calidad
       marker.bindPopup("Calidad del aire: " + descripcion + "<br>Medición: " + medicion);

       // Crear un marcador con la medición visible sobre el color
       marker.bindTooltip('<span class="medicion">' + medicion + '</span>', {
           permanent: true,
           direction: 'center',
           offset: [0, 0]
       }).openTooltip();
   }

   // Datos de las principales comunidades autónomas y sus coordenadas aproximadas
   const comunidades = [
       { name: 'Andalucía', lat: 37.5, lon: -4.5 },
       { name: 'Cataluña', lat: 41.6, lon: 1.0 },
       { name: 'Madrid', lat: 40.4168, lon: -3.7038 },
       { name: 'Valencia', lat: 39.47, lon: -0.37 },
       { name: 'Galicia', lat: 42.0, lon: -8.5 },
       { name: 'País Vasco', lat: 43.0, lon: -2.5 },
       { name: 'Castilla y León', lat: 41.0, lon: -5.5 },
   ];

   // Generar mediciones para las principales comunidades
   comunidades.forEach(comunidad => {
       generarDatosAleatorios(comunidad.lat, comunidad.lon);
   });

   // Función para obtener la ubicación del usuario
   function obtenerUbicacion() {
       if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(function (position) {
               var lat = position.coords.latitude;
               var lon = position.coords.longitude;
               map.setView([lat, lon], 12); // Centrar el mapa en la ubicación del usuario
               generarDatosAleatorios(lat, lon); // Mostrar datos de calidad del aire
           }, function () {
               alert("No se pudo obtener la ubicación.");
           });
       } else {
           alert("La geolocalización no está soportada por este navegador.");
       }
   }

   // Configurar el botón para obtener la ubicación
   document.getElementById('locationButton').addEventListener('click', function () {
       obtenerUbicacion();
   });