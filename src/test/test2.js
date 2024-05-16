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
    "cycliste 1": {
      section: 1,
      rangée: "milieu",
      case: 8,
      id: "c8_1",
    },
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

var dico_score = [
  { Belgique: { score: 0, points: 0 } },
  { Hollande: { score: 0, points: 0 } },
];

function updateSprintResults(dico_cyclistes) {
  let premierCyclisteSprint1 = null;
  let premierCyclisteSprint2 = null;

  for (let i = 0; i < dico_cyclistes.length; i++) {
    let cyclistesDansDico = dico_cyclistes[i];
    for (const key in cyclistesDansDico) {
      if (Object.hasOwnProperty.call(cyclistesDansDico, key)) {
        const cycliste = cyclistesDansDico[key];

        // Vérifier le premier cycliste à terminer le premier sprint
        if (cycliste.case >= 22 && cycliste.case <= 35) {
          if (
            !premierCyclisteSprint1 ||
            cycliste.case < premierCyclisteSprint1.case
          ) {
            premierCyclisteSprint1 = cycliste;
          }
        }

        // Vérifier le premier cycliste à terminer le deuxième sprint
        if (cycliste.case >= 76 && cycliste.case <= 95) {
          if (
            !premierCyclisteSprint2 ||
            cycliste.case < premierCyclisteSprint2.case
          ) {
            premierCyclisteSprint2 = cycliste;
          }
        }
      }
    }
  }

  // Mise à jour du premier cycliste qui termine le premier sprint
  if (premierCyclisteSprint1) {
    dico_score[0].Belgique.score += 1;
    dico_score[0].Belgique.points += 1;
  }

  // Mise à jour du premier cycliste qui termine le deuxième sprint
  if (premierCyclisteSprint2) {
    dico_score[1].Hollande.score += 2;
    dico_score[1].Hollande.points += 4;
  }
}

// Appel de la fonction pour mettre à jour les résultats des sprints
updateSprintResults(dico_cyclistes, dico_score);

// Affichage des résultats pour vérifier
console.log(dico_score);
