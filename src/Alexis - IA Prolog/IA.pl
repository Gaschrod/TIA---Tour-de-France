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

:- dynamic(board/2).

%% Players definition, each has an empty pack of cards at the beginning of the game %%

:- dynamic(player/2).

initialize_players :-
    retractall(player(_,_)), 
    assertz(player(italie, [])),
    assertz(player(hollande, [])), 
    assertz(player(belgique, [])),
    assertz(player(allemagne, [])).

runners(i1,i2,i3,
        h1,h2,h3,
        b1,b2,b3,
        a1,a2,a3).

% Initialize the game %%

initialize_board :-
    retractall(board(_,_)),
    assertz(board(1, [case(a,empty), case(b, empty), case(c, empty)])),
    assertz(board(2, [case(a,empty), case(b, empty), case(c, empty)])),
    assertz(board(3, [case(a,empty), case(b, empty), case(c, empty)])),
    assertz(board(4, [case(a,empty), case(b, empty), case(c, empty)])),
    assertz(board(5, [case(a,empty), case(b, empty), case(c, empty)])),
    assertz(board(6, [case(a,empty), case(b, empty), case(c, empty)])),
    assertz(board(7, [case(a,empty), case(b, empty), case(c, empty)])),
    assertz(board(8, [case(a,empty), case(b, empty), case(c, empty)])),
    
    % Road reduced to 2 cases
    %% Technically, there is only 2 lines (9 and 10), but for now those are renamed to 9,10,11 and 12
    assertz(board(9, [case(a,empty), case(b, empty)])), % 9 and 10 have the same 'a' case
    assertz(board(10, [case(a,empty), case(b, empty)])),


    assertz(board(11, [case(a, empty), case(b,empty)])), % 11 and 12 have the same 'a' case
    assertz(board(12, [case(a, empty), case(b,empty)])),

    % End of the 'shift'
    assertz(board(13, [case(a,empty),case(b,empty)])),
    assertz(board(14, [case(a,empty),case(b,empty)])).
    %%assertz(board(15, [case(a,empty),case(b,empty)])),
    %%assertz(board(16, [case(a,empty),case(b,empty)])),
    %%assertz(board(17, [case(a,empty),case(b,empty)])),
    %%assertz(board(18, [case(a,empty),case(b,empty)])),
    %%assertz(board(19, [case(a,empty),case(b,empty)])),
    %%assertz(board(20, [case(a,empty),case(b,empty)])).
%%
    %%%%% Back to 3 cases
    %%assertz(board(21, [case(a,empty), case(b, empty), case(c, empty)])),
    %%assertz(board(22, [case(a,empty), case(b, empty), case(c, empty)])),
    %%assertz(board(23, [case(a,empty), case(b, empty), case(c, empty)])),
%%
    %%%%% 2 cases, begin of 'sprint'
    %%assertz(board(24, [case(a,empty), case(b, empty)])),
    %%assertz(board(25, [case(a,empty), case(b, empty)])),
    %%assertz(board(26, [case(a,empty), case(b, empty)])),
    %%assertz(board(27, [case(a,empty), case(b, empty)])),
    %%assertz(board(28, [case(a,empty), case(b, empty)])),
    %%assertz(board(29, [case(a,empty), case(b, empty)])),
    %%assertz(board(30, [case(a,empty), case(b, empty)])),
    %%assertz(board(31, [case(a,empty), case(b, empty)])),
    %%assertz(board(32, [case(a,empty), case(b, empty)])),    
    %%assertz(board(33, [case(a,empty), case(b, empty)])),
    %%assertz(board(34, [case(a,empty), case(b, empty)])),
    %%assertz(board(35, [case(a,empty), case(b, empty)])).
    %%assertz(board(36, [case(a,empty), case(b, empty)])),
    %%assertz(board(37, [case(a,empty), case(b, empty)])),
