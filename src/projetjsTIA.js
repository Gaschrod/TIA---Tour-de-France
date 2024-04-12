var joueurs = ['j1_carte', 'j2_carte', 'j3_carte', 'j4_carte'];
var tableau = [];
var joueurCourant = 0; 

function Start_the_game() {
    
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


}

function Change_de_joueur() {
    
    joueurCourant = (joueurCourant + 1) % joueurs.length;
    console.log("tour du Joueur courant :", joueurCourant + 1 ); 
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
}

