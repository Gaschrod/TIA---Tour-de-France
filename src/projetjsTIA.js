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
  
    //alert("Vous avez choisi " + selectedHumanPlayers + " joueur(s) humain(s) et " + selectedBots + " bot(s) pour la partie !");

  



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


function afficherJoueursEtCartesHTML() {
    var container = document.getElementById("joueursEtCartesContainer");
    container.innerHTML = ""; // Pour effacer le contenu précédent

    for (var i = 0; i < joueurs.length; i++) {

        var joueur = joueurs[i];
        var cartesDuJoueur = window[joueur];
        var joueurDiv = document.createElement("div");

        joueurDiv.innerHTML = "<h3>" + joueur + "</h3>";

        if (cartesDuJoueur.length > 0) {
            var cartesListe = document.createElement("ul");

            for (var j = 0; j < cartesDuJoueur.length; j++) {
                (function(joueur, carteIndex) {
                    var carte = cartesDuJoueur[carteIndex];
                    var carteTexte = "Carte " + (carteIndex + 1) + " : [" + carte[0] + ", " + carte[1] + "]";
                    var carteItem = document.createElement("li");

                    carteItem.textContent = carteTexte;
                    // Ajoutez un identifiant unique au texte de chaque carte pour la référencer lors du clic
                    carteItem.id = joueur + "_carte_texte_" + carteIndex;
                    // Ajoutez un gestionnaire d'événements de clic à chaque texte de carte
                    carteItem.addEventListener("click", function() {
                        jouer_carte(joueur, carteIndex); 
                    });
                    cartesListe.appendChild(carteItem);
                })(joueur, j);
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

function jouer_carte(joueur, carteIndex) {
    // Pour récupérer les cartes du joueur
    var mainJoueur = window[joueur];

    // Vérifier si l'index de la carte est valide
    if (carteIndex >= 0 && carteIndex < mainJoueur.length) {
        var carteJouee = mainJoueur.splice(carteIndex, 1)[0]; 
        console.log("Carte jouée par " + joueur + " :", carteJouee);

        // Remettre la carte jouée au bon endroit dans le tableau de cartes
        tableau.push(carteJouee);
        console.log("Carte remise dans le tableau :", carteJouee);
        console.log("Cartes restantes dans le tableau :", tableau.length);

        // Mettre à jour l'interface
        afficherJoueursEtCartesHTML();
    } else {
        console.log("Index de carte invalide !");
    }
}