%%
    %%%%% End of the 'sprint'
    %%assertz(board(38, [case(a,empty), case(b, empty)])),
    %%assertz(board(39, [case(a,empty), case(b, empty)])),
    %%assertz(board(40, [case(a,empty), case(b, empty)])),
    %%assertz(board(41, [case(a,empty), case(b, empty)])),
    %%assertz(board(42, [case(a,empty), case(b, empty)])),
    %%assertz(board(43, [case(a,empty), case(b, empty)])),
    %%assertz(board(44, [case(a,empty), case(b, empty)])),
    %%assertz(board(45, [case(a,empty), case(b, empty)])),
    %%assertz(board(46, [case(a,empty), case(b, empty)])),
    %%assertz(board(47, [case(a,empty), case(b, empty)])),
    %%assertz(board(48, [case(a,empty), case(b, empty)])),
    %%assertz(board(49, [case(a,empty), case(b, empty)])),
    %%assertz(board(50, [case(a,empty), case(b, empty)])),
    %%assertz(board(51, [case(a,empty), case(b, empty)])),
    %%assertz(board(52, [case(a,empty), case(b, empty)])),
    %%assertz(board(53, [case(a,empty), case(b, empty)])),
    %%assertz(board(54, [case(a,empty), case(b, empty)])),
    %%assertz(board(55, [case(a,empty), case(b, empty)])),
    %%assertz(board(56, [case(a,empty), case(b, empty)])),
    %%assertz(board(57, [case(a,empty), case(b, empty)])),
    %%assertz(board(58, [case(a,empty), case(b, empty)])),
    %%assertz(board(59, [case(a,empty), case(b, empty)])),
    %%assertz(board(60, [case(a,empty), case(b, empty)])),
    %%assertz(board(61, [case(a,empty), case(b, empty)])),
    %%assertz(board(62, [case(a,empty), case(b, empty)])),
    %%assertz(board(63, [case(a,empty), case(b, empty)])),
    %%assertz(board(64, [case(a,empty), case(b, empty)])),
%%
    %%%%% Begin of the 'shift'
    %%
    %%assertz(board(65, [case(a,empty), case(b, empty)])), % 65 and 66 have the same 'a' case -> 63A
    %%assertz(board(66, [case(a,empty), case(b, empty)])),

    %%assertz(board(67, [case(a,empty), case(b, empty)])), %% 67 and 68 have the same 'a' case -> 64A
    %%assertz(board(68, [case(a,empty), case(b, empty)])),
%%
    %%%%% End of the 'shift'
    %%assertz(board(69, [case(a,empty), case(b, empty)])),
    %%assertz(board(70, [case(a,empty), case(b, empty)])),
    %%assertz(board(71, [case(a,empty), case(b, empty)])),
    %%assertz(board(72, [case(a,empty), case(b, empty)])),
    %%assertz(board(73, [case(a,empty), case(b, empty)])),
    %%assertz(board(74, [case(a,empty), case(b, empty)])),
    %%assertz(board(75, [case(a,empty), case(b, empty)])),
    %%assertz(board(76, [case(a,empty), case(b, empty)])),
%%
    %%%%% Road reduced to 1 case
    %%assertz(board(77, [case(a,empty), case(b, empty)])),
    %%assertz(board(78, [case(a,empty), case(b, empty)])),
    %%assertz(board(79, [case(a,empty), case(b, empty)])),
%%
    %%%%% Back to 2 cases
    %%assertz(board(80, [case(a,empty), case(b, empty)])),
    %%assertz(board(81, [case(a,empty), case(b, empty)])),
    %%assertz(board(82, [case(a,empty), case(b, empty)])),
    %%assertz(board(83, [case(a,empty), case(b, empty)])),
    %%assertz(board(84, [case(a,empty), case(b, empty)])),
    %%assertz(board(85, [case(a,empty), case(b, empty)])),
    %%assertz(board(86, [case(a,empty), case(b, empty)])),
    %%assertz(board(87, [case(a,empty), case(b, empty)])),
%%
    %%%%% Still to 2 cases, but they are on separate 'road' -> for now, only implemented as on line on the left
    %%assertz(board(88, [case(a,empty)])),
    %%assertz(board(89, [case(a,empty)])),
    %%assertz(board(90, [case(a,empty)])),
    %%assertz(board(91, [case(a,empty)])),
    %%assertz(board(92, [case(a,empty)])),
