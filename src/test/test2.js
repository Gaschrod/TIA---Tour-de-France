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

var dico_score = {
  Hollande: { secondes: 65, points: 2 },
  Belgique: { secondes: 200, points: 1 },
  France: { secondes: 110, points: 5 },
};

const nomsJoueurs = ["Hollande", "Belgique", "France"];

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// fonction pour vérifier si un joueur a terminé la course
function cyclisteATermine(nomUtilisateur, cycliste) {
  // Vérifie si tous les cyclistes du joueur ont terminé la course
  if (positions[nomUtilisateur + "_cycliste_" + cycliste].case > 95) {
    return true;
  }
  return false;
}

function tousJoueursTermines(nomsJoueurs) {
  // Vérifie pour chaque joueur si tous les cyclistes on terminé la course
  for (let i = 0; i < nomsJoueurs.length; i++) {
    const nomUtilisateur = nomsJoueurs[i];
    // il y a 3 cyclistes par joueur
    for (let j = 1; j <= 3; j++) {
      const cycliste = dico_cyclistes[i]["cycliste " + j];
      if (cyclisteATermine(nomUtilisateur, cycliste) === false) {
        return false;
      }
    }
  }
  return true;
}

// fonction classement secondes par joueur
function MajClassementSecondes(nomUtilisateur, cycliste) {
  //Si le joueur actuel à terminé
  if (cyclisteATermine(nomUtilisateur, cycliste) === true) {
    // Et que tous les joueurs n'ont pas terminé
    if (tousJoueursTermines(nomsJoueurs) === false) {
      for (let i = 0; i < nomsJoueurs.length; i++) {
        const nomJ = nomsJoueurs[i];
        // Si le joueur actuel n'est pas le joueur en cours
        if (nomJ !== nomUtilisateur) {
          //On ajoute 10 secondes de pénalité pour chaque courreur encore en course
          majScoreCourreur(nomJ);
        }
      }
    }
  }
}

function classementSecondes(dico_score) {
  // Si un joueur dépasse la case 95, on soustrait la différence entre la case où il se trouve et 95 à ses secondes
  for (let i = 0; i < nomsJoueurs.length; i++) {
    const nomUtilisateur = nomsJoueurs[i];
    if (dico_score[nomUtilisateur].secondes > 0) {
      dico_score[nomUtilisateur].secondes -=
        positions[nomUtilisateur + "_cycliste_1"].case - 95;
      dico_score[nomUtilisateur].secondes -=
        positions[nomUtilisateur + "_cycliste_2"].case - 95;
      dico_score[nomUtilisateur].secondes -=
        positions[nomUtilisateur + "_cycliste_3"].case - 95;
    }
  }
}

// fonction de classement pour les points d'équipe
function MajClassementPoints(dico_score) {
  // Trier les joueurs par points
  nomsJoueurs.sort(function (a, b) {
    return dico_score[b].points - dico_score[a].points;
  });

  // Mettre à jour le classement
  for (let i = 0; i < nomsJoueurs.length; i++) {
    const nomUtilisateur = nomsJoueurs[i];
    dico_score[nomUtilisateur].classementPoints = i + 1;
  }
}

// Affichage des résultats pour vérifier
MajClassementPoints(dico_score);
console.log(dico_score);
