//variable de bases
var joueurs = ["j1_carte", "j2_carte", "j3_carte", "j4_carte"];
var nomsJoueurs = [];
var tableau = [];
var tourActuel = 1;
var index = 0;
var cyclistesJouesDansTour = 0;
const cyclistesArrives = [];
var dico_score = {};
const cases_chances = [
  "c9_0",
  "c10_0",
  "c11_0",
  "c12_0",
  "c15_1",
  "c16_1",
  "c19_2",
  "c21_2",
  "c24_0",
  "c26_0",
  "c28_0",
  "c30_0",
  "c32_0",
  "c34_0",
  "c48_0",
  "c57_1",
  "c66_0",
  "c66_1",
  "c74_0",
  "c90_2",
];

// Tableau pour stocker les identifiants de case
var Tableau_id_case = [];

var Joueur1Pion = {};
var Joueur2Pion = {};
var Joueur3Pion = {};
var Joueur4Pion = {};

var dico_cyclistes = [Joueur1Pion, Joueur2Pion, Joueur3Pion, Joueur4Pion];

// Initialisation des positions des cyclistes
const positions = {
  1: { pays: 0, section: 1, rangée: "milieu", case: 0, id: "case_départ" },
  2: { pays: 0, section: 1, rangée: "milieu", case: 0, id: "case_départ" },
  3: { pays: 0, section: 1, rangée: "milieu", case: 0, id: "case_départ" },
};

const sectionsRangées = {
  1: ["interieur", "milieu", "exterieur"],
  2: ["interieur", "milieu"],
  3: ["interieur", "milieu", "exterieur"],
  4: ["interieur", "milieu"],
  5: ["interieur", "milieu"],
  6: ["interieur"],
  7: ["interieur", "milieu"],
  8: ["interieur", "milieu", "exterieur"],
};

// Fonction pour démarrer le jeu
function Start_the_game() {
  var selectedHumanPlayers = parseInt(
    document.getElementById("selectHumanPlayers").value
  );
  var selectedBots = parseInt(document.getElementById("selectBots").value);
  var totalPlayers = selectedHumanPlayers + selectedBots;

  // Vérifie si le nombre total de joueurs est compris entre 2 et 4
  if (totalPlayers < 2 || totalPlayers > 4) {
    alert("Veuillez sélectionner entre 2 et 4 joueurs.");
    return;
  }

  // Génère les noms des joueurs humains
  for (var i = 1; i <= selectedHumanPlayers; i++) {
    var nom = prompt("Nom du Joueur " + i + " (Belgique ou Italie):");
    if (nom === null || nom === "") {
      alert("Veuillez entrer un nom pour tous les utilisateurs.");
      return;
    }
    if (["Belgique", "Italie"].includes(nom) === false) {
      alert("Nom de joueur invalide !");
      return;
    }
    nomsJoueurs.push(nom);
    //On initialise le score de chaque joueur à 0
  }

  for (var i = 1; i <= selectedBots; i++) {
    if (i === 1) {
      nomsJoueurs.push("Hollande");
    }
    if (i === 2) {
      nomsJoueurs.push("Allemagne");
    }
  }

  // Initialiser le score de chaque joueur à 0
  for (var i = 0; i < nomsJoueurs.length; i++) {
    dico_score[nomsJoueurs[i]] = {
      secondes: 0,
      secondesBonif: 0,
      sprintTermine: { sprint1: false, sprint2: false },
    };
    console.log("Dictionnaire des scores :", dico_score);
  }

  // Affiche les noms des joueurs
  console.log("Noms des joueurs :", nomsJoueurs);

  // Initialise les decks des joueurs
  for (var i = 0; i < joueurs.length; i++) {
    window[joueurs[i]] = [];
  }

  // Initialiser les positions des cyclistes pour chaque joueur
  var positionsString = "Positions des cyclistes :";
  for (var i = 0; i < nomsJoueurs.length; i++) {
    var joueur = nomsJoueurs[i];
    positionsString += " " + joueur + " :";
    // afffiche dans la console
    for (var j = 1; j <= 3; j++) {
      positions[joueur + "_cycliste_" + j] = {
        pays: joueur,
        section: 1,
        rangée: "milieu",
        case: 0,
        id: "case_départ",
      };
      positionsString +=
        " cycliste " +
        j +
        " : section 1, rangée milieu, case 0, id case_départ ||";
    }
  }
  console.log(positionsString.substring(0, positionsString.length - 2)); //enlever les deux derniers caractères

  // Création du jeu de carte des secondes (12 cartes de 1 à 12, chacune répétée 8 fois)
  for (var i = 1; i <= 12; i++) {
    //12 itérations
    for (var j = 1; j <= 8; j++) {
      //8 itérations
      var carte = [i, j];
      tableau.push(carte);
    }
  }

  // Boucle pour chaque case dans la rangée intérieur
  for (let i = 0; i < 105; i++) {
    Tableau_id_case.push("c" + (i + 1) + "_0");
  }

  // Boucle pour chaque case dans la rangée du milieu
  for (let i = 0; i < 105; i++) {
    if (i < 72 || i > 74) {
      Tableau_id_case.push("c" + (i + 1) + "_1");
    }
  }

  // Boucle pour chaque case dans la rangée extérieur
  for (let i = 0; i < 105; i++) {
    if (
      (i >= 0 && i < 10) || // Section 1 case supp virage
      (i >= 18 && i < 21) || // Section 3
      (i >= 21 && i < 35) || // Section 4
      (i >= 62 && i < 64) || // Section 5 2 cases supp virage
      (i >= 94 && i < 95) || // Section 8
      (i >= 95 && i < 105)
    ) {
      // Section 9
      Tableau_id_case.push("c" + (i + 1) + "_2");
    }
  }

  // Affichage du tableau contenant les identifiants de case
  console.log(Tableau_id_case);
  console.log("Le jeu a démarré gg!");
  console.log("Jeu de cartes des secondes généré :", tableau);

  // Distribue 5 cartes à chaque joueur
  for (var i = 0; i < totalPlayers; i++) {
    for (var j = 0; j < 5; j++) {
      RandomCarte(i);
    }
  }

  var joueursListe = [];
  // Affiche les decks de chaque joueur une seule fois après la distribution des cartes
  for (var i = 0; i < joueurs.length; i++) {
    console.log("Le deck de " + nomsJoueurs[i] + " est :", window[joueurs[i]]);
    joueursListe.push(window[joueurs[i]]);
  }

  console.log(joueursListe);
  const verif = checkWhoStarts(joueursListe);
  console.log("Le joueur qui commence en premier est à l'index :", verif);

  // Et on met le nom du joueur qui commence en premier dans la liste des noms
  if (nomsJoueurs[0] !== nomsJoueurs[verif]) {
    nomsJoueurs.unshift(nomsJoueurs[verif]);
    nomsJoueurs.splice(verif + 1, 1);

    //il faut aussi faire de même pour les cartes
    joueursListe.unshift(joueursListe[verif]);
    joueursListe.splice(verif + 1, 1);

    for (var j = 0; j < nomsJoueurs.length; j++) {
      window[joueurs[j]] = joueursListe[j];
    }
  }
  console.log(nomsJoueurs);

  afficherJoueursEtCartesHTML(nomsJoueurs);

  // Supprime le bouton de démarrage et les deux autres boutons de sélection
  var startButton = document.getElementById("myButton");
  if (startButton) {
    startButton.remove();
  }
  var selectHumanPlayerstoerasebutton =
    document.getElementById("selectHumanPlayers");
  var selectBotstoerasebutton = document.getElementById("selectBots");
  if (selectHumanPlayerstoerasebutton) {
    selectHumanPlayerstoerasebutton.remove();
  }
  if (selectBotstoerasebutton) {
    selectBotstoerasebutton.remove();
  }
  demarrerTour();
}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