%%
    %%%%% Begin of the 'shift' -> for now, only implemented as 'normal' lines
    %%assertz(board(93, [case(a,empty), case(b, empty)])), % 93 and 94 have the same 'a' case -> 89A
    %%assertz(board(94, [case(a,empty), case(b, empty)])),    

    %%assertz(board(95, [case(a,empty), case(b, empty)])), % 95 and 96 have the same 'a' case -> 90A
    %%assertz(board(96, [case(a,empty), case(b, empty)])),
%%
    %%%%% End of the 'shift'
    %%assertz(board(97, [case(a,empty)])),
    %%assertz(board(98, [case(a,empty)])),
    %%assertz(board(99, [case(a,empty)])),
    %%assertz(board(100, [case(a,empty)])),
    %%
    %%%%% Back to 3 cases
    %%assertz(board(101, [case(a,empty), case(b, empty), case(c, empty)])),
%%
    %%%%% Arrival
    %%assertz(board(102, [case(a,empty), case(b, empty), case(c, empty)])), % 0
    %%assertz(board(103, [case(a,empty), case(b, empty), case(c, empty)])), % -1
    %%assertz(board(104, [case(a,empty), case(b, empty), case(c, empty)])), % -2
    %%assertz(board(105, [case(a,empty), case(b, empty), case(c, empty)])), % -3 
    %%assertz(board(106, [case(a,empty), case(b, empty), case(c, empty)])), % -4
    %%assertz(board(107, [case(a,empty), case(b, empty), case(c, empty)])), % -5
    %%assertz(board(108, [case(a,empty), case(b, empty), case(c, empty)])), % -6
    %%assertz(board(109, [case(a,empty), case(b, empty), case(c, empty)])), % -7
    %%assertz(board(110, [case(a,empty), case(b, empty), case(c, empty)])), % -8
    %%assertz(board(111, [case(a,empty), case(b, empty), case(c, empty)])). % -9

%% Card pick %%

% There are 12 cards, each of them in 8 copies

:- dynamic(card/2).

initialize_card :- 
    retractall(card(_,_)),
    assertz(card(1,8)),
    assertz(card(2,8)),
    assertz(card(3,8)),
    assertz(card(4,8)),
    assertz(card(5,8)),
    assertz(card(6,8)),
    assertz(card(7,8)),
    assertz(card(8,8)),
    assertz(card(9,8)),
    assertz(card(10,8)),
    assertz(card(11,8)),
    assertz(card(12,8)).

pick_card(Value) :-
    random_between(1, 12, Value),
    card(Value, Copies),
    Copies > 0,
    retract(card(Value, Copies)),
    Copies1 is Copies - 1,
    assertz(card(Value, Copies1)),
    !.
    
pick_card(Value) :-
    card(_, Copies),
    Copies > 0 -> pick_card(Value) ; (initialize_card, pick_card(Value)).

%% Use when a player runs out of cards %%
%% Technically doesn't respect the rules of the game, but will be adjusted when AI and players are linked %%

pack_cards(Player) :-
    player(Player, Pack),
    length(Pack, Length),
    Length = 0 -> 
    (pick_card(Value1), pick_card(Value2), pick_card(Value3), pick_card(Value4), pick_card(Value5)), 
    append([Value1, Value2, Value3, Value4, Value5], Pack, NewPack), retract(player(Player, Pack)) , assertz(player(Player, NewPack)) ; true.

% Get value of specific case at specific line

get_case_value(LineID, CaseID, Value) :-
    board(LineID, Cases),
    member(case(CaseID, Value), Cases).

% Check that the Player called is on the case

check_case(LineID, CaseID, Runner) :-
    board(LineID, Cases),
    member(case(CaseID, Runner), Cases).

% Modify value of case with player %

occupy_case(LineID, CaseID, Runner) :-
    check_case(LineID, CaseID, empty),
    retract(board(LineID, Cases)),
    select(case(CaseID, empty), Cases, case(CaseID, Runner), NewCases), 
    assertz(board(LineID, NewCases)). 

