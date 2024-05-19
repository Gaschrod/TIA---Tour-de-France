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

:- use_module(library(http/json)).
:- use_module(library(http/json_convert)).

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

runners(italie, [i1, i2, i3]).
runners(belgique, [b1, b2, b3]).
runners(hollande, [h1, h2, h3]).
runners(allemagne, [a1, a2, a3]).
    

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
    assertz(board(14, [case(a,empty),case(b,empty)])),
    assertz(board(15, [case(a,empty),case(b,empty)])),
    assertz(board(16, [case(a,empty),case(b,empty)])),
    assertz(board(17, [case(a,empty),case(b,empty)])),
    assertz(board(18, [case(a,empty),case(b,empty)])),
    assertz(board(19, [case(a,empty),case(b,empty)])),
    assertz(board(20, [case(a,empty),case(b,empty)])),

    %%% Back to 3 cases
assertz(board(21, [case(a,empty), case(b, empty), case(c, empty)])),
assertz(board(22, [case(a,empty), case(b, empty), case(c, empty)])),
assertz(board(23, [case(a,empty), case(b, empty), case(c, empty)])),
assertz(board(15, [case(a,empty),case(b,empty)])),
assertz(board(16, [case(a,empty),case(b,empty)])),
assertz(board(17, [case(a,empty),case(b,empty)])),
assertz(board(18, [case(a,empty),case(b,empty)])),
assertz(board(19, [case(a,empty),case(b,empty)])),
assertz(board(20, [case(a,empty),case(b,empty)])),

%%% Back to 3 cases
assertz(board(21, [case(a,empty), case(b, empty), case(c, empty)])),
assertz(board(22, [case(a,empty), case(b, empty), case(c, empty)])),
assertz(board(23, [case(a,empty), case(b, empty), case(c, empty)])),

%%% 2 cases, begin of 'sprint'
assertz(board(24, [case(a,empty), case(b, empty)])),
assertz(board(25, [case(a,empty), case(b, empty)])),
assertz(board(26, [case(a,empty), case(b, empty)])),
assertz(board(27, [case(a,empty), case(b, empty)])),
assertz(board(28, [case(a,empty), case(b, empty)])),
assertz(board(29, [case(a,empty), case(b, empty)])),
assertz(board(30, [case(a,empty), case(b, empty)])),
assertz(board(31, [case(a,empty), case(b, empty)])),
assertz(board(32, [case(a,empty), case(b, empty)])),    
assertz(board(33, [case(a,empty), case(b, empty)])),
assertz(board(34, [case(a,empty), case(b, empty)])),
assertz(board(35, [case(a,empty), case(b, empty)])),
assertz(board(36, [case(a,empty), case(b, empty)])),
assertz(board(37, [case(a,empty), case(b, empty)])),

%%% End of the 'sprint'
assertz(board(38, [case(a,empty), case(b, empty)])),
assertz(board(39, [case(a,empty), case(b, empty)])),
assertz(board(40, [case(a,empty), case(b, empty)])),
assertz(board(41, [case(a,empty), case(b, empty)])),
assertz(board(42, [case(a,empty), case(b, empty)])),
assertz(board(43, [case(a,empty), case(b, empty)])),
assertz(board(44, [case(a,empty), case(b, empty)])),
assertz(board(45, [case(a,empty), case(b, empty)])),
assertz(board(46, [case(a,empty), case(b, empty)])),
assertz(board(47, [case(a,empty), case(b, empty)])),
assertz(board(48, [case(a,empty), case(b, empty)])),
assertz(board(49, [case(a,empty), case(b, empty)])),
assertz(board(50, [case(a,empty), case(b, empty)])),
assertz(board(51, [case(a,empty), case(b, empty)])),
assertz(board(52, [case(a,empty), case(b, empty)])),
assertz(board(53, [case(a,empty), case(b, empty)])),
assertz(board(54, [case(a,empty), case(b, empty)])),
assertz(board(55, [case(a,empty), case(b, empty)])),
assertz(board(56, [case(a,empty), case(b, empty)])),
assertz(board(57, [case(a,empty), case(b, empty)])),
assertz(board(58, [case(a,empty), case(b, empty)])),
assertz(board(59, [case(a,empty), case(b, empty)])),
assertz(board(60, [case(a,empty), case(b, empty)])),
assertz(board(61, [case(a,empty), case(b, empty)])),
assertz(board(62, [case(a,empty), case(b, empty)])),
assertz(board(63, [case(a,empty), case(b, empty)])),
assertz(board(64, [case(a,empty), case(b, empty)])),