// Fonction pour démarrer un tour
function demarrerTour() {
  alert("Début du tour " + tourActuel);
  alert("C'est à Joueur " + nomsJoueurs[index] + " de jouer !");
  cyclistesJouesDansTour = 0;
}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

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

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

// Fonction pour piocher une carte aléatoire
function RandomCarte(playerIndex) {
  // Vérifie si le tableau de cartes est vide
  if (tableau.length === 0) {
    console.log(
      "Plus de cartes à piocher, mince alors ! \nRemplissage du tableau en cours ..."
    );
    for (var i = 1; i <= 12; i++) {
      //12 itérations
      for (var j = 1; j <= 8; j++) {
        //8 itérations
        var carte = [i, j];
        tableau.push(carte);
      }
    }
  }

  // Choisis aléatoirement une carte du tableau
  var carteIndex = Math.floor(Math.random() * tableau.length);
  var cartePiochee = tableau.splice(carteIndex, 1)[0];

  // Distribue la carte au joueur correspondant
  window[joueurs[playerIndex]].push(cartePiochee);
}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

function joueurSuivant() {
  // Incrémente le compteur de cyclistes joués dans ce tour
  cyclistesJouesDansTour++;
  if (tourActuel === 1) {
    // Vérifie si tous les cyclistes ont joué dans ce tour
    if (cyclistesJouesDansTour === nomsJoueurs.length * 3) {
      // Réinitialise le compteur de cyclistes joués dans ce tour
      cyclistesJouesDansTour = 0;

      // Passe au tour suivant
      index++;

      // Si on a dépassé la fin du tableau, revenir au début et incrémenter le tour
      if (index >= nomsJoueurs.length) {
        index = 0;
        tourActuel++;
        alert(
          "Fin du tour " +
            (tourActuel - 1) +
            ", Début du tour " +
            tourActuel +
            " !"
        );
        alert("C'est au tour de " + nomsJoueurs[index] + " de jouer !");
      } else {
        alert("C'est au tour de " + nomsJoueurs[index] + " de jouer !");
      }
    } else {
      index++;

      // Si on a dépassé la fin du tableau, revenir au début
      if (index >= nomsJoueurs.length) {
        index = 0;
      }

      alert("C'est au tour de " + nomsJoueurs[index] + " de jouer !");
    }
  } else {
    // on récupère l'index du premier cycliste ce qui correspond à la position du nom du joueur à qui appartient ce cylcliste dans la liste des noms
    index++;
    // Si on a dépassé la fin du tableau, revenir au début
    if (index >= nomsJoueurs.length) {
      index = 0;
    }

    alert("C'est au tour de " + nomsJoueurs[index] + " de jouer !");
  }
}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

// Fonction pour afficher les joueurs et leurs cartes
// Fonction pour afficher les joueurs et leurs cartes en fonction du tour
function afficherJoueursEtCartesHTML() {
  var container = document.getElementById("joueursEtCartesContainer");
  container.innerHTML = ""; // Efface le contenu précédent

  for (var i = 0; i < nomsJoueurs.length; i++) {
    var joueur = joueurs[i];
    var nomJoueur = nomsJoueurs[i];
    var joueurDiv = document.createElement("div");
    joueurDiv.classList.add("joueur-container");

    var nomAffiche = "Joueur " + (i + 1) + " : " + nomJoueur;
    joueurDiv.innerHTML = "<h3>" + nomAffiche + "</h3>";

    if (nomJoueur === "Belgique") {
      joueurDiv.innerHTML +=
        "<img src='img/belgique.png' alt='Belgique' width='20' height='20'>";
    }
    if (nomJoueur === "Italie") {
      joueurDiv.innerHTML +=
        "<img src='img/italie.png' alt='Italie' width='16' height='16'>";
    }
    if (nomJoueur === "Hollande") {
      joueurDiv.innerHTML +=
        "<img src='img/hollande.png' alt='Hollande' width='15' height='15'>";
    }
    if (nomJoueur === "Allemagne") {
      joueurDiv.innerHTML +=
        "<img src='img/allemagne.png' alt='Allemagne' width='20' height='20'>";
    }

    // Ajoute le texte "Cartes seconde" sous le nom du joueur
    var cartesSecondeTexte = document.createElement("p");
    cartesSecondeTexte.textContent = "Cartes seconde:";
    joueurDiv.appendChild(cartesSecondeTexte);

    var cartesDuJoueur = window[joueur];
    if (cartesDuJoueur.length > 0) {
      var cartesListe = document.createElement("ul");

      for (var j = 0; j < cartesDuJoueur.length; j++) {
        var carte = cartesDuJoueur[j];
        var valeurCarte = carte[0];

        var carteItem = document.createElement("li");
        carteItem.textContent = "Carte " + (j + 1) + " : " + valeurCarte;

        // Vérifier si c'est le tour du joueur actuel
        if (i === index) {
          var jouerButton = document.createElement("button");
          jouerButton.textContent = "Jouer";

          // Utiliser une fonction anonyme pour passer l'index de la carte à la fonction jouer_carte
          jouerButton.onclick = (function (joueur, index) {
            return function () {
              jouer_carte(joueur, index);
            };
          })(joueur, j);
          if (nomsJoueurs[i] === "Belgique" || nomsJoueurs[i] === "Italie") {
            carteItem.appendChild(jouerButton);
          }
        }
        cartesListe.appendChild(carteItem);
      }
      joueurDiv.appendChild(cartesListe);
    } else {
      var pasDeCartes = document.createElement("p");
      pasDeCartes.textContent = "Pas de cartes";
      joueurDiv.appendChild(pasDeCartes);
    }
    if (nomsJoueurs[i] === "Hollande" || nomsJoueurs[i] === "Allemagne") {
      var jouerButton = document.createElement("button");
      jouerButton.textContent = "Jouer";

      jouerButton.onclick = (function (joueur) {
        return function () {
          jouer_carte(joueur);
        };
      })(joueur);
      var bot = document.createElement("p");
      bot.textContent = "Faire jouer le bot:";
      var br = document.createElement("br");
      joueurDiv.appendChild(br);
      joueurDiv.appendChild(bot);
      if (i == index) {
        joueurDiv.appendChild(jouerButton);
      }
    }
    container.appendChild(joueurDiv);
  }
}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