% Reset value of the case %

vacate_case(LineID, CaseID, Runner) :-
    check_case(LineID, CaseID, Runner),
    retract(board(LineID, Cases)),
    select(case(CaseID, Runner), Cases, case(CaseID, empty), UpdatedCases),
    asserta(board(LineID, UpdatedCases)).


% Check if a runner is already on the board, and can be used to retrieve its position %

runner_on_board(Runner, LineID, CaseID) :- 
    board(LineID, Cases),
    member(case(CaseID, Runner), Cases).

%% Move definition %%

%% Handle when a player goes on a 'shift' case (aka a case where the 'b' line is separated in 2) %%

shift_case(Runner, Card, OldLineID, CaseID) :- %% Need to implement the case when a player LEAVES a shift case
    NewLineID is OldLineID + Card,
    % Check if all cases with the same CaseID between OldLineID and NewLineID are empty -> a player can't pass by another player
    check_cases_empty(Runner, OldLineID, NewLineID, CaseID), % We still must check that there isn't a player on the same case on one of the lines that the player will go by
    (CaseID = a -> % Player lands on the 'a' case of the shift line
    % Update NewLineID to the corresponding line with the 'a' case
    (NewLineID is 9 -> ShiftLineID is NewLineID + 1,  % The player is on case 'a', wich is the same for 9 and (cf. board) so it's "easier" to put him on the last line
    retract(board(NewLineID, Cases1)),
    select(case(a, empty), Cases1, case(a, Runner), NewCases1), 
    assertz(board(NewLineID, NewCases1)),

    retract(board(ShiftLineID, Cases2)),
    select(case(a, empty), Cases2, case(a, Runner), NewCases2),
    assertz(board(ShiftLineID, NewCases2))
    ;
    true) % The player doesn't go on the 'first' part of 9A, so he goes onto the next line
    
    ;

    true).  % The player goes on the 'b' case
    
    
    %retract(board(NewLineID1, Cases1)),
    %select(case(a, empty), Cases1, case(a, Runner), NewCases1), 
    %assertz(board(NewLineID1, NewCases1)),
    %retract(board(NewLineID2, Cases2)),
    %select(case(a, empty), Cases2, case(a, Runner), NewCases2),
    %assertz(board(NewLineID2, NewCases2))
    %; 
     
    % Player lands on the 'b' case of the shift line
    %NewLineID = NewLineID_Int + 0.1, % Update NewLineID to the corresponding line with the 'b' case
    %NewCaseID = OldCaseID
    

