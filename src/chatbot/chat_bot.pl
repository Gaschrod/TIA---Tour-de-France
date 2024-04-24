:- use_module(library(lists)).

/* --------------------------------------------------------------------- */
/*                                                                       */
/*        PRODUIRE_REPONSE(L_Mots,L_strings) :                           */
/*                                                                       */
/*        Input : une liste de mots L_Mots representant la question      */
/*                de l'utilisateur                                       */
/*        Output : une liste de strings donnant la                       */
/*                 reponse fournie par le bot                            */
/*                                                                       */
/*        NB Par défaut le predicat retourne dans tous les cas           */
/*            [  "Je ne sais pas.", "Les étudiants",                     */
/*               "vont m'aider, vous le verrez !" ]                      */
/*                                                                       */
/*        Je ne doute pas que ce sera le cas ! Et vous souhaite autant   */
/*        d'amusement a coder le predicat que j'ai eu a ecrire           */
/*        cet enonce et ce squelette de solution !                       */
/*                                                                       */
/* --------------------------------------------------------------------- */


produire_reponse('fin',L1) :-
    L1 = 'merci de m\'avoir consulte !', !.

produire_reponse(L, Rep) :-
    regle_rep(L, Rep),
    (Rep = 0 ->
        produire_reponse_autre(L, S1),
        writeln(S1) % Afficher le résultat dans la console pour le test
    ;
        true
    ).

produire_reponse_autre(_,S1) :-
    S1 = 'je ne sais pas, les étudiants vont m\'aider, vous le verrez'.



% ----------------------------------------------------------------%

q_type(1, 'qui commence ?').
q_type(2, 'combien de coureurs par equipe ?').
q_type(3, 'Puis-je deplacer un coureur sur une case occupee par unautre coureur ?').
q_type(4, 'peut-on doubler par le bas-cote ?').
q_type(5, 'A quel moment tire-t-on les cartes ?').
q_type(6, 'Dans quel ordre les jouent les équipes ?').
q_type(7, 'Que se passe-t-il si un coureur veut doubler et que la case est occupee ?').
q_type(8, 'Que font les cartes chances ?').

rep_type(1, 'C\'est au joueur ayant la plus haute carte secondes de commencer.').
rep_type(2, 'Chaque equipe compte x coureurs.').
rep_type(3, 'Non').
rep_type(4, 'Oui, il est permis de depasser par le bas-cote de la route pour autant que le coureur arrive sur une case non occupee. Si ce n\'est pas le cas, le coureur chute et entraine dans sa chute le groupe de coureurs qu\'il voulait depasser.').
rep_type(5, 'Au d\'ebut du jeu, les joueurs tirent 5 cartes, selon un tirage aleatoire.').
rep_type(6, 'L\'ordre suivant : equipe d\'Italie, equipe de Hollande, equipe de Belgique, equipe d\'Allemagne.').
rep_type(7, 'Tirez un nouveau lot de 5 cartes').
rep_type(8, 'Les cartes chances peuvent soit faire reculer jusqu\'a 3 cases ou au contraire faire avancer.').

% ----------------------------------------------------------------%
%Nous allons utiliser la fonction de Levenshtein pour comparer la phrase rentrée par l'utilisateur avec chacune des questions-types