//Fonctions utiles à avancer

//Fonction pour jouer une carte chance
function piocherCarteChance() {
  var nombre = Math.floor(Math.random() * 7) - 3;
  alert("Carte chance piochée :" + nombre);
  return nombre;
}

function choisirCycliste() {
  if (cyclistesJouesDansTour < 1 * nomsJoueurs.length) {
    cycliste = 1;
  } else if (
    cyclistesJouesDansTour < 2 * nomsJoueurs.length &&
    cyclistesJouesDansTour >= 1 * nomsJoueurs.length
  ) {
    cycliste = 2;
  } else if (
    cyclistesJouesDansTour < 3 * nomsJoueurs.length &&
    cyclistesJouesDansTour >= 2 * nomsJoueurs.length
  ) {
    cycliste = 3;
  }
  return cycliste;
}

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

function checkTraverser(anciennePosition, rangée) {
  if (
    (anciennePosition.section === 1 ||
      anciennePosition.section === 3 ||
      anciennePosition.section === 7) &&
    ((anciennePosition.rangée === "interieur" && rangée === "exterieur") ||
      (anciennePosition.rangée === "exterieur" && rangée === "interieur")) &&
    anciennePosition.case !== 0
  ) {
    alert(
      "Déplacement impossible. Veuillez d'abord passer par la rangée du milieu."
    );
    return false;
  }
}

function majSections(nomUtilisateur, cycliste, rangée) {
  const sectionsLimites = [8, 18, 35, 62, 72, 75, 94];
  for (let i = 0; i < sectionsLimites.length; i++) {
    if (
      positions[nomUtilisateur + "_cycliste_" + cycliste].case >
      sectionsLimites[i]
    ) {
      //+2 car dans sectionsRangées on commence à 1 et non à 0or as de base: index = 0
      let sectionSuivante = i + 2;
      if (
        !sectionsRangées[sectionSuivante] ||
        !sectionsRangées[sectionSuivante].includes(rangée)
      ) {
        alert(
          "Sortie du plateau de jeu. Votre cycliste a été mis sur la rangé la plus proche dans la section suivante."
        );
        // On met le cycliste sur la rangée la plus proche dans le cas où il sort du plateau
        //Dans la section 5 la seule section est interieur
        if (positions[nomUtilisateur + "_cycliste_" + cycliste].section === 6) {
          positions[nomUtilisateur + "_cycliste_" + cycliste].rangée =
            "interieur";
          //sinon la section la plus proche est toujours la rangée du milieu
        } else {
          positions[nomUtilisateur + "_cycliste_" + cycliste].rangée = "milieu";
        }
      } else {
        positions[nomUtilisateur + "_cycliste_" + cycliste].section =
          sectionSuivante;
      }
    }
  }
}

function majId(nomUtilisateur, cycliste, sousCase) {
  if (
    positions[nomUtilisateur + "_cycliste_" + cycliste].rangée === "interieur"
  ) {
    var ext = "_0";
  } else if (
    /*Si range = milieu -> 1 de base mais attention aux virages
  si virage et que ancienne position est sur un virage, alors on passe à 2*/
    positions[nomUtilisateur + "_cycliste_" + cycliste].rangée === "milieu"
  ) {
    var ext = "_1";
    //Dans le cas où on se trouve avant une case_virage d'indice 2
    if (
      positions[nomUtilisateur + "_cycliste_" + cycliste].case === 9 &&
      sousCase === true
    ) {
      positions[nomUtilisateur + "_cycliste_" + cycliste].id = "c9_1";
    } else if (
      positions[nomUtilisateur + "_cycliste_" + cycliste].case === 10 &&
      sousCase === true
    ) {
      positions[nomUtilisateur + "_cycliste_" + cycliste].id = "c10_1";
    } else if (
      positions[nomUtilisateur + "_cycliste_" + cycliste].case === 63 &&
      sousCase === true
    ) {
      positions[nomUtilisateur + "_cycliste_" + cycliste].id = "c63_1";
    } else if (
      positions[nomUtilisateur + "_cycliste_" + cycliste].case === 64 &&
      sousCase === true
    ) {
      positions[nomUtilisateur + "_cycliste_" + cycliste].id = "64_1";
    }
  }
  //Si rangée = extérieur -> 2
  else {
    var ext = "_2";
  }
  /*-------------------------------------------------------------- */
  // Mise à jour l'identifiant de la case seulement si il n'a pas déjà été changé par la précédente condition
  positions[nomUtilisateur + "_cycliste_" + cycliste].id =
    "c" + positions[nomUtilisateur + "_cycliste_" + cycliste].case + ext;
}

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
            autreCycliste.case - casePrincipal === 1 &&
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

// Fonction pour vérifier si un cycliste se trouve sur une case adjacente ou la case suivante
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

// Fonction pour profiter de l'aspiration
function aspiration(nomJoueur, cycliste, casesAAvancer) {
  let positionCycliste = positions[nomJoueur + "_cycliste_" + cycliste];
  let aspirationType = checkAspiration(positionCycliste);

  if (aspirationType === "ligne") {
    let profiter = confirm("Profitez de l'aspiration ! Vous pouvez avancer de 1 case supplémentaire. Voulez-vous en profiter ?");
    if (profiter == true) {
      casesAAvancer += 1; // Le joueur profite de l'aspiration et avance d'une case supplémentaire
    }
  } else if (aspirationType === "diago") {
    let profiter = confirm("Profitez de l'aspiration diagonale ! Vous pouvez avancer de 1 case supplémentaire. Voulez-vous en profiter ?");
    if (profiter == true) {
      casesAAvancer += 1; // Le joueur profite de l'aspiration et avance d'une case supplémentaire
    }
  }
  return casesAAvancer; // Retourner le nombre total de cases à avancer
}

