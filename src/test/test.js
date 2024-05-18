// Supposons que dico_cyclistes soit un tableau de noms de cyclistes
let dico_cyclistes = ["Alice", "Bob", "Charlie", "Dave"];

// Le nom de l'utilisateur que vous souhaitez supprimer
let nomUtilisateur = "Charlie";

// Utilisation de filter pour créer un nouveau tableau sans l'utilisateur spécifié
dico_cyclistes = dico_cyclistes.filter((joueur) => joueur !== nomUtilisateur);

console.log(dico_cyclistes); // Résultat : ["Alice", "Bob", "Dave"]