%%% Begin of the 'shift'

assertz(board(65, [case(a,empty), case(b, empty)])), % 65 and 66 have the same 'a' case -> 63A
assertz(board(66, [case(a,empty), case(b, empty)])),

assertz(board(67, [case(a,empty), case(b, empty)])), %% 67 and 68 have the same 'a' case -> 64A
assertz(board(68, [case(a,empty), case(b, empty)])),

%%% End of the 'shift'
assertz(board(69, [case(a,empty), case(b, empty)])),
assertz(board(70, [case(a,empty), case(b, empty)])),
assertz(board(71, [case(a,empty), case(b, empty)])),
assertz(board(72, [case(a,empty), case(b, empty)])),
assertz(board(73, [case(a,empty), case(b, empty)])),
assertz(board(74, [case(a,empty), case(b, empty)])),
assertz(board(75, [case(a,empty), case(b, empty)])),
assertz(board(76, [case(a,empty), case(b, empty)])),

%%% Road reduced to 1 case
assertz(board(77, [case(a,empty), case(b, empty)])),
assertz(board(78, [case(a,empty), case(b, empty)])),
assertz(board(79, [case(a,empty), case(b, empty)])),

%%% Back to 2 cases
assertz(board(80, [case(a,empty), case(b, empty)])),
assertz(board(81, [case(a,empty), case(b, empty)])),
assertz(board(82, [case(a,empty), case(b, empty)])),
assertz(board(83, [case(a,empty), case(b, empty)])),
assertz(board(84, [case(a,empty), case(b, empty)])),
assertz(board(85, [case(a,empty), case(b, empty)])),
assertz(board(86, [case(a,empty), case(b, empty)])),
assertz(board(87, [case(a,empty), case(b, empty)])),

%%% Still to 2 cases, but they are on separate 'road' -> for now, only implemented as on line on the left
assertz(board(88, [case(a,empty)])),
assertz(board(89, [case(a,empty)])),
assertz(board(90, [case(a,empty)])),
assertz(board(91, [case(a,empty)])),
assertz(board(92, [case(a,empty)])),

%%% Begin of the 'shift' -> for now, only implemented as 'normal' lines
assertz(board(93, [case(a,empty), case(b, empty)])), % 93 and 94 have the same 'a' case -> 89A
assertz(board(94, [case(a,empty), case(b, empty)])),    

assertz(board(95, [case(a,empty), case(b, empty)])), % 95 and 96 have the same 'a' case -> 90A
assertz(board(96, [case(a,empty), case(b, empty)])),

%%%%% End of the 'shift'
assertz(board(97, [case(a,empty)])),
assertz(board(98, [case(a,empty)])),
assertz(board(99, [case(a,empty)])),
assertz(board(100, [case(a,empty)])),

%%%%% Back to 3 cases
assertz(board(101, [case(a,empty), case(b, empty), case(c, empty)])),

%%%%% Arrival
assertz(board(102, [case(a,empty), case(b, empty), case(c, empty)])), % 0
assertz(board(103, [case(a,empty), case(b, empty), case(c, empty)])), % -1
assertz(board(104, [case(a,empty), case(b, empty), case(c, empty)])), % -2
assertz(board(105, [case(a,empty), case(b, empty), case(c, empty)])), % -3 
assertz(board(106, [case(a,empty), case(b, empty), case(c, empty)])), % -4
assertz(board(107, [case(a,empty), case(b, empty), case(c, empty)])), % -5
assertz(board(108, [case(a,empty), case(b, empty), case(c, empty)])), % -6
assertz(board(109, [case(a,empty), case(b, empty), case(c, empty)])), % -7
assertz(board(110, [case(a,empty), case(b, empty), case(c, empty)])), % -8
assertz(board(111, [case(a,empty), case(b, empty), case(c, empty)])). % -9


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
    (Copies > 0 -> pick_card(Value) 
    ; 
    initialize_card, 
    pick_card(Value),
    display_cards).