function logCyclistes() {
  let positionsString = "Positions des cyclistes : ";
  for (let i = 0; i < nomsJoueurs.length; i++) {
    const joueur = nomsJoueurs[i];
    for (let j = 1; j <= 3; j++) {
      positionsString +=
        joueur +
        " : cycliste " +
        j +
        " : section " +
        positions[joueur + "_cycliste_" + j].section +
        ", rangée " +
        positions[joueur + "_cycliste_" + j].rangée +
        ", case " +
        positions[joueur + "_cycliste_" + j].case +
        ", id " +
        positions[joueur + "_cycliste_" + j].id +
        " ||";
    }
  }
  console.log(positionsString.substring(0, positionsString.length - 2));
}

function mettreAJourPositionsJoueur(
  nomJoueur,
  cycliste,
  section,
  rangee,
  casePosition,
  idCase
) {
  var joueurPion;
  switch (nomJoueur) {
    case nomsJoueurs[0]:
      joueurPion = Joueur1Pion;
      break;
    case nomsJoueurs[1]:
      joueurPion = Joueur2Pion;
      break;
    case nomsJoueurs[2]:
      joueurPion = Joueur3Pion;
      break;
    case nomsJoueurs[3]:
      joueurPion = Joueur4Pion;
      break;
    default:
      console.log("Nom de joueur non reconnu :", nomJoueur);
      return;
  }
  /* console.log("Objet joueurPion de", nomJoueur, ":", joueurPion); // Ajout du nom du joueur ici*/

  joueurPion["cycliste " + cycliste] = {
    pays: nomJoueur,
    section: section,
    rangée: rangee,
    case: casePosition,
    id: idCase,
  };
}

function bouger_jeton(id, cycliste, nomJoueur) {
  var a = document.getElementById("SVGMap");
  cycliste = parseInt(cycliste);

  // get the inner DOM of alpha.svg
  var svgDoc = a.contentDocument;
  var x = 0;
  var y = 0;

  // Identifiez la balise g correspondant à la case où se trouve le joueur
  if (id === "case_départ") {
    x = 342;
    y = 342;
  } else {
    const g = svgDoc.getElementById("" + id);
    const matrix = g.transform.baseVal.consolidate()?.matrix;
    if (matrix == null) return;
    const bbox = g.getBBox();

    //On place le jeton du joueur au centre de la case
    const midX = bbox.x + bbox.width / 2;
    const midY = bbox.y + bbox.height / 2;
    x = matrix?.a * midX + matrix?.c * midY + matrix.e;
    y = matrix?.b * midX + matrix?.d * midY + matrix.f;
  }

  // Créez un élément image pour le jeton du joueur et le configurer
  if (cycliste === 1 && nomJoueur === "Belgique") {
    var jeton = svgDoc.getElementById("flagBE0");
  } else if (cycliste === 2 && nomJoueur === "Belgique") {
    var jeton = svgDoc.getElementById("flagBE1");
  } else if (cycliste === 3 && nomJoueur === "Belgique") {
    var jeton = svgDoc.getElementById("flagBE2");
  } else if (cycliste === 1 && nomJoueur === "Italie") {
    var jeton = svgDoc.getElementById("flagIT0");
  } else if (cycliste === 2 && nomJoueur === "Italie") {
    var jeton = svgDoc.getElementById("flagIT1");
  } else if (cycliste === 3 && nomJoueur === "Italie") {
    var jeton = svgDoc.getElementById("flagIT2");
  } else if (cycliste === 1 && nomJoueur === "Hollande") {
    var jeton = svgDoc.getElementById("flagNL0");
  } else if (cycliste === 2 && nomJoueur === "Hollande") {
    var jeton = svgDoc.getElementById("flagNL1");
  } else if (cycliste === 3 && nomJoueur === "Hollande") {
    var jeton = svgDoc.getElementById("flagNL2");
  } else if (cycliste === 1 && nomJoueur === "Allemagne") {
    var jeton = svgDoc.getElementById("flagGE0");
  } else if (cycliste === 2 && nomJoueur === "Allemagne") {
    var jeton = svgDoc.getElementById("flagGE1");
  } else if (cycliste === 3 && nomJoueur === "Allemagne") {
    var jeton = svgDoc.getElementById("flagGE2");
  }
  jeton.setAttribute("cx", x);
  jeton.setAttribute("cy", y);
  jeton.setAttribute("r", 10);
}

function retourArrière(anciennePosition, nomUtilisateur, cycliste) {
  // Annuler le déplacement en ramenant le joueur à sa position précédente
  positions[nomUtilisateur + "_cycliste_" + cycliste].rangée =
    anciennePosition.rangée;
  positions[nomUtilisateur + "_cycliste_" + cycliste].case =
    anciennePosition.case;
  positions[nomUtilisateur + "_cycliste_" + cycliste].id = anciennePosition.id;
  positions[nomUtilisateur + "_cycliste_" + cycliste].section =
    anciennePosition.section;

  //On met à jour les données
  mettreAJourPositionsJoueur(
    nomUtilisateur,
    cycliste,
    positions[nomUtilisateur + "_cycliste_" + cycliste].section,
    positions[nomUtilisateur + "_cycliste_" + cycliste].rangée,
    positions[nomUtilisateur + "_cycliste_" + cycliste].case,
    positions[nomUtilisateur + "_cycliste_" + cycliste].id
  );
}

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

function sprintTerminee1() {
  let sprintTerminee = false;
  for (let i = 0; i < nomsJoueurs.length; i++) {
    const nomUtilisateur = nomsJoueurs[i];
    if (dico_score[nomUtilisateur].sprintTermine.sprint1 === true) {
      sprintTerminee = true;
    }
  }
  return sprintTerminee;
}

function sprintTerminee2() {
  let sprintTerminee = false;
  for (let i = 0; i < nomsJoueurs.length; i++) {
    const nomUtilisateur = nomsJoueurs[i];
    if (dico_score[nomUtilisateur].sprintTermine.sprint2 === true) {
      sprintTerminee = true;
    }
  }
  return sprintTerminee;
}

