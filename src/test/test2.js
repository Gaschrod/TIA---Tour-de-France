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
