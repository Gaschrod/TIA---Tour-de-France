//variable de bases 
var joueurs = ['j1_carte', 'j2_carte', 'j3_carte', 'j4_carte'];
var nomsJoueurs = []; 
var tableau = [];
var joueurCourant = 0; 
var tour = 0;

// Fonction pour démarrer le jeu
function Start_the_game() {
    var selectedHumanPlayers = parseInt(document.getElementById("selectHumanPlayers").value);
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

    
    console.log("Noms des joueurs :", nomsJoueurs);

    // Initialise les decks des joueurs
    for (var i = 0; i < joueurs.length; i++) {
        window[joueurs[i]] = [];
    }

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

    // Supprime le bouton de démarrage et les deux autres bouttons de sélection
    var startButton = document.getElementById("myButton");
    if (startButton) {
        startButton.remove();
    }   
    var selectHumanPlayerstoerasebutton = document.getElementById("selectHumanPlayers");
    var selectBotstoerasebutton = document.getElementById("selectBots");
    if (selectHumanPlayerstoerasebutton) {
        selectHumanPlayerstoerasebutton.remove();
    }
    if (selectBotstoerasebutton) {
        selectBotstoerasebutton.remove();
    }
}





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

// Fonction pour afficher les joueurs et leurs cartes
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

                var jouerButton = document.createElement("button");
                jouerButton.textContent = "Jouer";
                jouerButton.setAttribute("onclick", "jouer_carte('" + joueur + "', " + j + ")");

                carteItem.appendChild(jouerButton);
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
// ---------------------------------------------------------------------




// Fonction pour jouer une carte
function jouer_carte(joueur, carteIndex) {
    // Pour récupérer les cartes du joueur
    var mainJoueur = window[joueur];

    // Vérifie si l'index de la carte est valide
    if (carteIndex >= 0 && carteIndex < mainJoueur.length) {
        var carteJouee = mainJoueur.splice(carteIndex, 1)[0]; 
        console.log("Carte jouée par " + joueur + " :", carteJouee);

        // Remet la carte jouée au bon endroit dans le tableau de cartes
        tableau.push(carteJouee);
        console.log("Carte remise dans le tableau :", carteJouee);
        console.log("Cartes restantes dans le tableau :", tableau.length);

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

// Initialisation des positions des cyclistes
const positions = {
    1: { section: 1, rangée: "milieu", case: 0 },
    2: { section: 1, rangée: "milieu", case: 0 },
    3: { section: 1, rangée: "milieu", case: 0 }
};


// Déclaration de sectionsRangées pour définir les rangées valides pour chaque section
const sectionsRangées = {
    1: ["interieur", "milieu", "exterieur"],
    2: ["interieur", "milieu"],
    3: ["interieur", "milieu", "exterieur"],
    4: ["interieur", "milieu", "exterieur"],
    5: ["milieu", "exterieur"],
    6: ["milieu"],
    7: ["milieu", "exterieur"],
    8: ["interieur", "milieu", "exterieur"],
    9: ["interieur", "milieu", "exterieur"]
};

function avancer() {
    // Récupérer les valeurs sélectionnées par l'utilisateur
    const cycliste = parseInt(document.getElementById('cycliste').value);
    const casesAAvancer = parseInt(document.getElementById('note').value);
    const rangée = document.getElementById('rangée').value;

    
    if (isNaN(casesAAvancer) || casesAAvancer <= 0) {
        alert("Veuillez saisir un nombre valide de cases à avancer.");
        return;
    }

    // ancienne position du cycliste
    const anciennePosition = {
        section: positions[cycliste].section,
        rangée: positions[cycliste].rangée,
        case: positions[cycliste].case
    };

    // Mettre à jour la position du cycliste
    positions[cycliste].rangée = rangée;
    positions[cycliste].case += casesAAvancer;

    // pour ne pas dépasser le plateau de jeu 
    if (positions[cycliste].case > 105) {
        positions[cycliste].case = 105;
    }

    // Vérifier si le cycliste atteint les limites d'une section et le déplacer dans la section suivante si nécessaire
    const sectionsLimites = [8, 18, 21, 35, 72, 75, 94, 95, 105];
    for (let i = 0; i < sectionsLimites.length; i++) {
        if (positions[cycliste].case > sectionsLimites[i]) {
            let sectionSuivante = i + 2;
            if (!sectionsRangées[sectionSuivante] || !sectionsRangées[sectionSuivante].includes(rangée)) {
                alert("La rangée sélectionnée n'existe pas dans la section suivante. Veuillez choisir une rangée valide.");
                // Rétablir la position précédente du cycliste dans la rangée ou il était
                positions[cycliste].section = anciennePosition.section;
                positions[cycliste].rangée = anciennePosition.rangée;
                positions[cycliste].case = anciennePosition.case;
                return;
            } else {
                positions[cycliste].section = sectionSuivante; 
            }
        }
    }

    // affichage dans la console des positions des cyclistes
    let positionsString = "";
    for (let i = 1; i <= 3; i++) {
        positionsString += "cycliste " + i + " : section " + positions[i].section + ", rangée " + positions[i].rangée + ", case " + positions[i].case + " || ";
    }
    console.log(positionsString);
}