%% Use when a player runs out of cards %%

pack_cards(Player) :-
    player(Player, Pack),
    length(Pack, Length),
    Length = 0 -> 
    (pick_card(Value1), pick_card(Value2), pick_card(Value3), pick_card(Value4), pick_card(Value5)), 
    append([Value1, Value2, Value3, Value4, Value5], Pack, NewPack), retract(player(Player, Pack)) , assertz(player(Player, NewPack)) ; true.


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


shift_case(Runner, Card, OldLineID, CaseID) :- 
    NewLineID is OldLineID + Card,
    OldLineID1 is OldLineID + 1, % Used for case_occupation, as the limits will include the case on which the player is if we don't add 1

    (CaseID == a -> % Player lands on the 'a' case of the shift line
    % Update NewLineID to the corresponding line with the 'a' case
    ShiftLineID is NewLineID + 1,  % The player is on case 'a', wich is the same for 9 (cf. board) so it's "easier" to put him on the last line

    check_cases_empty(Runner, OldLineID1, NewLineID, CaseID),
    check_cases_empty(Runner, OldLineID1, ShiftLineID, CaseID),

    case_occupation(_, NewLineID, CaseID),
    case_occupation(_, ShiftLineID, CaseID),

    retract(board(NewLineID, Cases1)),
    select(case(a, empty), Cases1, case(a, Runner), NewCases1), 
    assertz(board(NewLineID, NewCases1)),

    retract(board(ShiftLineID, Cases2)),
    select(case(a, empty), Cases2, case(a, Runner), NewCases2),
    assertz(board(ShiftLineID, NewCases2))
    
    ; % The player goes on 'b' case
    check_cases_empty(Runner, OldLineID1, NewLineID, CaseID),
    case_occupation(_, NewLineID, CaseID),

    retract(board(NewLineID, Cases)),
    select(case(b, empty), Cases, case(b, Runner), NewCases),
    assertz(board(NewLineID, NewCases))
    ),

    (OldLineID \== 0 ->
        retract(board(OldLineID, Cases)),
        select(case(CaseID, Runner), Cases, case(CaseID, empty), NewCases),
        assertz(board(OldLineID, NewCases)) 
        ;
        true).
    

