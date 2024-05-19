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


produire_reponse('fin',L1, _) :-
    L1 = 'Merci de m\'avoir consulte !'.

produire_reponse(L, Rep, Autre_Rep) :-
    regle_rep(L, Rep),
    (Rep = 0 ->
        produire_reponse_autre(L, Autre_Rep)
    ;
    Autre_Rep = 1
    ).

produire_reponse_autre(_,S1) :-
    S1 = 'Je ne sais pas, monsieur Jacquet pourrait vous aider.'.



% ----------------------------------------------------------------%

q_type(1, 'qui commence ?').
q_type(2, 'combien de coureurs par equipe ?').
q_type(3, 'Puis-je deplacer un coureur sur une case occupee par unautre coureur ?').
q_type(4, 'peut-on doubler par le bas-cote ?').
q_type(5, 'A quel moment tire-t-on les cartes ?').
q_type(6, 'Dans quel ordre jouent les équipes ?').
q_type(7, 'Que se passe-t-il si un coureur veut doubler et que la case est occupee ?').
q_type(8, 'Que font les cartes chances ?').
q_type(9, 'Comment gagner le jeu ?').
q_type(10, 'Quelles sont les règles ?').
q_type(11, 'Quelle est le but du jeu ?').
q_type(12, 'Qui es-tu ?').
q_type(13, 'Qui sont tes créateurs ?').

rep_type(1, 'C\'est au joueur ayant la plus haute carte secondes de commencer.').
rep_type(2, 'Chaque equipe compte 3 coureurs.').
rep_type(3, 'Non').
rep_type(4, 'Oui, il est permis de depasser par le bas-cote de la route pour autant que le coureur arrive sur une case non occupee. Si ce n\'est pas le cas, le coureur chute et entraine dans sa chute le groupe de coureurs qu\'il voulait depasser.').
rep_type(5, 'Au debut du jeu, les joueurs tirent 5 cartes, selon un tirage aleatoire.').
rep_type(6, 'L\'ordre suivant : equipe d\'Italie, equipe de Hollande, equipe de Belgique, equipe d\'Allemagne.').
rep_type(7, 'Vous ne pouvez pas avancer sur une case occupee').
rep_type(8, 'Les cartes chances peuvent soit faire reculer jusqu\'a 3 cases ou au contraire faire avancer.').
rep_type(9, 'Le jeu se termine lorsque tous les cyclistes ont passe la ligne d\'arrivee. L\'equipe possedant le moins de secondes gagnent le tour').
rep_type(10, 'Les regles sont simples, chaque equipe doit faire passer ses 3 coureurs la ligne d\'arrivee en le moins de secondes possibles.').
rep_type(11, 'Les regles sont simples, chaque equipe doit faire passer ses 3 coureurs la ligne d\'arrivee en le moins de secondes possibles.').
rep_type(12, 'Je suis le BDT, un bot qui vous aide a comprendre les regles du jeu.').
rep_type(13, 'Je suis le fruit du travail de 4 etudiants de l\'universite de Namur : AmphiLink, Gaschrod, C0ll4b et Cufy').

% ----------------------------------------------------------------%
% Nous allons utiliser la fonction de Levenshtein pour comparer la phrase rentrée par l'utilisateur avec chacune des questions-types

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
    q_type(9, Q9),
    q_type(10, Q10),
    q_type(11, Q11),
    q_type(12, Q12),
    q_type(13, Q13),
    rep_type(1, R1),
    rep_type(2, R2),
    rep_type(3, R3),
    rep_type(4, R4),
    rep_type(5, R5),
    rep_type(6, R6),
    rep_type(7, R7),
    rep_type(8, R8),
    rep_type(9, R9),
    rep_type(10, R10),
    rep_type(11, R11),
    rep_type(12, R12),
    rep_type(13, R13),
    %Calcul de la distance de Levenshtein
    isub(String, Q1, D1, [normalize(true),zero_to_one(true)]),
    isub(String, Q2, D2, [normalize(true),zero_to_one(true)]),
    isub(String, Q3, D3, [normalize(true),zero_to_one(true)]),
    isub(String, Q4, D4, [normalize(true),zero_to_one(true)]),
    isub(String, Q5, D5, [normalize(true),zero_to_one(true)]),
    isub(String, Q6, D6, [normalize(true),zero_to_one(true)]),
    isub(String, Q7, D7, [normalize(true),zero_to_one(true)]),
    isub(String, Q8, D8, [normalize(true),zero_to_one(true)]),
    isub(String, Q9, D9, [normalize(true),zero_to_one(true)]),
    isub(String, Q10, D10, [normalize(true),zero_to_one(true)]),
    isub(String, Q11, D11, [normalize(true),zero_to_one(true)]),
    isub(String, Q12, D12, [normalize(true),zero_to_one(true)]),
    isub(String, Q13, D13, [normalize(true),zero_to_one(true)]),
    %Trouver le plus haut degré de similarité
    max_list([D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D13], Max),
    nth1(Index, [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D13], Max), % Trouver l'indice de la valeur maximale
    (Max >= 0.55 -> % Vérifier si le degré de similarité est supérieur à 0.7
        nth1(Index, [R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13], Rep) % Récupérer la réponse associée à cet indice
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

test:-
    produire_reponse('Peut-on dépasser ?',L1),
    write(L1).