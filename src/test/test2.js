var dico_cyclistes = [
  {
    "cycliste 1": {
      section: 1,
      rangée: "interieur",
      case: 10,
      id: "c10_0",
    },
  },
  {},
  {},
  {},
];

function verifierDiago(cyclistePrincipal, casePrincipal) {
  const rangéesAdjacentes = {
    interieur: ["milieu"],
    milieu: ["interieur", "exterieur"],
    exterieur: ["milieu"],
  };

  for (let i = 0; i < dico_cyclistes.length; i++) {
    let cyclistesDansDico = dico_cyclistes[i];
    for (const key in cyclistesDansDico) {
      if (Object.hasOwnProperty.call(cyclistesDansDico, key)) {
        const autreCycliste = cyclistesDansDico[key];

        // Vérifier si les cyclistes sont différents
        if (cyclistePrincipal.id !== autreCycliste.id) {
          // Vérifier si la case et la rangée de l'autre cycliste sont en diagonale par rapport au cycliste principal
          if (
            Math.abs(casePrincipal - autreCycliste.case) === 1 &&
            rangéesAdjacentes[cyclistePrincipal.rangée].includes(
              autreCycliste.rangée
            )
          ) {
            return false;
          }
        }
      }
    }
  }
  return true; // Aucun cycliste n'est dans la diagonale du cycliste principal
}

function checkAspiration(cyclistePrincipal) {
  for (let i = 0; i < dico_cyclistes.length; i++) {
    let cyclistesDansDico = dico_cyclistes[i];
    for (const key in cyclistesDansDico) {
      if (Object.hasOwnProperty.call(cyclistesDansDico, key)) {
        const autreCycliste = cyclistesDansDico[key];
        // Vérifier si les cyclistes sont différents
        if (cyclistePrincipal !== autreCycliste) {
          casePrincipal = cyclistePrincipal.case;
          // Vérifier la distance entre les cyclistes est de 2 cases
          if (
            autreCycliste.case - casePrincipal === 1 &&
            cyclistePrincipal.rangée === autreCycliste.rangée &&
            verifierDiago(cyclistePrincipal, casePrincipal) === true
          ) {
            return "diago"; // Les cyclistes sont à une distance de 1 case l'un de l'autre et la case suivante est libre
          } else if (
            autreCycliste.case - casePrincipal === 2 &&
            cyclistePrincipal.rangée === autreCycliste.rangée
          ) {
            return "ligne"; // Les cyclistes sont à une distance de 2 cases l'un de l'autre
          }
          // On vérifie également si le cycliste est à une case de distance et que la case suivante et la rangée à coté de l'autre cycliste est libre
        }
      }
    }
  }
  return false; // Aucun cycliste n'est à une distance de 2 cases l'un de l'autre ou la case suivante est libre
}

verif = checkAspiration(dico_cyclistes[0]["cycliste 1"]);
console.log(verif); // devrait afficher "true"
