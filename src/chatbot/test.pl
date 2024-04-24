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

read_text_and_convert_to_string(String) :-
    read_text_from_console(Chars),
    atom_codes(String, Chars).

:- read_text_and_convert_to_string(String), write(String).
    