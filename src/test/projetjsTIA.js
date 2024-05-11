//variable de bases
var joueurs = ["j1_carte", "j2_carte", "j3_carte", "j4_carte"];
var nomsJoueurs = [];
var tableau = [];
var tourActuel = 1;
var index = 0;
var cyclistesJouesDansTour = 0;


var Joueur1Piont = {};
var Joueur2Piont = {};
var Joueur3Piont = {};
var Joueur4Piont = {};

// Initialisation des positions des cyclistes
const positions = {
  1: { section: 1, rangée: "milieu", case: 0 },
  2: { section: 1, rangée: "milieu", case: 0 },
  3: { section: 1, rangée: "milieu", case: 0 },
};

const sectionsRangées = {
  1: ["interieur", "milieu", "exterieur"],
  2: ["interieur", "milieu"],
  3: ["interieur", "milieu", "exterieur"],
  4: ["interieur", "milieu", "exterieur"],
  5: ["milieu", "exterieur"],
  6: ["milieu"],
  7: ["milieu", "exterieur"],
  8: ["interieur", "milieu", "exterieur"],
  9: ["interieur", "milieu", "exterieur"],
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
  }

  // Génère les noms des bots
  for (var i = 1; i <= selectedBots; i++) {
    nomsJoueurs.push("Bot " + i);
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
      };
      positionsString +=
        " cycliste " + j + " : section 1, rangée milieu, case 0 ||";
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
    if(tourActuel === 1){
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
        // Passe au joueur suivant
        index++;

        // Si on a dépassé la fin du tableau, revenir au début
        if (index >= nomsJoueurs.length) {
        index = 0;
        }
        alert("C'est au tour de " + nomsJoueurs[index] + " de jouer !");
        }
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

  for (var i = 0; i < joueurs.length; i++) {
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
// ---------------------------------------------------------------------

// Fonction pour jouer une carte !!!!!
function avancer(carteJouee) {
  // Récupérer les valeurs sélectionnées par l'utilisateur
  const nomUtilisateur = nomsJoueurs[index];
  const cycliste = parseInt(document.getElementById("cycliste").value);
  console.log("voici l'info sur la const  :", cycliste);
  const rangée = document.getElementById("rangée").value;
  var casesAAvancer = null;

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
  };

  // Vérifier si le déplacement du cycliste est valide en fonction de la rangée
  if (
    (anciennePosition.rangée === "interieur" && rangée === "exterieur") ||
    (anciennePosition.rangée === "exterieur" && rangée === "interieur")
  ) {
    alert(
      "Déplacement impossible. Veuillez d'abord passer par la rangée du milieu."
    );
    return;
  }

  // Vérifier si la case d'arrivée est déjà occupée par un autre cycliste
  for (let joueur in positions) {
    if (
      joueur !== nomUtilisateur &&
      positions[joueur].section === anciennePosition.section &&
      positions[joueur].rangée === rangée &&
      positions[joueur].case === anciennePosition.case + casesAAvancer
    ) {
      alert(
        "Déplacement impossible. La case d'arrivée est déjà occupée par un autre cycliste."
      );
      return;
    }
  }

  // Mettre à jour la position du cycliste en ajoutant le nombre de cases à avancer
  positions[nomUtilisateur + "_cycliste_" + cycliste].rangée = rangée;
  positions[nomUtilisateur + "_cycliste_" + cycliste].case += casesAAvancer;

  // Pour ne pas dépasser le plateau de jeu
  if (positions[nomUtilisateur + "_cycliste_" + cycliste].case > 105) {
    positions[nomUtilisateur + "_cycliste_" + cycliste].case = 105;
  }

  // Vérifier si le cycliste atteint les limites d'une section et le déplacer dans la section suivante si nécessaire
  const sectionsLimites = [8, 18, 21, 35, 72, 75, 94, 95, 105];
  for (let i = 0; i < sectionsLimites.length; i++) {
    if (
      positions[nomUtilisateur + "_cycliste_" + cycliste].case >
      sectionsLimites[i]
    ) {
      let sectionSuivante = i + 2;
      if (
        !sectionsRangées[sectionSuivante] ||
        !sectionsRangées[sectionSuivante].includes(rangée)
      ) {
        alert(
          "La rangée sélectionnée n'existe pas dans la section suivante. Veuillez choisir une rangée valide."
        );
        // Rétablir la position précédente du cycliste
        positions[nomUtilisateur + "_cycliste_" + cycliste].section =
          anciennePosition.section;
        positions[nomUtilisateur + "_cycliste_" + cycliste].rangée =
          anciennePosition.rangée;
        positions[nomUtilisateur + "_cycliste_" + cycliste].case =
          anciennePosition.case;
        return;
      } else {
        positions[nomUtilisateur + "_cycliste_" + cycliste].section =
          sectionSuivante;
      }
    }
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
        " || ";
    }
  }
  console.log(positionsString);
  // Mise à jour des positions des cyclistes dans l'objet correspondant
  mettreAJourPositionsJoueur(
    nomUtilisateur,
    cycliste,
    positions[nomUtilisateur + "_cycliste_" + cycliste].section,
    positions[nomUtilisateur + "_cycliste_" + cycliste].rangée,
    positions[nomUtilisateur + "_cycliste_" + cycliste].case
  );

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

    // Appeler la fonction avancer avec la carte jouée et le joueur
    try {
      avancer(carteJouee, joueur);
    } catch (error) {
      console.log(
        "Une alerte est survenue lors de l'avancement du cycliste :",
        error
      );
      // Ne pas retirer la carte du deck ici, car le déplacement a échoué
      return; // Sortir de la fonction pour annuler le coup
    }

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
  } else {
    console.log("Index de carte invalide !");
  }
}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