regle_rep(String, Rep):-
    %Initialisation des variables
    q_type(1, Q1),
    q_type(2, Q2),
    q_type(3, Q3),
    q_type(4, Q4),
    q_type(5, Q5),
    q_type(6, Q6),
    q_type(7, Q7),
    q_type(8, Q8),
    rep_type(1, R1),
    rep_type(2, R2),
    rep_type(3, R3),
    rep_type(4, R4),
    rep_type(5, R5),
    rep_type(6, R6),
    rep_type(7, R7),
    rep_type(8, R8),
    %Calcul de la distance de Levenshtein
    isub(String, Q1, D1, [normalize(true),zero_to_one(true)]),
    isub(String, Q2, D2, [normalize(true),zero_to_one(true)]),
    isub(String, Q3, D3, [normalize(true),zero_to_one(true)]),
    isub(String, Q4, D4, [normalize(true),zero_to_one(true)]),
    isub(String, Q5, D5, [normalize(true),zero_to_one(true)]),
    isub(String, Q6, D6, [normalize(true),zero_to_one(true)]),
    isub(String, Q7, D7, [normalize(true),zero_to_one(true)]),
    isub(String, Q8, D8, [normalize(true),zero_to_one(true)]),
    %Trouver le plus haut degré de similarité
    max_list([D1, D2, D3, D4, D5, D6, D7, D8], Max),
    nth1(Index, [D1, D2, D3, D4, D5, D6, D7, D8], Max), % Trouver l'indice de la valeur maximale
    (Max >= 0.7 -> % Vérifier si le degré de similarité est supérieur à 0.7
        nth1(Index, [R1, R2, R3, R4, R5, R6, R7, R8], Rep) % Récupérer la réponse associée à cet indice
    ; % Sinon
        Rep = 0 % Unifier Rep avec 0
    ).
    
    

/* --------------------------------------------------------------------- */
/*                                                                       */
/*          CONVERSION D'UNE QUESTION DE L'UTILISATEUR EN                */
/*                        STRING                                         */
/*                                                                       */
/* --------------------------------------------------------------------- */

% lire_question(L_Mots)

% Pour tau-Prolog avec Javascript
lire_question(String) :- read_text_and_convert_to_string(String).

% Pour bot en ligne

/*****************************************************************************/
% read_text_from_console(-Chars)
%  Reads a line of input from the console and returns it as a list of ASCII codes.

read_text_from_console(Chars) :-
    read_text_from_console([], Chars).

read_text_from_console(SoFar, Chars) :-
    get0(CharCode),
    (CharCode =:= 10 ->
        Chars = SoFar
    ;
        append(SoFar, [CharCode], UpdatedList),
        read_text_from_console(UpdatedList, Chars)
    ).


/*****************************************************************************/
%read_text_from_console(-String)
%  Reads a line of input from the console and returns it as a string.

read_text_and_convert_to_string(String) :-
    read_text_from_console(Chars),
    atom_codes(String, Chars).



/* --------------------------------------------------------------------- */
/*                                                                       */
/*        PRODUIRE_REPONSE : écrit la réponse type                       */
/*                                                                       */
/* --------------------------------------------------------------------- */

transformer_reponse_en_string(Li,Lo) :- flatten_strings_in_sentences(Li,Lo).

flatten_strings_in_sentences([],[]).
flatten_strings_in_sentences([W|T],S) :-
    string_as_list(W,L1),
    flatten_strings_in_sentences(T,L2),
    append(L1,L2,S).

% Pour SWI-Prolog
string_as_list(W,L) :- string_to_list(W,L).

/* --------------------------------------------------------------------- */
/*                                                                       */
/*                            TEST DE FIN                                */
/*                                                                       */
/* --------------------------------------------------------------------- */

fin(L) :- L = 'fin'.


/* --------------------------------------------------------------------- */
/*                                                                       */
/*                         BOUCLE PRINCIPALE                             */
/*                                                                       */
/* --------------------------------------------------------------------- */

botDuTour :- 

   nl, nl, nl,
   write('Bonjour, je suis le bot du Tour, BDT, pour les intimes,'), nl,
   write('conseiller sur le Tour de France. En quoi puis-je vous etre utile ?'), 
   nl, nl, 

   repeat,
      write('Vous : '), ttyflush,
      lire_question(String),
      produire_reponse(String,Rep),
      write(Rep), nl,
   fin(String), !.
   

/* --------------------------------------------------------------------- */
/*                                                                       */
/*             ACTIVATION DU PROGRAMME APRES COMPILATION                 */
/*                                                                       */
/* --------------------------------------------------------------------- */

:- botDuTour.