// Initialisation des statistiques des joueurs
function sprintsIntermediaires(nomUtilisateur) {
  let premierCyclisteSprint1 = null;
  let premierCyclisteSprint2 = null;

  for (let i = 0; i < dico_cyclistes.length; i++) {
    let cyclistesDansDico = dico_cyclistes[i];
    for (const key in cyclistesDansDico) {
      if (Object.hasOwnProperty.call(cyclistesDansDico, key)) {
        const cycliste = cyclistesDansDico[key];

        // Vérifier si le cycliste a terminé le premier sprint
        if (cycliste.case > 35 && sprintTerminee1() === false) {
          if (
            !premierCyclisteSprint1 ||
            cycliste.case > premierCyclisteSprint1.case
          ) {
            premierCyclisteSprint1 = cycliste;
          }
        }

        // Vérifier si le cycliste a terminé le deuxième sprint
        if (cycliste.case > 95 && sprintTerminee2() === false) {
          if (
            !premierCyclisteSprint2 ||
            cycliste.case > premierCyclisteSprint2.case
          ) {
            premierCyclisteSprint2 = cycliste;
          }
        }
      }
    }
  }

  // Mise à jour du premier cycliste qui termine le premier sprint
  if (premierCyclisteSprint1) {
    dico_score[nomUtilisateur].secondesBonif += 1;
    dico_score[nomUtilisateur].sprintTermine.sprint1 = true;
  }

  // Mise à jour du premier cycliste qui termine le deuxième sprint
  if (premierCyclisteSprint2) {
    dico_score[nomUtilisateur].secondesBonif += 2;
    dico_score[nomUtilisateur].sprintTermine.sprint2 = true;
  }
}

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
      if (cyclisteATermine(nomUtilisateur, j) === false) {
        return false;
      }
    }
  }
  return true;
}

function tousCourreursTermines(nomUtilisateur) {
  // Vérifie si tous les cyclistes du joueur ont terminé la course
  for (let i = 1; i <= 3; i++) {
    if (cyclisteATermine(nomUtilisateur, i) === false) {
      return false;
    }
  }
  return true;
}

// fonction classement secondes par joueur
function majClassementSecondes(nomUtilisateur, cycliste) {
  //Si le joueur actuel à terminé
  if (cyclisteATermine(nomUtilisateur, cycliste) === true) {
    // Et que tous les joueurs n'ont pas terminé
    if (tousJoueursTermines(nomsJoueurs) === false) {
      for (let i = 0; i < nomsJoueurs.length; i++) {
        const nomJ = nomsJoueurs[i];
        // Si le joueur actuel n'est pas le joueur en cours
        if (nomJ !== nomUtilisateur) {
          //On vérifie pour les 3 coureurs de chaque joueur
          for (let j = 1; j <= 3; j++) {
            //Si ce n'est pas le cycliste actuel
            if (j !== cycliste) {
              //Si le cycliste n'a pas terminé on ajoute 10 secondes
              if (cyclisteATermine(nomJ, j) === false) {
                dico_score[nomJ].secondes += 10;
                console.log("10 secondes ajoutées à", nomJ);
              }
            }
          }
          //On ajoute 10 secondes de pénalité pour chaque courreur encore en course
        }
      }
    }
  }
}

function majClassementAprèsArrivee(nomUtilisateur, cycliste, anciennePosition) {
  if (
    anciennePosition.case <= 95 &&
    positions[nomUtilisateur + "_cycliste_" + cycliste].case > 95
  ) {
    const secondesAEnlever =
      positions[nomUtilisateur + "_cycliste_" + cycliste].case - 96;

    dico_score[nomUtilisateur].secondes -= secondesAEnlever;
    if (dico_score[nomUtilisateur].secondesBonif > 0) {
      dico_score[nomUtilisateur].secondes -=
        dico_score[nomUtilisateur].secondesBonif;
      dico_score[nomUtilisateur].secondesBonif = 0;
    }
    console.log("test not passed");
  }
  console.log("test passed");
}

function nettoyerArrivee(cycliste, nomUtilisateur) {
  //Pour chaque courreur dont la case excède 95 et seulement si ces courreurs sont au nombre de 3 on les supprime du dictionnaire et on les supprime visuelement de l'affichage sur la carte

  if (
    cyclisteATermine(nomUtilisateur, cycliste) === true &&
    cyclistesArrives.includes((nomUtilisateur, cycliste)) == false
  ) {
    cyclistesArrives.push([nomUtilisateur, cycliste]);
    console.log(cyclistesArrives);
  }

  if (
    cyclistesArrives.length === 3 ||
    cyclistesArrives.length === 6 ||
    cyclistesArrives.length === 9 ||
    cyclistesArrives.length === 12
  ) {
    console.log("test tp");
    for (tuples of cyclistesArrives) {
      //On met à jour les données pour que le cycliste soit tp au départ
      mettreAJourPositionsJoueur(
        tuples[0],
        tuples[1],
        1,
        "interieur",
        0,
        "case_départ"
      );
      bouger_jeton("case_départ", tuples[1], tuples[0]);
      console.log("test tp passé");
    }
  }
}

function finDuJeu() {
  //On fait le classement final avec le dico des scores 1er = le moins de secondes
  let classement = [];
  //On récupère les noms des joueurs ainsi que leur nombre de secondes associé
  for (let i = 0; i < nomsJoueurs.length; i++) {
    const nomUtilisateur = nomsJoueurs[i];
    classement.push([nomUtilisateur, dico_score[nomUtilisateur].secondes]);
  }
  //On trie le classement en fonction des secondes et on l'affiche
  classement.sort((a, b) => a[1] - b[1]);
  var txtAAfficher = "Classement final: \n";
  for (let i = 0; i < classement.length; i++) {
    txtAAfficher += classement[i][0] + ": " + classement[i][1] + "s\n";
  }
  alert(txtAAfficher);
  alert("Fin du jeu ! \nPour relancer la partie veuillez recharger la page.");
  console.log(txtAAfficher);
}

