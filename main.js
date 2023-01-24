import Chart from 'chart.js/auto';
// Récupération des éléments dans la page HTML
const tableau1 = document.querySelector('#table1');
const tableau2 = document.querySelector('#table2');
const tableau3 = document.querySelector('#firstHeading');

// Construction des canvas
const newTableau1=  document.createElement('canvas');
newTableau1.id = 'canvas1';
tableau1.before(newTableau1);
tableau1.before(newTableau1);

const newTableau2=  document.createElement('canvas');
newTableau2.id = 'canvas2';
tableau2.before(newTableau2);

const newTableau3=  document.createElement('canvas');
newTableau3.id = 'canvas3';
tableau3.after(newTableau3);


//GRAPHIQUE 1

function extractData() {
  // Récupère la table avec l'ID "table1"
  const table = document.getElementById("table1");
  const countries = []; // Initialise un tableau pour stocker les pays
  const years = []; // Initialise un tableau pour stocker les années
  const numbers = []; // Initialise un tableau pour stocker les données numériques
  const rows = table.rows; // Récupère toutes les lignes de la table
  const firstRow = rows[1]; // Récupère la première ligne (l'en-tête)
  
  // Boucle sur toutes les lignes de la table (à l'exception de la première ligne)
  for (let i = 2, row; row = rows[i]; i++) {
      // Récupère le nom du pays
      let country = row.cells[1].innerHTML;
      countries.push(country); // Ajoute le pays au tableau des pays
      
      // Initialise un tableau pour stocker les données numériques pour ce pays
      let numberData = [];
      // Boucle sur toutes les cellules de la ligne (à l'exception de la première cellule)
      for (let j = 2, col; col = row.cells[j]; j++) {
          // Récupère la valeur numérique de la cellule et remplace la virgule par un point
          numberData.push(parseFloat(col.innerHTML.replace(",",".")));
      }
      // Ajoute les données numériques pour ce pays au tableau des données numériques
      numbers.push({[country]:numberData});
  }
  
  // Boucle sur toutes les cellules de la première ligne (l'en-tête)
  Array.from(firstRow.cells).forEach((cell, i) => {
      if (i > 1) { // Ignore la première cellule
          // Récupère l'année
          years.push(cell.innerHTML);
      }
  });
  
  // Affiche les tableaux des pays, des années et des données numériques dans la console
  console.log(countries);
  console.log(years);
  console.log(numbers);
  
  // Récupère le contexte 2D du canvas avec l'ID "canvas1"
  let ctx = document.getElementById('canvas1').getContext('2d');
  // Crée un nouveau graphique à lignes avec Chart.js
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: years, // Utilise les années comme étiquettes
        datasets: numbers.map((data, i) => {
            var country = Object.keys(data)[0]; // Récupère le nom du pays
            return {
                label: country,
                data: data[country],
                borderColor: getRandomColor(),
                fill: false
            }
        })
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
  });
}

extractData();

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
} 


//GRAPHIQUE 2


function extractTableData() {
  // Récupérer la référence de la table en utilisant son ID
  var table = document.getElementById("table2");
  // Récupérer toutes les lignes de la table en utilisant getElementsByTagName
  var rows = table.getElementsByTagName("tr");
  // Initialiser les tableaux pour stocker les données
  var countries = [];
  var years_07_09 = [];
  var years_10_12 = [];
  // Boucle sur toutes les lignes de la table (sauf la première ligne des en-têtes)
  for (var i = 1; i < rows.length; i++) {
    // Récupérer toutes les cellules de la ligne en cours
    var cells = rows[i].getElementsByTagName("td");
    // Ajouter le contenu de la première cellule (pays) au tableau des pays
    countries.push(cells[0].textContent);
    // Ajouter le contenu de la deuxième cellule (années 2007-09) au tableau des années 2007-09
    years_07_09.push(cells[1].textContent);
    // Ajouter le contenu de la troisième cellule (années 2010-12) au tableau des années 2010-12
    years_10_12.push(cells[2].textContent);
  }
  // Retourner les tableaux sous forme d'objet
  return { countries: countries, years_07_09: years_07_09, years_10_12: years_10_12 };
}
// Stocker les données extraites dans une variable
var data = extractTableData();