% LineID is the line where the player is (for example 1, 25, ...) and the CaseID is the case (a, b or c, depending on the line)
% move_player : player is the ID of the runner, Card is the value of the card, OldLineID is the line where the player is, 
% OldCaseID is the case where the player is, NewCaseID is the case where the player will go (he doesn't chose the line because it will be decided by the value of the card)

% Used when the player is not on the board yet %

first_move(Runner, Card, CaseID) :-
    ( CaseID == a ->
        ( Card == 9 ->
            shift_case(Runner, 9, 0, CaseID)
        ; Card == 10 ->
            Card1 is Card + 1,
            Card2 is Card + 2,
            case_occupation(_, Card1, CaseID),
            case_occupation(_, Card2, CaseID),
            check_cases_empty(Runner, 1, Card1, CaseID),
            check_cases_empty(Runner, 1, Card2, CaseID),
            occupy_case(Card1, CaseID, Runner),
            occupy_case(Card2, CaseID, Runner)
        ; member(Card, [11, 12]) ->
            Card3 is Card + 2,
            case_occupation(_, Card3, CaseID),
            check_cases_empty(Runner, 1, Card3, CaseID),
            occupy_case(Card3, CaseID, Runner)
        ; case_occupation(_, Card, CaseID),
            check_cases_empty(Runner, 1, Card, CaseID),
            occupy_case(Card, CaseID, Runner)
        )
    ; CaseID == b ->
        ( member(Card, [10, 12, 66, 68, 94, 96]) ->
            shift_case(Runner, Card, 0, CaseID)
        ; check_cases_empty(Runner, 1, Card, CaseID),
            case_occupation(_, Card, CaseID),
            occupy_case(Card, CaseID, Runner)
        )
    ; % Default case for CaseID 'c' or any other CaseID
        check_cases_empty(Runner, 1, Card, CaseID),
        case_occupation(_, Card, CaseID),
        occupy_case(Card, CaseID, Runner)
    ).


% Handle special cases of 'turn' cases %%

special_turn_cases(Runner, OldLineID, OldCaseID) :-
    ((member(OldLineID, [9,10,11,12,65,66,67,68,93,94,95,96]), OldCaseID == a) ->
        retract(board(OldLineID, Cases1)),
        select(case(a, Runner), Cases1, case(a, empty), NewCases1),
        assertz(board(OldLineID, NewCases1)),

        (member(OldLineID, [10,12,66,68,94,96]) ->
            OldLineID2 is OldLineID - 1
        ;
            OldLineID2 is OldLineID + 1
        ),
        
        retract(board(OldLineID2, Cases2)),
        select(case(a, Runner), Cases2, case(a, empty), NewCases2),
        assertz(board(OldLineID2, NewCases2))

        ;

        true
    ).

% Predicate to check if a specific line on the board has no runner
line_empty(LineID) :-
    board(LineID, Cases),
    \+ (member(case(_, Occupied), Cases), Occupied \= empty).

% Move the runner on the board %%

move_runner(Runner, Card, NewCaseID, OldLineID, OldCaseID) :- 
    NewLineID is OldLineID + Card,

    special_turn_cases(Runner, OldLineID, OldCaseID), % Check if the runner was on a 'turn' case, and if it's the case, erase both 'a' values (they are supposed to be the same thing)

    ( NewCaseID == a ->
        (member(NewLineID, [9, 65, 93]) -> % Case 1: Shift case
            shift_case(Runner, Card, OldLineID, NewCaseID)
            
            ; 
            member(NewLineID, [10, 66, 94]) -> % Case 2: Second line of first turn case
                NewLineID1 is NewLineID + 1,
                TurnLineID is NewLineID + 2,
                case_occupation(OldCaseID, NewLineID1, NewCaseID),
                case_occupation(OldCaseID, TurnLineID, NewCaseID),
                check_cases_empty(Runner, OldLineID, NewLineID1, NewCaseID),
                check_cases_empty(Runner, OldLineID, TurnLineID, NewCaseID),
                occupy_case(NewLineID1, NewCaseID, Runner),
                occupy_case(TurnLineID, NewCaseID, Runner),
            
                (\+ line_empty(OldLineID) ->
                vacate_case(OldLineID, OldCaseID, Runner) % If the old position of the runner is not empty, vacate it
                
                ;
                true)

                ; 
                member(NewLineID, [11, 12, 67, 68, 95, 96]) -> % Case 3: Second part of the turn line
                    NewLineID1 is NewLineID + 2,
                    case_occupation(OldCaseID, NewLineID1, NewCaseID),
                    check_cases_empty(Runner, OldLineID, NewLineID1, NewCaseID),
                    occupy_case(NewLineID1, NewCaseID, Runner),

                    (\+ member(OldLineID, [9,10,65,66,93,94]) -> vacate_case(OldLineID, OldCaseID, Runner) 
                    ; 
                    true) % If the old position of the runner is not empty, vacate it
        
                    ; 
                    member(OldLineID, [9,10,65,66,93,94]) -> % Case 4: Old line is on the first turn line, we need to add 2 to the new line ID
                        NewLineID1 is NewLineID + 2,
                        case_occupation(OldCaseID, NewLineID1, NewCaseID),
                        OldLineIDCheck is OldLineID + 2,
                        check_cases_empty(Runner, OldLineIDCheck, NewLineID1, NewCaseID),
                        occupy_case(NewLineID1, NewCaseID, Runner)

                        ;
                        member(OldLineID, [11,12,67,68,95,96]) -> % Case 5: Old line is on the second turn line, we need to add 1 to the new line ID
                            NewLineID1 is NewLineID + 1,
                            case_occupation(OldCaseID, NewLineID1, NewCaseID),
                            check_cases_empty(Runner, OldLineID, NewLineID1, NewCaseID),
                            occupy_case(NewLineID1, NewCaseID, Runner)                            
                            
                            ;
                            % Default case for NewCaseID == a: Normal move
                                case_occupation(OldCaseID, NewLineID, NewCaseID),
                                check_cases_empty(Runner, OldLineID, NewLineID, NewCaseID),
                                occupy_case(NewLineID, NewCaseID, Runner),
                                vacate_case(OldLineID, OldCaseID, Runner)
                            )
    ; 
    NewCaseID == b ->
        ( member(NewLineID, [10, 12, 66, 68, 94, 96]) -> % Case 4: Shift case
            shift_case(Runner, Card, OldLineID, NewCaseID)
            
            ; 
            member(OldLineID, [9, 11, 65, 67, 93, 95]) -> % Case 5: Old line is on the first part of the turn line
                TurnLineID1 is NewLineID + 1,
                case_occupation(OldCaseID, TurnLineID1, NewCaseID),
                check_cases_empty(Runner, OldLineID, TurnLineID1, NewCaseID),
                occupy_case(TurnLineID1, NewCaseID, Runner),
                vacate_case(OldLineID, OldCaseID, Runner)
                ; 
                member(OldLineID, [10, 12, 66, 68, 94, 96]) -> % Case 6: Old line is on the second part of the turn line
                    case_occupation(OldCaseID, NewLineID, NewCaseID),
                    occupy_case(NewLineID, NewCaseID, Runner)
                
                    ; 
                    % Default case for NewCaseID == b: Normal move
                        case_occupation(OldCaseID, NewLineID, NewCaseID),
                        check_cases_empty(Runner, OldLineID, NewLineID, NewCaseID),
                        occupy_case(NewLineID, NewCaseID, Runner),
                        vacate_case(OldLineID, OldCaseID, Runner)
                    )
    ; % Default case for any other NewCaseID
        case_occupation(OldCaseID, NewLineID, NewCaseID),
        check_cases_empty(Runner, OldLineID, NewLineID, NewCaseID),
        occupy_case(NewLineID, NewCaseID, Runner),
        vacate_case(OldLineID, OldCaseID, Runner)
    ).


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

%% Handle cases occupation %%
% Will check if the player can go to the case, depending on the case he comes from and the case he goes to %
% If he wants to go on a, for example, then he mustn't come from 'c' %
case_occupation(OldCaseID, LineID, CaseID) :-
    (CaseID == a -> 
    OldCaseID \== c % A runner can't go from 'c' to 'a' directly
    ; true
    ),
    (CaseID == b -> 
    runner_on_board(X, LineID, a), X \== empty, % A runner can go to 'b' only if there is a runner on 'a' in the same line
    runner_on_board(Y, LineID, b), Y == empty % 'b' should be empty 
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
    ).


% Main function : pick a card and a runner to move %
% If the card is the last one, 5 new cards are picked %

play_turn(Runner, Card, CaseID) :-
    (member(Runner,[i1,i2,i3]) -> Player = italie
    ;

    (member(Runner,[h1,h2,h3]) -> Player = hollande
    ;
        
    (member(Runner,[b1,b2,b3]) -> Player = belgique
        
        ;

        Player = allemagne
        
    ))),

    player(Player, Pack),
    member(Card, Pack),  

    (runner_on_board(Runner, OldLineID, OldCaseID) -> % If the runner is already on the board

        move_runner(Runner, Card, CaseID, OldLineID, OldCaseID)

    ; % If the runner is not on the board

        first_move(Runner, Card, CaseID)
    ),

    retract(player(Player, Pack)),
    select(Card, Pack, NewPack),
    assertz(player(Player, NewPack)),
    (NewPack = [] -> pack_cards(Player) ; true),
    display_runners,
    display_cards,
    !.


%% Display cards of every players %%

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
    ; runner_on_board(a3, LineID12, CaseID12), write('a3 is on line '), write(LineID12), write(' case '), write(CaseID12), nl),
    
    !.


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
    check_runner_on_line_102. % Start checking for runner on line 102 
 