% LineID is the line where the player is (for example 1, 25, ...) and the CaseID is the case (a, b or c, depending on the line)
% move_player : player is the ID of the runner, Card is the value of the card, OldLineID is the line where the player is, 
% OldCaseID is the case where the player is, NewCaseID is the case where the player will go (he doesn't chose the line because it will be decided by the value of the card)

first_move(Runner, Card, CaseID) :-
    check_cases_empty(Runner, 1, Card, CaseID),
    occupy_case(Card, CaseID, Runner).

move_runner(Runner, Card, NewCaseID, OldLineID, OldCaseID) :- 
    NewLineID is OldLineID + Card,
    check_cases_empty(Runner, OldLineID, NewLineID, NewCaseID),
    occupy_case(NewLineID, NewCaseID, Runner),
    vacate_case(OldLineID, OldCaseID, Runner).
    

% Check if all cases with the same CaseID between OldLineID and NewLineID are empty -> a player can't pass by another player %
% Check if all cases with the same CaseID between OldLineID and NewLineID are empty -> a player can't pass by another player
check_cases_empty(Runner, OldLineID, NewLineID, CaseID) :-
    forall(
        (   between(OldLineID, NewLineID, LineID), % Iterate over line IDs from OldLineID to NewLineID
            board(LineID, Cases)
        ),
        (   member(case(CaseID, empty), Cases) % Check if the case is empty
        ;   member(case(CaseID, Runner), Cases) % Check if the case is occupied by the same runner
        )
    ).



% Main function : pick a card and a runner to move %
% If the card is the last one, 5 new cards are picked %

play_turn(Player, Runner, Card, CaseID) :-
    player(Player, Pack),
    member(Card, Pack),  

    (
    runner_on_board(Runner, OldLineID, OldCaseID) -> % If the runner is already on the board
        LineID is OldLineID + Card,
        (CaseID == b -> 
            runner_on_board(X, LineID, a), X \== empty, % A runner can go to 'b' only if there is a runner on 'a' in the same line
            runner_on_board(Y, LineID, b), Y == empty % 'b' should be empty) 
        ; true
        ),
        (CaseID == c -> 
            board(LineID, _),
            length(_,3), % If the line has 3 cases, the runner can go to 'c'
            OldCaseID \== a, % A runner can't go from 'a' to 'c' directly
            runner_on_board(X, LineID, a), X \== empty , % There must be a runner on 'a' in the same line
            runner_on_board(Y, LineID, b), Y \== empty, % 'c' should be empty
            runner_on_board(Z, LineID, c), Z == empty % 'b' should be empty
        ; true
        ),
        (CaseID == a -> 
            OldCaseID \== c % A runner can't go from 'c' to 'a' directly
        ; true
        ),
        (member(LineID, [9,11,65,67,93,95]) -> shift_case(Runner, Card, OldLineID, CaseID) %% TO DO : add all LineID for shift cases  | % If the player is on a 'shift' case, then use predicate shift_case
        ; %% Will need to 'stop here', because shift_case already modifies the value of the board -> don't pass by predicate 'move_runner'
        true),
        ((member(LineID, [10,12,66,68,94,96]), CaseID == a) -> Card1 is Card + 1, move_runner(Runner, Card1, CaseID, OldLineID, OldCaseID) % If the player should arrive on 'next'
        ;
        true
        ),
        move_runner(Runner, Card, CaseID, OldLineID, OldCaseID)

    ; % If the runner is not on the board
        LineID is Card,
        (CaseID == b -> 
            runner_on_board(X, LineID, a), X \== empty, 
            runner_on_board(Y, LineID, b), Y == empty % A runner can go to 'b' only if there is a runner on 'a' in the same line
        ; true
        ),
        (CaseID == c -> 
            board(LineID, _),
            length(_,3), % If the line has 3 cases, the runner can go to 'c'
            runner_on_board(X, LineID, a), X \== empty, 
             runner_on_board(Y, LineID, b), Y \== empty, 
             runner_on_board(Z, LineID, c), Z == empty % There must be a runner on 'a') % 'b' should be empty
        ; true
        ),

        (member(LineID, [9,11,65,67,93,95]) -> shift_case(Runner, Card, 0, CaseID)

        ; 
            (member(LineID, [10,12,66,68,94,96]), CaseID == a) -> Card1 is Card + 1, 
            first_move(Runner, Card1, CaseID)

            ;
                first_move(Runner, Card, CaseID)
        )
    ),

    retract(player(Player, Pack)),
    select(Card, Pack, NewPack),
    assertz(player(Player, NewPack)),
    (NewPack = [] -> pack_cards(Player) ; true).

display_cards :-
    player(italie, X),
    write('Cards for Italie : '), write(X), nl,
    player(belgique, Y),
    write('Cards for Belgique : '), write(Y), nl,
    player(hollande, Z),
    write('Cards for Hollande : '), write(Z), nl,
    player(allemagne, W),
    write('Cards for Allemagne : '), write(W), nl.

% Write runners position for each player %

display_runners :-
    write('Italie : '), nl, 
(\+ runner_on_board(i1, _, _) -> write('i1 is not on the board'), nl 
; runner_on_board(i1, LineID1, CaseID1), write('i1 is on line '), write(LineID1), write(' case '), write(CaseID1), nl),
(\+ runner_on_board(i2, _, _) -> write('i2 is not on the board'), nl
; runner_on_board(i2, LineID2, CaseID2), write('i2 is on line '), write(LineID2), write(' case '), write(CaseID2), nl),
(\+ runner_on_board(i3, _, _) -> write('i3 is not on the board'), nl
; runner_on_board(i3, LineID3, CaseID3), write('i3 is on line '), write(LineID3), write(' case '), write(CaseID3), nl),
    write('Belgique : '), nl,
