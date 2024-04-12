var joueurs = ['j1_carte', 'j2_carte', 'j3_carte', 'j4_carte'];
var tableau = [];
var joueurCourant = 0; 


function Start_the_game() {
    var selectedHumanPlayers = parseInt(document.getElementById("selectHumanPlayers").value);
    var selectedBots = parseInt(document.getElementById("selectBots").value);
    var totalPlayers = selectedHumanPlayers + selectedBots;
  
    if (totalPlayers > 4 || selectedHumanPlayers < 1) {
      alert("Veuillez choisir entre 1 et 2 joueurs humains, et jusqu'à 2 bots.");
      return;
    }
  
    alert("Vous avez choisi " + selectedHumanPlayers + " joueur(s) humain(s) et " + selectedBots + " bot(s) pour la partie !");

  



    for (var i = 0; i < joueurs.length; i++) {
        window[joueurs[i]] = [];
    }

    // Création du tableau de jeu
    for (var i = 1; i <= 12; i++) {
        for (var j = 1; j <= 8; j++) {
            var carte = [i, j];
            tableau.push(carte);
        }
    }

    console.log("Le jeu a démarré !");
    console.log("Jeu de cartes des secondes généré :", tableau);

    afficherJoueursEtCartesHTML(); 
}

function RandomCarte() {
    if (tableau.length === 0) {
        console.log("Plus de cartes à piocher !");
        return;
    }

    // Choisir aléatoirement une carte du tableau
    var carteIndex = Math.floor(Math.random() * tableau.length);
    var cartePiochee = tableau.splice(carteIndex, 1)[0]; 

    // Distribuer la carte au joueur courant
    window[joueurs[joueurCourant]].push(cartePiochee);

    console.log("Carte piochée par Joueur " + (joueurCourant + 1) + " :", cartePiochee);
    console.log("Cartes restantes dans le tableau :", tableau.length);
    console.log("Cartes du Joueur " + (joueurCourant + 1) + " :", window[joueurs[joueurCourant]]);

    afficherJoueursEtCartesHTML(); 

}

function Change_de_joueur() {
    var selectedHumanPlayers = parseInt(document.getElementById("selectHumanPlayers").value);
    var selectedBots = parseInt(document.getElementById("selectBots").value);
    var totalPlayers = selectedHumanPlayers + selectedBots;
    
    do {
        joueurCourant = (joueurCourant + 1) % totalPlayers;
    } while (totalPlayers == 1 && joueurs[joueurCourant].includes("bot"));

    console.log("tour du Joueur courant :", joueurCourant + 1);

    afficherJoueursEtCartesHTML(); 


}

function jouer_carte() {
    // Récupérer les cartes du joueur courant
    var mainJoueurCourant = window[joueurs[joueurCourant]];

    // Supposons que vous ayez une logique pour que le joueur sélectionne une carte de sa main
    // Ici, je suppose simplement qu'il joue la première carte de sa main
    if (mainJoueurCourant.length > 0) {
        var carteJouee = mainJoueurCourant.shift(); // Retirer la première carte de la main du joueur courant
        console.log("Carte jouée par Joueur " + (joueurCourant + 1) + " :", carteJouee);

        // Remettre la carte jouée au bon endroit dans le tableau de cartes
        tableau.push(carteJouee);
        console.log("Carte remise dans le tableau :", carteJouee);
        console.log("Cartes restantes dans le tableau :", tableau.length);
    } else {
        console.log("Le joueur n'a pas de carte à jouer !");
    }

    afficherJoueursEtCartesHTML(); 

}


function afficherJoueursEtCartesHTML() {
    var container = document.getElementById("joueursEtCartesContainer");
    container.innerHTML = ""; // Effacer le contenu précédent

    for (var i = 0; i < joueurs.length; i++) {
        var joueur = joueurs[i];
        var cartesDuJoueur = window[joueur];
        var joueurDiv = document.createElement("div");
        joueurDiv.innerHTML = "<h3>" + joueur + "</h3>";
        if (cartesDuJoueur.length > 0) {
            var cartesListe = document.createElement("ul");
            for (var j = 0; j < cartesDuJoueur.length; j++) {
                var carte = cartesDuJoueur[j];
                var carteItem = document.createElement("li");
                carteItem.textContent = "Carte " + (j + 1) + " : [" + carte[0] + ", " + carte[1] + "]";
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