// Fonction pour avancer
function avancer(carteJouee) {
  // Récupérer les valeurs sélectionnées par l'utilisateur
  const nomUtilisateur = nomsJoueurs[index];
  var rangee = "interieur";
  var casesAAvancer = 0;
  casesAAvancer2 = 0;
  var cycliste = 0;
  var sousCase = false;

  if (tourActuel === 1) {
    cycliste = choisirCycliste();
  } else {
    cycliste = document.getElementById("cycliste").value;
  }

  var verifPeutJouer = false;
  // On vérifie si un joueur peut encore jouer avec un de ses courreurs sinon on passe le tour
  for (let i = 1; i <= 3; i++) {
    if (cyclisteATermine(nomUtilisateur, i) === false) {
      verifPeutJouer = true;
    }
  }
  if (verifPeutJouer === false) {
    alert(
      "Vous avez déjà terminé la course avec tous vos cyclistes. Veuillez passer au joueur suivant."
    );
    joueurSuivant();
    afficherJoueursEtCartesHTML();
  }

  if (cyclisteATermine(nomUtilisateur, cycliste) === true) {
    alert(
      "Ce cycliste a déjà terminé la course ! Veuillez en choisir un autre"
    );
    return false;
  }

  // Utiliser la valeur de la carte jouée comme nombre de cases à avancer
  if (Array.isArray(carteJouee)) {
    casesAAvancer = carteJouee[0]; // Utiliser la valeur de la carte jouée
  } else {
    casesAAvancer = carteJouee; // Utiliser la valeur de la carte jouée
  }

  // On définit l'ancienne position du cycliste
  const anciennePosition = {
    section: positions[nomUtilisateur + "_cycliste_" + cycliste].section,
    rangée: positions[nomUtilisateur + "_cycliste_" + cycliste].rangée,
    case: positions[nomUtilisateur + "_cycliste_" + cycliste].case,
    id: positions[nomUtilisateur + "_cycliste_" + cycliste].id,
  };

  // Vérifier si le déplacement du cycliste est valide en fonction de la rangée et de la section
  // Pas besoin de vérifier dans le cas où la section contient moins de 2 bandes de circulation
  checkTraverser(anciennePosition, rangee);

  // Mettre à jour la position du cycliste en ajoutant le nombre de cases à avancer
  positions[nomUtilisateur + "_cycliste_" + cycliste].case += casesAAvancer;

  //On vérifie que le cycliste reste sur sa rangée si elle est isolée
  if (positions[nomUtilisateur + "_cycliste_" + cycliste].section === 7) {
    positions[nomUtilisateur + "_cycliste_" + cycliste].rangée =
      anciennePosition.rangée;
  } else if (
    positions[nomUtilisateur + "_cycliste_" + cycliste].case >= 22 &&
    positions[nomUtilisateur + "_cycliste_" + cycliste].case <= 35 &&
    anciennePosition.rangée === "exterieur"
  ) {
    positions[nomUtilisateur + "_cycliste_" + cycliste].rangée = "exterieur";
  }

  if (anciennePosition.id == "c9_2" || anciennePosition.id == "c10_2") {
    positions[nomUtilisateur + "_cycliste_" + cycliste].rangée = "milieu";
    var sousCase = true;
  }

  // Pour ne pas dépasser le plateau de jeu
  if (positions[nomUtilisateur + "_cycliste_" + cycliste].case > 105) {
    positions[nomUtilisateur + "_cycliste_" + cycliste].case = 105;
  }

  /*-------------------------------------------------------------- */

  // Mise à jour de la section en fonction de la case
  majSections(nomUtilisateur, cycliste, rangee);

  /*---------------------------------------*/

  //Mise à jour de l'id de la case en fonction de la rangée
  //possibilités si rangee = intérieur -> toujours 0
  majId(nomUtilisateur, cycliste, sousCase);

  //On let à jour la position du joueur | utile dans le cas où le premier cycliste du premier joueur à joué une carte chance
  mettreAJourPositionsJoueur(
    nomUtilisateur,
    cycliste,
    positions[nomUtilisateur + "_cycliste_" + cycliste].section,
    positions[nomUtilisateur + "_cycliste_" + cycliste].rangée,
    positions[nomUtilisateur + "_cycliste_" + cycliste].case,
    positions[nomUtilisateur + "_cycliste_" + cycliste].id
  );

  //On vérifie si le joueur a le droit ou non au bonus d'aspiration
  if (
    anciennePosition.case <= 95 ||
    positions[nomUtilisateur + "_cycliste_" + cycliste].case <= 95
  ) {
    const verif = aspiration(nomUtilisateur, cycliste);
    if (verif === "ligne") {
      casesAAvancer2 = 1;
      positions[nomUtilisateur + "_cycliste_" + cycliste].case +=
        casesAAvancer2;
    } else if (verif === "diago") {
      console.log("aspiration diagonale");
      casesAAvancer2 = 1;
      positions[nomUtilisateur + "_cycliste_" + cycliste].case +=
        casesAAvancer2;
      if (
        positions[nomUtilisateur + "_cycliste_" + cycliste].rangée ===
        "interieur"
      ) {
        rangee = "milieu";
        if (
          positions[nomUtilisateur + "_cycliste_" + cycliste].case === 9 ||
          positions[nomUtilisateur + "_cycliste_" + cycliste].case === 63
        ) {
          rangee = "exterieur";
        }
      } else if (
        positions[nomUtilisateur + "_cycliste_" + cycliste].rangée === "milieu"
      ) {
        rangee = "intérieur";
      }
    }
    positions[nomUtilisateur + "_cycliste_" + cycliste].rangée = rangee;
  }
  //On met à jour la position

  var verifVirage = false;
  if (
    (anciennePosition.id == "c9_2" &&
      positions[nomUtilisateur + "_cycliste_" + cycliste].case === 9) ||
    (anciennePosition.id == "c10_2" &&
      positions[nomUtilisateur + "_cycliste_" + cycliste].case === 10) ||
    (anciennePosition.id == "c63_2" &&
      positions[nomUtilisateur + "_cycliste_" + cycliste].case === 63) ||
    (anciennePosition.id == "c64_2" &&
      positions[nomUtilisateur + "_cycliste_" + cycliste].case === 64)
  ) {
    sousCase = true;
    positions[nomUtilisateur + "_cycliste_" + cycliste].rangée = "milieu";
    verifVirage = true;
  }

  majSections(nomUtilisateur, cycliste, rangee);
  majId(nomUtilisateur, cycliste, sousCase);

  // Affichage des positions des cyclistes
  logCyclistes();

  // Mise à jour des positions des cyclistes dans l'objet correspondant
  mettreAJourPositionsJoueur(
    nomUtilisateur,
    cycliste,
    positions[nomUtilisateur + "_cycliste_" + cycliste].section,
    positions[nomUtilisateur + "_cycliste_" + cycliste].rangée,
    positions[nomUtilisateur + "_cycliste_" + cycliste].case,
    positions[nomUtilisateur + "_cycliste_" + cycliste].id
  );

  // Vérifier si la case d'arrivée est déjà occupée par un autre cycliste
  console.log("Dictionnaire des cyclistes :", dico_cyclistes);
  if (verifierCyclistes(dico_cyclistes) === true) {
    if (
      positions[nomUtilisateur + "_cycliste_" + cycliste].section === 5 ||
      (positions[nomUtilisateur + "_cycliste_" + cycliste].case >= 84 &&
        positions[nomUtilisateur + "_cycliste_" + cycliste].case < 95) ||
      (positions[nomUtilisateur + "_cycliste_" + cycliste].rangée === 2 &&
        positions[nomUtilisateur + "_cycliste_" + cycliste].case >= 23 &&
        positions[nomUtilisateur + "_cycliste_" + cycliste].case < 36) ||
      verifVirage === true
    ) {
      alert(
        "Déplacement impossible. La case d'arrivée est déjà occupée par un autre cycliste et on ne peut pas dépasser."
      );
      retourArrière(anciennePosition, nomUtilisateur, cycliste);
      return false;
    } else {
      rangee = "milieu";
      if (
        anciennePosition.section === 1 ||
        (anciennePosition.section === 2 &&
          anciennePosition.case >= 10 &&
          anciennePosition.rangée === "interieur") ||
        anciennePosition.section === 4 ||
        (anciennePosition.section === 5 &&
          anciennePosition.case >= 64 &&
          anciennePosition.rangée === "interieur")
      ) {
        if (
          (verifierID("c10_0") === false ||
            verifierID("c9_0") === false ||
            verifierID("c63_0") === false ||
            verifierID("c64_0") === false) &&
          !(verifierID("c9_0") === false && verifierID("c10_0") === false) &&
          !(verifierID("c63_0") === false && verifierID("c64_0") === false)
        ) {
          //Si la 9 n'est pas libre
          if (verifierID("c9_0") === false) {
            if (
              positions[nomUtilisateur + "_cycliste_" + cycliste].case === 9
            ) {
              rangee = "exterieur";
            } else if (
              positions[nomUtilisateur + "_cycliste_" + cycliste].case === 10
            ) {
              rangee = "milieu";
              sousCase = true;
            } else {
              positions[nomUtilisateur + "_cycliste_" + cycliste].case -= 1;
            }
          }
          //Si la 10 n'est pas libre
          else if (verifierID("c10_0") === false) {
            if (
              positions[nomUtilisateur + "_cycliste_" + cycliste].case === 10
            ) {
              rangee = "exterieur";
            } else if (
              positions[nomUtilisateur + "_cycliste_" + cycliste].case === 11
            ) {
              rangee = "milieu";
              sousCase = true;
            } else {
              positions[nomUtilisateur + "_cycliste_" + cycliste].case -= 1;
            }
          }

          //Si la 63 n'est pas libre
          if (verifierID("c63_0") === false) {
            if (
              positions[nomUtilisateur + "_cycliste_" + cycliste].case === 63
            ) {
              rangee = "exterieur";
            } else if (
              positions[nomUtilisateur + "_cycliste_" + cycliste].case === 64
            ) {
              rangee = "milieu";
              sousCase = true;
            } else {
              positions[nomUtilisateur + "_cycliste_" + cycliste].case -= 1;
            }
          }

          //Si la 64 n'est pas libre
          else if (verifierID("c64_0") === false) {
            if (
              positions[nomUtilisateur + "_cycliste_" + cycliste].case === 64
            ) {
              rangee = "exterieur";
            } else if (
              positions[nomUtilisateur + "_cycliste_" + cycliste].case === 65
            ) {
              rangee = "milieu";
              sousCase = true;
            } else {
              positions[nomUtilisateur + "_cycliste_" + cycliste].case -= 1;
            }
          }
        } else if (
          (verifierID("c9_0") === false && verifierID("c10_0") === false) ||
          (verifierID("c63_0") === false && verifierID("c64_0") === false)
        ) {
          if (
            positions[nomUtilisateur + "_cycliste_" + cycliste].case === 9 ||
            positions[nomUtilisateur + "_cycliste_" + cycliste].case === 11
          ) {
            rangee = "exterieur";
          } else if (
            positions[nomUtilisateur + "_cycliste_" + cycliste].case === 10 ||
            positions[nomUtilisateur + "_cycliste_" + cycliste].case === 12
          ) {
            rangee = "milieu";
            sousCase = true;
          } else {
            positions[nomUtilisateur + "_cycliste_" + cycliste].case -= 2;
          }
          if (
            positions[nomUtilisateur + "_cycliste_" + cycliste].case === 63 ||
            positions[nomUtilisateur + "_cycliste_" + cycliste].case === 65
          ) {
            rangee = "exterieur";
          } else if (
            positions[nomUtilisateur + "_cycliste_" + cycliste].case === 64 ||
            positions[nomUtilisateur + "_cycliste_" + cycliste].case === 66
          ) {
            rangee = "milieu";
            sousCase = true;
          } else {
            positions[nomUtilisateur + "_cycliste_" + cycliste].case -= 2;
          }
        }
      }

      //On met à jour la rangée
      positions[nomUtilisateur + "_cycliste_" + cycliste].rangée = rangee;
      //On met à jour l'id
      majId(nomUtilisateur, cycliste, sousCase);

      //On met à jour la position
      mettreAJourPositionsJoueur(
        nomUtilisateur,
        cycliste,
        positions[nomUtilisateur + "_cycliste_" + cycliste].section,
        positions[nomUtilisateur + "_cycliste_" + cycliste].rangée,
        positions[nomUtilisateur + "_cycliste_" + cycliste].case,
        positions[nomUtilisateur + "_cycliste_" + cycliste].id
      );

      //Si un cycliste est au milieu cela veut dire que la seule place disponibles est à droite or on ne peut pas passer de intérieur à extérieur sans avancer de 2 cases
      //On doit donc vérifier que personne n'est sur la cases en diagonale inférieure du cycliste au milieu
      if (verifierCyclistes(dico_cyclistes) == true) {
        if (
          (positions[nomUtilisateur + "_cycliste_" + cycliste].case >= 9 &&
            positions[nomUtilisateur + "_cycliste_" + cycliste].case < 19) ||
          (positions[nomUtilisateur + "_cycliste_" + cycliste].section === 3 &&
            positions[nomUtilisateur + "_cycliste_" + cycliste].case >= 23 &&
            positions[nomUtilisateur + "_cycliste_" + cycliste].case < 36) ||
          (positions[nomUtilisateur + "_cycliste_" + cycliste].case >= 36 &&
            positions[nomUtilisateur + "_cycliste_" + cycliste].case < 73) ||
          (positions[nomUtilisateur + "_cycliste_" + cycliste].case >= 76 &&
            positions[nomUtilisateur + "_cycliste_" + cycliste].case < 84)
        ) {
          alert(
            "Déplacement impossible. La case d'arrivée est déjà occupée par un autre cycliste et on ne peut pas dépasser."
          );
          retourArrière(anciennePosition, nomUtilisateur, cycliste);
          return false;
        }
        positions[nomUtilisateur + "_cycliste_" + cycliste].case -= 1;
        //Dans ce cas attention il est possible que l'on change de section
        majSections(nomUtilisateur, cycliste, rangee);
        majId(nomUtilisateur, cycliste, anciennePosition);

        //On met à jour la position
        mettreAJourPositionsJoueur(
          nomUtilisateur,
          cycliste,
          positions[nomUtilisateur + "_cycliste_" + cycliste].section,
          positions[nomUtilisateur + "_cycliste_" + cycliste].rangée,
          positions[nomUtilisateur + "_cycliste_" + cycliste].case,
          positions[nomUtilisateur + "_cycliste_" + cycliste].id
        );
        if (verifierCyclistes(dico_cyclistes) == true) {
          alert(
            "Déplacement impossible. La case d'arrivée est déjà occupée par un autre cycliste et on ne peut pas dépasser."
          );
          retourArrière(anciennePosition, nomUtilisateur, cycliste);
          return false;
        } else {
          //SI personne alors on peut avancer et changer de rangée
          rangee = "exterieur";
          positions[nomUtilisateur + "_cycliste_" + cycliste].case += 1;
          positions[nomUtilisateur + "_cycliste_" + cycliste].rangée = rangee;
          //On met à jour la section
          majSections(nomUtilisateur, cycliste, rangee);
          //On met à jour l'id
          majId(nomUtilisateur, cycliste, anciennePosition);

          //On met à jour la position
          mettreAJourPositionsJoueur(
            nomUtilisateur,
            cycliste,
            positions[nomUtilisateur + "_cycliste_" + cycliste].section,
            positions[nomUtilisateur + "_cycliste_" + cycliste].rangée,
            positions[nomUtilisateur + "_cycliste_" + cycliste].case,
            positions[nomUtilisateur + "_cycliste_" + cycliste].id
          );

          //On doit maintenant vérifier qu'il n'y a personne sur la case extérieure
          if (verifierCyclistes(dico_cyclistes) == true) {
            alert(
              "Déplacement impossible. La case d'arrivée est déjà occupée par un autre cycliste et on ne peut pas dépasser."
            );
            retourArrière(anciennePosition, nomUtilisateur, cycliste);
            return false;
          }
        }
      }
    }
  }

  const id = positions[nomUtilisateur + "_cycliste_" + cycliste].id;
  bouger_jeton(id, cycliste, nomUtilisateur);
  //Si toutes les conditions sont passées on met à jour le score
  dico_score[nomUtilisateur].secondes += casesAAvancer + casesAAvancer2;
  // On vérifie si le cycliste est sur une case chance si oui on piocherCarteChance
  if (cases_chances.includes(id)) {
    const nombreChance = piocherCarteChance();
    // on avant de nombreChance cases: il faut repasser par la foncton avancer car on peut changer de section
    if (nombreChance !== 0) {
      return avancer(nombreChance);
    } else {
      joueurSuivant();
      return afficherJoueursEtCartesHTML();
    }
  }
  // A chaque tour on vérifie si un joueur à terminé un sprint intermédiaire
  if (
    dico_score[nomUtilisateur].sprintTermine.sprint1 === false ||
    dico_score[nomUtilisateur].sprintTermine.sprint2 === false
  ) {
    sprintsIntermediaires(nomUtilisateur);
  }

  if (
    tourActuel !== 1 &&
    positions[nomUtilisateur + "_cycliste_" + cycliste].case > 95
  ) {
    //On vérifie que aucun joueur n'a terminé sinon les autres prennent 10 secondes de pénalité à chaque tour
    majClassementSecondes(nomUtilisateur, cycliste);
    // Si un joueur dépasse la ligne d'arrivée en ce tour on lui retire des secondes par rapport à sa position finale
    majClassementAprèsArrivee(nomUtilisateur, cycliste, anciennePosition);

    //Pour chaque joueur ayant terminé la course on met à jour le classsement
    nettoyerArrivee(cycliste, nomUtilisateur);
    //on vérifie si tous les courreurs du joueur ont terminé la course
    //On vérifie si tous les joueurs ont terminé la course si oui alors fin du jeu et affichage du classement
    if (cyclistesArrives.length === nomsJoueurs.length * 3) {
      return finDuJeu();
    }
    console.log("Dico score", dico_score);
  }
  joueurSuivant();
}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
function envoyerAuServeur(cyclistes, main, nomUtilisateur) {
  const IA_ROUTE = "/ia";
  const iaConnection = openWebSocket(IA_ROUTE, "iaWsMessageHandler");
  const payload = {
    board: cyclistes,
    deck: main,
    player: nomUtilisateur,
  };
  sendMessage(iaConnection, JSON.stringify(payload));
  carteAJouee = iaWsMessageHandler();
  return carteAJouee;
}

