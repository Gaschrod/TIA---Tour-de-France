%% Theory: 
%% - Type of information = perfect (we know everything about the game, the cards of each player are known) 
%% - Nature of the game: stochastic (depends on the cards that we get)

%% Number of players: 4, 2 humans and 2 bots 

%% Goal of each player: have the team with the total time the lowest (sum of the time of each runner)

%% Bots: Team "Hollande" and team "Allemagne"

%% Order of team playing: Italie (human), Hollande (bot), Belgique (human), Allemagne (bot)

%% Each team decide wich runner to play (no obligation)

%% Rule of displacement: up, left/right (if there is an available path, and only one 'hop' is allowed)

%% Aspiration: if a runner is behind an other one or inside the peloton, he can move one step forward each time ONLY if he stays 
%% behind/next to another runner (in addition to the normal displacement) => not mandatory!

%% Warning: it's impossible to move a runner to a position where there is another runner (even if it doesn't stays there)
%% In case of fall => lose one card and pass the turn
%% Concerned: all players that can't stop before the area of the fall ; players that are near the case

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%% S = all possible configurations of the game

%% P = players

%% I = initial state

%% SxP -> Act = actions
%% SxA -> S = transition function
%% SxP -> R = utility function

%% Solution: for each player, a strategy = S -> A 

%% Game tree: tree induce by initial state, players and transition functions (OXO = 3^9, chess = 10^40)

%% Minimax algorithm: MAX choose the branch wich maximize the utility, MIN choose the branch wich minimize the utility

%% Alpha-beta pruning: avoid to explore the whole tree => when we find a branch that has a 'better' value than the current one, we stop the exploration of the current branch