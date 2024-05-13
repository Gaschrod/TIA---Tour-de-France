//variable de bases
var joueurs = ["j1_carte", "j2_carte", "j3_carte", "j4_carte"];
var nomsJoueurs = [];
var tableau = [];
var tourActuel = 1;
var index = 0;
var cyclistesJouesDansTour = 0;
dico_score = {};

// Tableau pour stocker les identifiants de case
var Tableau_id_case = [];

var Joueur1Pion = {};
var Joueur2Pion = {};
var Joueur3Pion = {};
var Joueur4Pion = {};

var dico_cyclistes = [Joueur1Pion, Joueur2Pion, Joueur3Pion, Joueur4Pion];

// Initialisation des positions des cyclistes
const positions = {
  1: { section: 1, rangée: "milieu", case: 0, id: "case_départ" },
  2: { section: 1, rangée: "milieu", case: 0, id: "case_départ" },
  3: { section: 1, rangée: "milieu", case: 0, id: "case_départ" },
};

const sectionsRangées = {
  1: ["interieur", "milieu", "exterieur"],
  2: ["interieur", "milieu"],
  3: ["interieur", "milieu", "exterieur"],
  4: ["interieur", "milieu"],
  5: ["interieur"],
  6: ["interieur", "milieu"],
  7: ["interieur", "milieu", "exterieur"],
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
    var nom = prompt("Nom du Joueur " + i + " :");
    if (nom === null || nom === "") {
      alert("Veuillez entrer un nom pour tous les utilisateurs.");
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
    dico_score[nomsJoueurs[i]] = 0;
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
    for (var j = 1; j <= 8; j++) {
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

  // Affiche les decks de chaque joueur une seule fois après la distribution des cartes
  for (var i = 0; i < joueurs.length; i++) {
    console.log("Le deck de " + nomsJoueurs[i] + " est :", window[joueurs[i]]);
  }

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

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

// Fonction pour piocher une carte aléatoire
function RandomCarte(playerIndex) {
  // Vérifie si le tableau de cartes est vide
  if (tableau.length === 0) {
    console.log("Plus de cartes à piocher, mince alors !");
    return;
  }

  // Choisis aléatoirement une carte du tableau
  var carteIndex = Math.floor(Math.random() * tableau.length);
  var cartePiochee = tableau.splice(carteIndex, 1)[0];

  // Distribue la carte au joueur correspondant
  window[joueurs[playerIndex]].push(cartePiochee);

  afficherJoueursEtCartesHTML();
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

          carteItem.appendChild(jouerButton);
        }
        cartesListe.appendChild(carteItem);
      }
      joueurDiv.appendChild(cartesListe);
    } else {
      var pasDeCartes = document.createElement("p");
      pasDeCartes.textContent = "Pas de cartes";
      joueurDiv.appendChild(pasDeCartes);
    }
    container.appendChild(joueurDiv);
  }
}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// --------------------------------------------------------------------

//Fonction pour jouer une carte chance
function piocherCarteChance() {
  var nombre = Math.floor(Math.random() * 7) - 3;
  alert("Carte chance piochée :" + nombre);
  if (nombre === 0) {
    joueurSuivant();
  } else {
    avancer(nombre);
  }
  afficherJoueursEtCartesHTML();
}
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// --------------------------------------------------------------------

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

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

//Fonction pour vérifier si deux cyclistes ont le même ID parmis tous les cyclistes
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

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