function jouer_carte(joueur, carteIndex = null) {
  // Pour récupérer les cartes du joueur
  var mainJoueur = window[joueur];
  if (carteIndex === null) {
    var element = nomsJoueurs[index];
    element = element.toLowerCase();
    let singleQuotedString = element.replace(/"/g, "'");
    envoyerAuServeur(dico_cyclistes, mainJoueurSuivant, singleQuotedString);
    if (avancer(carteAJouee) === false) {
      return;
    }
  }

  // Vérifie si l'index de la carte est valide
  if (carteIndex >= 0 && carteIndex < mainJoueur.length) {
    var carteJouee = mainJoueur[carteIndex]; // Obtenir la carte à jouer
    console.log("Carte jouée par " + joueur + " :", carteJouee);

    if (avancer(carteJouee) === false) {
      return;
    } else {
      // Si le déplacement est réussi, retirer la carte du deck du joueur
      mainJoueur.splice(carteIndex, 1);

      // Vérifie si le deck du joueur est vide
      if (mainJoueur.length === 0) {
        // Si le deck est vide, piocher 5 nouvelles cartes
        for (var i = 0; i < 5; i++) {
          RandomCarte(joueurs.indexOf(joueur));
        }
      }

      var mainJoueurSuivant = window[joueurs[index]];
      console.log("Main du joueur suivant :", mainJoueurSuivant);
      var element = null;
      if (index === 0) {
        element = nomsJoueurs.at(-1);
      } else {
        element = nomsJoueurs[index - 1];
      }
      console.log("hey" + element);
      if (element === "Belgique" || element === "Italie") {
        var sound = new Howl({
          src: ["/static/sound.mp4"], // Spécifiez le chemin vers votre fichier audio
        });
        sound.play();
      } else {
        element = element.toLowerCase();
        let singleQuotedString = element.replace(/"/g, "'");
        envoyerAuServeur(dico_cyclistes, mainJoueurSuivant, singleQuotedString);
        if (avancer(carteAJouee) === false) {
          return;
        }
      }
      afficherJoueursEtCartesHTML();
    }
  } else {
    console.log("Index de carte invalide !");
  }
}