% Predicate to check if there is a runner on line 102 -> to be updated with the true value of the last line/arrival line
check_runner_on_line_102 :-
    member(Runner, [i1, i2, i3, h1, h2, h3, b1, b2, b3, a1, a2, a3]),
    runner_on_board(Runner, 102, _), % Check if any runner is on line 102
    writeln('A runner has reached line 102!'),
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
    
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%% IA part %%

% First heuristic: move the runner which could advance the most
best_move_heuristic1(Player, Runner, Card) :-
    runners(Player, Runners),
    player(Player, Pack),
    findall((R, C), (member(R, Runners), member(C, Pack)), Moves),
    prioritize_moves(Player, Moves, PriorityMoves),
    evaluate_moves_heuristic1(Player, PriorityMoves, BestMove),
    BestMove = (Runner, Card).

% Prioritize moves: runners not on the board should move first
prioritize_moves(Player, Moves, PriorityMoves) :-
    partition(not_on_board(Player), Moves, NotOnBoardMoves, OnBoardMoves),
    append(NotOnBoardMoves, OnBoardMoves, PriorityMoves).

not_on_board(_, (Runner, _)) :-
    \+ runner_on_board(Runner, _, _).

% Evaluate moves and find the best feasible move
evaluate_moves_heuristic1(Player, Moves, BestMove) :-
    % Sort moves by card value in descending order
    sort(2, @>=, Moves, SortedMoves),
    % Find the best feasible move
    find_best_feasible_move(Player, SortedMoves, BestMove).

