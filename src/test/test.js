var dico_cyclistes = [
  {
    "cycliste 1": {
      section: 1,
      rangée: "interieur",
      case: 8,
      id: "c8_0",
    },
    "cycliste 2": {
      section: 1,
      rangée: "interieur",
      case: 7,
      id: "c7_0",
    },
  },
  {
    "cycliste 2": {
      section: 0,
      rangée: "interieur",
      case: 7,
      id: "c7_0",
    },
  },
  {},
  {},
];

function verifierID(cyclisteID) {
  for (let i = 0; i < dico_cyclistes.length; i++) {
    let cyclistesDansDico = dico_cyclistes[i];
    for (const key in cyclistesDansDico) {
      if (Object.hasOwnProperty.call(cyclistesDansDico, key)) {
        const cycliste = cyclistesDansDico[key];

        // Vérifier si l'ID du cycliste correspond à l'ID fourni
        if (cycliste.id === cyclisteID) {
          return false;
        }
      }
    }
  }
  return true; // Aucun cycliste avec l'ID fourni n'a été trouvé
}

verif = verifierID("c8_0");
console.log(verif);