// Tableau d'exemple
var idpourcycliste = [1, 2, 3]; // Tableau des identifiants des cyclistes

function montrerElementSuivant() {
  // Récupérer l'indice de l'élément actuel
  var indice = index + 1;

  // Afficher l'élément avec son indice
  console.log(nomsJoueurs[index] + " est en indice " + indice);

  // Boucle à travers chaque joueur
  for (var i = 0; i < nomsJoueurs.length; i++) {
    var joueur = nomsJoueurs[i];
    // Afficher le joueur
    var message = joueur + " possède ";

    // Afficher chaque cycliste pour ce joueur
    for (var j = 0; j < idpourcycliste.length; j++) {
      message += "cycliste " + idpourcycliste[j];
      // Si ce n'est pas le dernier cycliste, ajouter "et"
      if (j < idpourcycliste.length - 1) {
        message += " et ";
      }
    }
    console.log(message);
    
  }
  // Passage à l'élément suivant
  index++;

  // Si on a dépassé la fin du tableau, revenir au début
  if (index >= nomsJoueurs.length) {
    index = 0;
  }
  
}
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

function mettreAJourPositionsJoueur(
  nomJoueur,
  cycliste,
  section,
  rangee,
  casePosition
) {
  var joueurPiont;
  switch (nomJoueur) {
    case nomsJoueurs[0]:
      joueurPiont = Joueur1Piont;
      break;
    case nomsJoueurs[1]:
      joueurPiont = Joueur2Piont;
      break;
    case nomsJoueurs[2]:
      joueurPiont = Joueur3Piont;
      break;
    case nomsJoueurs[3]:
      joueurPiont = Joueur4Piont;
      break;
    default:
      console.log("Nom de joueur non reconnu :", nomJoueur);
      return;
  }
  /* console.log("Objet joueurPiont de", nomJoueur, ":", joueurPiont); // Ajout du nom du joueur ici*/

  joueurPiont["cycliste " + cycliste] = {
    section: section,
    rangée: rangee,
    case: casePosition,
  };
  console.log("Positions mises à jour de", nomJoueur, ":", joueurPiont); // Ajout du nom du joueur ici
}



// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

