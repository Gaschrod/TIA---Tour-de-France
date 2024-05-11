const listeCyclistes = [
  {
    cycliste_1: {},
    cycliste_2: { id: "106", case: "B4", section: "2", rangee: "Est" },
    cycliste_3: { id: "105", case: "C5", section: "3", rangee: "Sud" },
  },
  {
    cycliste_1: { id: "test", case: "A3", section: "1", rangee: "Nord" },
    cycliste_2: { id: "test", case: "B6", section: "2", rangee: "Est" }, // Doublon de l'ID "102"
    cycliste_3: { id: "105", case: "C7", section: "3", rangee: "Sud" },
  },
];

function verifierCyclistes(listeCyclistes) {
  const ids = new Set();

  for (const groupeCyclistes of listeCyclistes) {
    for (const key in groupeCyclistes) {
      const cycliste = groupeCyclistes[key];
      if (ids.has(cycliste.id)) {
        return true; // Deux cyclistes ont le même ID
      }
      if (cycliste.id !== "case_départ") {
        ids.add(cycliste.id);
      }
    }
  }

  return false; // Aucun cycliste n'a le même ID
}

// Test de la fonction
console.log(verifierCyclistes(listeCyclistes)); // Affichera `true` si un doublon d'ID est trouvé
