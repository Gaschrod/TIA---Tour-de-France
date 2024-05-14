function checkWhoStarts(liste) {
  let indexMax = null;
  let maxValeur = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < liste.length; i++) {
    for (let j = 0; j < liste[i].length; j++) {
      let premierElementSousSousListe = liste[i][j][0]; // Accéder au premier élément de chaque sous-sous-liste

      if (premierElementSousSousListe > maxValeur) {
        maxValeur = premierElementSousSousListe;
        indexMax = i;
      }
    }
  }

  return indexMax;
}

// Exemple d'utilisation
let liste = [
  [
    [3, 7, 9],
    [50, 5, 8],
    [1, 6, 10],
  ],
  [
    [13, 17, 19],
    [12, 15, 18],
    [45, 16, 45],
  ],
  [
    [23, 27, 29],
    [22, 25, 28],
    [21, 26, 30],
  ],
];

let indexDepart = checkWhoStarts(liste);
console.log("L'index de départ est :", indexDepart); // Renvoie l'index de la sous-liste principale ayant la plus grande valeur de premier élément dans la sous-sous-liste.