(\+ runner_on_board(b1, _, _) -> write('b1 is not on the board'), nl
; runner_on_board(b1, LineID7, CaseID7), write('b1 is on line '), write(LineID7), write(' case '), write(CaseID7), nl),
(\+ runner_on_board(b2, _, _) -> write('b2 is not on the board'), nl
; runner_on_board(b2, LineID8, CaseID8), write('b2 is on line '), write(LineID8), write(' case '), write(CaseID8), nl),
(\+ runner_on_board(b3, _, _) -> write('b3 is not on the board'), nl
; runner_on_board(b3, LineID9, CaseID9), write('b3 is on line '), write(LineID9), write(' case '), write(CaseID9), nl),
    write('Hollande : '), nl,
(\+ runner_on_board(h1, _, _) -> write('h1 is not on the board'), nl
; runner_on_board(h1, LineID4, CaseID4), write('h1 is on line '), write(LineID4), write(' case '), write(CaseID4), nl),
(\+ runner_on_board(h2, _, _) -> write('h2 is not on the board'), nl
; runner_on_board(h2, LineID5, CaseID5), write('h2 is on line '), write(LineID5), write(' case '), write(CaseID5), nl),
(\+ runner_on_board(h3, _, _) -> write('h3 is not on the board'), nl
; runner_on_board(h3, LineID6, CaseID6), write('h3 is on line '), write(LineID6), write(' case '), write(CaseID6), nl),
    write('Allemagne : '), nl,
(\+ runner_on_board(a1, _, _) -> write('a1 is not on the board'), nl
; runner_on_board(a1, LineID10, CaseID10), write('a1 is on line '), write(LineID10), write(' case '), write(CaseID10), nl),
(\+ runner_on_board(a2, _, _) -> write('a2 is not on the board'), nl
; runner_on_board(a2, LineID11, CaseID11), write('a2 is on line '), write(LineID11), write(' case '), write(CaseID11), nl),
(\+ runner_on_board(a3, _, _) -> write('a3 is not on the board'), nl
; runner_on_board(a3, LineID12, CaseID12), write('a3 is on line '), write(LineID12), write(' case '), write(CaseID12), nl).


%% Game begin %% 

initialize_game :-
    initialize_players,
    initialize_board,
    initialize_card,
    pack_cards(italie),
    pack_cards(belgique),
    pack_cards(hollande),
    pack_cards(allemagne),
    display_cards.

start_game :- 
    initialize_game,
    repeat,
    display_runners,
    display_cards,
    writeln('Enter your move : '),
    read(Move),
    call(Move),
    check_runner_on_line_14. % Start checking for runner on line 14 
 

% Predicate to check if there is a runner on line 14 -> to be updated with the true value of the last line/arrival line
check_runner_on_line_14 :-
    member(Runner, [i1, i2, i3, h1, h2, h3, b1, b2, b3, a1, a2, a3]),
    runner_on_board(Runner, 14, _), % Check if any runner is on line 20
    writeln('A runner has reached line 20!'),
    (   (member(Runner, [i1, i2, i3]) -> writeln('Italie wins!'));
        (member(Runner, [h1, h2, h3]) -> writeln('Hollande wins!'));
        (member(Runner, [b1, b2, b3]) -> writeln('Belgique wins!'));
        (member(Runner, [a1, a2, a3]) -> writeln('Allemagne wins!'))
    ),
    reset_game_state.

% Predicate to reset the game state
reset_game_state :-
    retractall(player(_, _)), % Remove all player data
    retractall(board(_, _)),  % Remove all board data
    retractall(card(_)),      % Remove all card data
    initialize_players,       % Initialize players
    initialize_board,         % Initialize board
    initialize_card,          % Initialize cards
    pack_cards(italie),       % Pack cards for each player
    pack_cards(belgique),
    pack_cards(hollande),
    pack_cards(allemagne),
    display_cards.            % Display the cards for each player
    