% Find the best feasible move from a sorted list of moves
find_best_feasible_move(_, [], _) :-
    writeln('No more moves'), fail.
find_best_feasible_move(Player, [(Runner, Card) | RestMoves], BestMove) :-
    (   legal_move(Player, Runner, Card)
    ->  BestMove = (Runner, Card)
    ;   find_best_feasible_move(Player, RestMoves, BestMove)
    ).

% Check if a move is legal
legal_move(_, Runner, Card) :-
    (   runner_on_board(Runner, LineID, _)
    ->  NewLineID is LineID + Card,
        NewLineID =< 102
    ;   true  % The runner is not on the board, so the move is legal
    ).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Second heuristic: move the last runner forward the most
best_move_heuristic2(Player, Runner, Card) :-
    runners(Player, Runners),
    player(Player, Pack),
    find_last_runner_or_unplaced(Player, Runners, LastRunner),
    (   LastRunner = unplaced
    ->  % If there are unplaced runners, place them on the board first
        place_unplaced_runner(Player, LastRunner, Pack, Runner, Card)
    ;   % Otherwise, move the last runner forward the most
        findall((LastRunner, C), member(C, Pack), Moves),
        evaluate_moves_heuristic2(Player, Moves, BestMove),
        BestMove = (Runner, Card)
    ).

% Find the last runner on the board, or if none, find an unplaced runner
find_last_runner_or_unplaced(Player, Runners, LastRunner) :-
    findall((R, LineID, CaseID), (member(R, Runners), runner_on_board(R, LineID, CaseID)), RunnerPositions),
    (   RunnerPositions \= []
    ->  % Find the last runner on the board
        sort(2, @=<, RunnerPositions, SortedRunnerPositions),
        last(SortedRunnerPositions, (LastRunner, _, _)),
        (   runner_can_advance(Player, LastRunner) -> true
        ;   % If the last runner can't advance, find the next feasible one
            find_next_feasible_runner2(Player, SortedRunnerPositions, LastRunner)
        )
    ;   % No runners on the board, choose the first unplaced runner
        member(LastRunner, Runners),
        \+ runner_on_board(LastRunner, _, _)
    ).