// Récupérer la référence du canevas en utilisant son ID
let ctx = document.getElementById('canvas2').getContext('2d');

// Créer le graphique en utilisant Chart.js
new Chart(ctx, {
  type: 'bar',
  data: {
      labels: data.countries, // utiliser les données des pays pour les étiquettes de l'axe des x
      datasets: [
        {
          label: '2007-09',
          data: data.years_07_09, // utiliser les données des années 2007-09 pour les données du graphique
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: '2010-12',
          data: data.years_10_12, // utiliser les données des années 2010-12 pour les données du graphique
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
  },
  options: {
      scales: {
          y: {
              beginAtZero: true
          }
      }
  }
});

// Fonction asynchrone pour récupérer des données
async function fetchData() {
  // Tableaux vides pour stocker les valeurs récupérées
  let value1 = [];
  let value2 = [];
  // Utilisation de la méthode fetch pour récupérer les données à partir de l'URL spécifiée
  await fetch("https://canvasjs.com/services/data/datapoints.php", {
    // Désactivation du cache pour éviter les problèmes potentiels
    cache: "no-store",
  })
    // Conversion des données en format JSON
    .then((dataPoints) => dataPoints.json())
    // Boucle pour parcourir chaque élément de données et stocker les valeurs dans les tableaux appropriés
    .then((stringData) => {
      stringData.forEach((element) => {
        value1.push(element[0]);
        value2.push(element[1]);
      });
    });
  // Renvoi des tableaux de valeurs
  return [value1, value2];
}
 
// Fonction pour insérer un graphique
function insertChart() {
  // Création d'un nouveau graphique à partir de l'élément newTableau3
  const chart = new Chart(newTableau3, {
    // Type de graphique : ligne
    type: "line",
    // Données pour le graphique
    data: {
      // Tableau pour les étiquettes de l'axe x
      labels: [],
      // Tableau pour les jeux de données
      datasets: [
        {
          // Tableau pour les valeurs de l'axe y
          data: [],
          // Etiquette pour les données
          label: "valeur",
        },
      ],
    },
  });
  // Insertion du graphique après l'élément tableau3
  tableau3.after(newTableau3);
  // Mise à jour du graphique toutes les secondes en utilisant la fonction fetchData
  setInterval(async () => {
    // Récupération des valeurs depuis la fonction fetchData
    const [value1, value2] = await fetchData();
    // Mise à jour des étiquettes de l'axe x avec les valeurs récupérées
    chart.data.labels = value1;
    // Mise à jour des valeurs de l'axe y avec les valeurs récupérées
    chart.data.datasets[0].data = value2;
    // Mise à jour du graphique
    chart.update();
  }, 2000);
}
insertChart();











/*var config = {
  type: 'line',
  data: {
      labels: [],
      datasets: [
          {
            label: "Data",
            data: [],
            backgroundColor : "black",
            borderColor : "blue",
          }
      ]                 
  },
  options: {
      responsive: true,
      plugins: {
          legend: {
          display: false,
          },
      },  
      scales: {
        y: {
            suggestedMin: -10,
            suggestedMax: 30,
            }
      }
  },
  
};

const myChart3= new Chart(document.getElementById('canvas3'), config);

function addData(chart,label, data) {
for (let z = 0; z < label.length; z++ ){ 
  chart.data.labels.push(label[z]);
}
for (let z = 0; z < data.length; z++){  
      chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data[z]);
  });
}
  chart.update();
};

var inter = setInterval(fetchF, 1000);
var label3 = [];


function fetchF(){

fetch("https://canvasjs.com/services/data/datapoints.php", {cache: "no-store"})
.then(response=> response.json())
.then(datapoints => {

  for(x=0; x<datapoints.length; x++){
      label3[x] = datapoints[x][0];
  };
 
  addData(myChart3, label3, datapoints);

});

};*/