// Fonction pour jouer une carte !!!!!
function avancer(carteJouee) {
  // Récupérer les valeurs sélectionnées par l'utilisateur
  const nomUtilisateur = nomsJoueurs[index];
  const rangée = document.getElementById("rangee").value;
  var casesAAvancer = null;

  if (tourActuel === 1) {
    cycliste = choisirCycliste();
  } else {
    var cycliste = document.getElementById("cycliste").value;
  }
  console.log("voici l'info sur le cycliste  :", cycliste);

  // Utiliser la valeur de la carte jouée comme nombre de cases à avancer
  if (Array.isArray(carteJouee)) {
    casesAAvancer = carteJouee[0]; // Utiliser la valeur de la carte jouée
  } else {
    casesAAvancer = carteJouee; // Utiliser la valeur de la carte jouée
  }

  // Vérifier si le nom d'utilisateur est valide et correspond à un joueur existant
  const joueurIndex = nomsJoueurs.indexOf(nomUtilisateur);
  if (joueurIndex === -1) {
    alert("Nom d'utilisateur invalide ou non reconnu !");
    return;
  }

  // Ancienne position du cycliste
  const anciennePosition = {
    section: positions[nomUtilisateur + "_cycliste_" + cycliste].section,
    rangée: positions[nomUtilisateur + "_cycliste_" + cycliste].rangée,
    case: positions[nomUtilisateur + "_cycliste_" + cycliste].case,
    id: positions[nomUtilisateur + "_cycliste_" + cycliste].id,
  };

  // Vérifier si le déplacement du cycliste est valide en fonction de la rangée et de la section
  // Pas besoin de vérifier dans le cas où la section contient moins de 2 bandes de circulation
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

  // Mettre à jour la position du cycliste en ajoutant le nombre de cases à avancer
  positions[nomUtilisateur + "_cycliste_" + cycliste].rangée = rangée;
  positions[nomUtilisateur + "_cycliste_" + cycliste].case += casesAAvancer;

  // Pour ne pas dépasser le plateau de jeu
  if (positions[nomUtilisateur + "_cycliste_" + cycliste].case > 105) {
    positions[nomUtilisateur + "_cycliste_" + cycliste].case = 105;
  }

  /*-------------------------------------------------------------- */

  // Mise à jour de la section en fonction de la case
  const sectionsLimites = [8, 18, 35, 72, 75, 95];
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
        if (positions[nomUtilisateur + "_cycliste_" + cycliste].section === 5) {
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

  /*---------------------------------------*/

  //Mise à jour de l'id de la case en fonction de la rangée
  //possibilités si rangee = intérieur -> toujours 0
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
    var backtrack = 0;
    //Dans le cas où on se trouve avant une case_virage d'indice 2
    if (positions[nomUtilisateur + "_cycliste_" + cycliste].case === 9) {
      positions[nomUtilisateur + "_cycliste_" + cycliste].id = "c9_2";
    } else if (
      positions[nomUtilisateur + "_cycliste_" + cycliste].case === 10
    ) {
      positions[nomUtilisateur + "_cycliste_" + cycliste].id = "c9_1";
      backtrack = 1;
    } else if (
      positions[nomUtilisateur + "_cycliste_" + cycliste].case === 11
    ) {
      positions[nomUtilisateur + "_cycliste_" + cycliste].id = "c10_2";
      backtrack = 1;
    } else if (
      positions[nomUtilisateur + "_cycliste_" + cycliste].case === 12
    ) {
      positions[nomUtilisateur + "_cycliste_" + cycliste].id = "c10_1";
      backtrack = 2;
    } else if (
      positions[nomUtilisateur + "_cycliste_" + cycliste].case === 63
    ) {
      positions[nomUtilisateur + "_cycliste_" + cycliste].id = "c63_2";
    } else if (
      positions[nomUtilisateur + "_cycliste_" + cycliste].case === 64
    ) {
      positions[nomUtilisateur + "_cycliste_" + cycliste].id = "c63_1";
      backtrack = 1;
    } else if (
      positions[nomUtilisateur + "_cycliste_" + cycliste].case === 65
    ) {
      positions[nomUtilisateur + "_cycliste_" + cycliste].id = "64_2";
      backtrack = 1;
    } else if (
      positions[nomUtilisateur + "_cycliste_" + cycliste].case === 66
    ) {
      positions[nomUtilisateur + "_cycliste_" + cycliste].id = "64_1";
      backtrack = 2;
    }
  }
  //Si rangée = extérieur -> 2
  else {
    var ext = "_2";
  }

  //On effectue le backtracking sur la case si besoin pour le pas décaler le compteur
  if (backtrack > 0) {
    positions[nomUtilisateur + "_cycliste_" + cycliste].case -= backtrack;
  }
  /*-------------------------------------------------------------- */
  // Mise à jour l'identifiant de la case seulement si il n'a pas déjà été changé par la précédente condition
  if (
    positions[nomUtilisateur + "_cycliste_" + cycliste].id ===
    anciennePosition.id
  ) {
    positions[nomUtilisateur + "_cycliste_" + cycliste].id =
      "c" + positions[nomUtilisateur + "_cycliste_" + cycliste].case + ext;
  }

  // Affichage des positions des cyclistes
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
  if (verifierCyclistes(dico_cyclistes) == true) {
    alert(
      "Déplacement impossible. La case d'arrivée est déjà occupée par un autre cycliste."
    );
    // Annuler le déplacement en ramenant le joueur à sa position précédente
    positions[nomUtilisateur + "_cycliste_" + cycliste].rangée =
      anciennePosition.rangée;
    positions[nomUtilisateur + "_cycliste_" + cycliste].case =
      anciennePosition.case;
    positions[nomUtilisateur + "_cycliste_" + cycliste].id =
      anciennePosition.id;
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
    return false;
  }
  const id = positions[nomUtilisateur + "_cycliste_" + cycliste].id;
  bouger_jeton(id, cycliste, nomUtilisateur);
  dico_score[nomUtilisateur] += casesAAvancer;
  console.log(dico_score);
  joueurSuivant();
}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

function jouer_carte(joueur, carteIndex) {
  // Pour récupérer les cartes du joueur
  var mainJoueur = window[joueur];

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

      // Mettre à jour l'interface
      afficherJoueursEtCartesHTML();
    }
  } else {
    console.log("Index de carte invalide !");
  }
}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

function montrerElementSuivant() {}
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

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

  // Identifiez la balise g correspondant à la case où se trouve le joueur
  const g = svgDoc.getElementById("" + id);
  const matrix = g.transform.baseVal.consolidate()?.matrix;
  if (matrix == null) return;
  const bbox = g.getBBox();

  //On place le jeton du joueur au centre de la case
  const midX = bbox.x + bbox.width / 2;
  const midY = bbox.y + bbox.height / 2;
  const x = matrix?.a * midX + matrix?.c * midY + matrix.e;
  const y = matrix?.b * midX + matrix?.d * midY + matrix.f;

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

console.log("Positions mises à jour de", nomJoueur, ":", joueurPion); // Ajout du nom du joueur ici
// Récupérez l'objet SVG

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