% Place unplaced runners on the board
place_unplaced_runner(Player, unplaced, Pack, Runner, Card) :-
    member(Runner, _),
    runner_on_board(Runner, _, _), % Check if the runner is already on the board
    member(Card, Pack),
    legal_move(Player, Runner, Card).

% Check if a runner can advance
runner_can_advance(Player, Runner) :-
    player(Player, Pack),
    member(Card, Pack),
    legal_move(Player, Runner, Card).

% Find the next feasible runner from a sorted list of runner positions
find_next_feasible_runner2(Player, [(R, _, _) | Rest], FeasibleRunner) :-
    (   runner_can_advance(Player, R)
    ->  FeasibleRunner = R
    ;   find_next_feasible_runner2(Player, Rest, FeasibleRunner)
    ).

% Evaluate moves to maximize the advancement of the last runner
evaluate_moves_heuristic2(Player, Moves, BestMove) :-
    % Sort moves by card value in descending order
    sort(2, @>=, Moves, SortedMoves),
    % Find the best feasible move for the last runner
    find_best_feasible_move2(Player, SortedMoves, BestMove).

% Find the best feasible move for the last runner from a sorted list of moves
find_best_feasible_move2(_, [], _) :-
    writeln('No more moves'), fail.

find_best_feasible_move2(Player, [(Runner, Card) | RestMoves], BestMove) :-
    (   legal_move1(Player, Runner, Card)
    ->  BestMove = (Runner, Card)
    ;   find_best_feasible_move2(Player, RestMoves, BestMove)
    ).

% Check if a move is legal
legal_move1(_, Runner, Card) :-
    (   runner_on_board(Runner, LineID, _)
    ->  NewLineID is LineID + Card,
        NewLineID =< 102
    ;   true  % The runner is not on the board, so the move is legal
    ).



% Main loop: pick the best move and play it using the chosen heuristic

% play_best_move(in,out,out) %

play_best_move(Player, Runner,Card) :-
    best_move_heuristic2(Player, Runner, Card),
    % Choose the best case ID, assuming 'a' is the desired case to move to
    play_turn(Runner, Card, a).



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Receive the card of the player in JSON, as a list of lists -> [[8,2],[3,1],...] ; we only need the first value as it represents the card of a player
give_cards(Deck, Player) :-
    initialize_board,
    % Extract the first element from each sub-list in Deck
    findall(Card, (member([Card|_], Deck)), Cards),
    % Retract the existing cards for the player
    retractall(player(Player, _)),
    % Assert the new list of cards for the player
    assertz(player(Player, Cards)).


%%  setup(CyclistInfo) :-
%%      % Extract cyclist information
%%      term_to_atom(CyclistInfo, Atom),
%%      atom_json_dict(Atom, CyclistDict, []),
%%      get_cyclist_attributes(CyclistDict, Pays, _, Rangee, Case, _),
%%      print(Pays), nl,
%%      print(Rangee), nl,
%%      print(Case), nl.
%%      % Define mapping rules based on cyclist attributes
%%      %update_board_mapping(Pays, Section, Rangee, Case, Position).
%%  
%%  % Define mapping rules based on cyclist attributes
%%  %update_board_mapping(Pays, Section, Rangee, Case, Position) :-
%%  %    % Define your mapping rules here based on the cyclist's attributes
%%  %    % Example:
%%  %    (Pays = "Belgique" ->
%%  %        (Case = 6, Position = b1);
%%  %    )
%%  %    % Add more mapping rules as needed...
%%  
%%  % Extract cyclist attributes from the provided information
%%  get_cyclist_attributes(CyclistInfo, Pays, _, Rangee, Case, _) :-
%%      % Unify the provided attributes with the corresponding values in the CyclistInfo
%%      member(pays=Pays, CyclistInfo),
%%      member(rangée=Rangee, CyclistInfo),
%%      member(case=Case, CyclistInfo).