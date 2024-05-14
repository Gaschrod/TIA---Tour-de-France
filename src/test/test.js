dico = [
  {
    "cycliste 1": {
      section: 2,
      rangée: "interieur",
      case: 6,
      id: "c6_0",
    },
    "cycliste 2": {
      section: 2,
      rangée: "interieur",
      case: 7,
      id: "c6_0",
    },
  },
  {
    "cycliste 1": {
      section: 1,
      rangée: "interieur",
      case: 3,
      id: "c3_0",
    },
  },
  {},
  {},
];

function verifierDistanceCyclistes(cyclistePrincipal, listeCyclistes) {
  for (let i = 0; i < listeCyclistes.length; i++) {
    let cyclistesDansDico = listeCyclistes[i];
    for (const key in cyclistesDansDico) {
      if (Object.hasOwnProperty.call(cyclistesDansDico, key)) {
        const autreCycliste = cyclistesDansDico[key];
        console.log(autreCycliste);
        // Vérifier si les cyclistes sont différents
        if (cyclistePrincipal !== autreCycliste) {
          // Vérifier la distance entre les cyclistes
          if (
            Math.abs(cyclistePrincipal.case - autreCycliste.case) <= 2 &&
            cyclistePrincipal.section === autreCycliste.section &&
            cyclistePrincipal.rangée === autreCycliste.rangée
          ) {
            return true; // Les cyclistes sont à une distance de 2 cases l'un de l'autre
          }
        }
      }
    }
  }
  return false; // Aucun cycliste n'est à une distance de 2 cases l'un de l'autre
}
let cyclistePrincipal = {
  case: 10,
  section: 1,
  rangée: "interieur",
  id: "c3_0",
};

console.log(verifierDistanceCyclistes(cyclistePrincipal, dico));
