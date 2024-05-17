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
    assertz(board(23, [case(a,empty), case(b, empty), case(c, empty)])).

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


shift_case(Runner, Card, OldLineID, CaseID) :- 
    NewLineID is OldLineID + Card,
    OldLineID1 is OldLineID + 1, % Used for case_occupation, as the limits will include the case on which the player is if we don't add 1

    (CaseID = a -> % Player lands on the 'a' case of the shift line
    % Update NewLineID to the corresponding line with the 'a' case
    ShiftLineID is NewLineID + 1,  % The player is on case 'a', wich is the same for 9 (cf. board) so it's "easier" to put him on the last line

    check_cases_empty(Runner, OldLineID1, NewLineID, CaseID),
    check_cases_empty(Runner, OldLineID1, ShiftLineID, CaseID),

    case_occupation(OldLineID, NewLineID, CaseID),
    case_occupation(OldLineID, ShiftLineID, CaseID),

    retract(board(NewLineID, Cases1)),
    select(case(a, empty), Cases1, case(a, Runner), NewCases1), 
    assertz(board(NewLineID, NewCases1)),

    retract(board(ShiftLineID, Cases2)),
    select(case(a, empty), Cases2, case(a, Runner), NewCases2),
    assertz(board(ShiftLineID, NewCases2))
    
    ; % The player goes on 'b' case
    check_cases_empty(Runner, OldLineID1, NewLineID, CaseID),
    case_occupation(OldLineID, NewLineID, CaseID),

    retract(board(NewLineID, Cases)),
    select(case(b, empty), Cases, case(b, Runner), NewCases),
    assertz(board(NewLineID, NewCases))
    ),
    retract(board(OldLineID, Cases)),
    select(case(CaseID, Runner), Cases, case(CaseID, empty), NewCases),
    assertz(board(OldLineID, NewCases)).
    

% LineID is the line where the player is (for example 1, 25, ...) and the CaseID is the case (a, b or c, depending on the line)
% move_player : player is the ID of the runner, Card is the value of the card, OldLineID is the line where the player is, 
% OldCaseID is the case where the player is, NewCaseID is the case where the player will go (he doesn't chose the line because it will be decided by the value of the card)

% Used when the player is not on the board yet %

first_move(Runner, Card, CaseID) :-
    check_cases_empty(Runner, 1, Card, CaseID),

    (CaseID == a ->
        (% Case 1: Card is in the shift cases
        member(Card, [9, 11, 65, 67, 93, 95]) -> 
        shift_case(Runner, Card, 0, CaseID)
            
        ; 
            % Case 2: Card is in the 'next' cases (10, 66, 94)
            member(Card, [10, 66, 94]) ->
            Card1 is Card + 1,
            Card2 is Card + 2, % We do this because we arrive at the end of a line, so we need to move the runner to the next line (and in this case, we arrive on 'a' so we 
            % need to change the value for both 'a' case) -> try to visualize with the image of the board, it's easier
            case_occupation(_, Card1, CaseID),
            case_occupation(_, Card2, CaseID),

            occupy_case(Card1, CaseID, Runner),
            occupy_case(Card2, CaseID, Runner)

            ;
                % Case 3: The next Card1 is also in the 'next' cases (12, 68, 96)
                (member(Card, [12, 68, 96]) -> 
                Card3 is Card + 2,
                case_occupation(_, Card3, CaseID),
                occupy_case(Card3, CaseID, Runner)
            ; 
                
            % Default case: Move the runner normally
            case_occupation(_, Card, CaseID),
            occupy_case(Card, CaseID, Runner)))
        
    ; 
        % CaseID is 'b'
        (CaseID == b ->
            (% Case 4: Card is in the 'next' cases
            member(Card, [10, 12, 66, 68, 94, 96]) -> 
            shift_case(Runner, Card, 0, CaseID)
            
        ; 
            % Default case: Move the runner normally
            case_occupation(_, Card, CaseID),
            occupy_case(Card, CaseID, Runner))       

    ; 
        % Default case: Move the runner normally
        case_occupation(_, Card, CaseID),
        occupy_case(Card, CaseID, Runner))).


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

% Move the runner on the board %%

move_runner(Runner, Card, NewCaseID, OldLineID, OldCaseID) :- 
    NewLineID is OldLineID + Card,

    special_turn_cases(Runner, OldLineID, OldCaseID),

    % Case 1: NewLineID is in the shift cases
    (member(NewLineID, [9,11,65,67,93,95]) ->
        shift_case(Runner, Card, OldLineID, NewCaseID)
    ;
    % Case 2: NewLineID is in the 'next' cases and NewCaseID is 'a'
    (member(NewLineID, [10,12,66,68,94,96]), NewCaseID == a ->
        Card1 is Card + 1,
        move_runner(Runner, Card1, NewCaseID, OldLineID, OldCaseID)
    ; 
    % Case 3: NewLineID is in the 'next' cases and NewCaseID is 'b'
    (member(NewLineID, [10,12,66,68,94,96]), NewCaseID == b ->
        shift_case(Runner, Card, OldLineID, NewCaseID)
    ; 

    (member(OldLineID, [9,11,65,67,93,95]) -> 
        TurnLineID1 is NewLineID + 1, % Need to directly exectute occupy
        case_occupation(OldLineID, TurnLineID1, NewCaseID),
        occupy_case(TurnLineID1,NewCaseID,Runner)
    ;

    (member(OldLineID, [10,12,66,68,94,96]) -> 
        case_occupation(OldLineID, NewLineID, NewCaseID),
        occupy_case(NewLineID,NewCaseID,Runner)
    ;

    % Default Case: Normal move
    case_occupation(OldLineID, NewLineID, NewCaseID),
    check_cases_empty(Runner, NewLineID, NewLineID, NewCaseID),
    occupy_case(NewLineID, NewCaseID, Runner),
    vacate_case(OldLineID, OldCaseID, Runner)
    ))))).

    

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

play_turn(Player, Runner, Card, CaseID) :-
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
    