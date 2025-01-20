% Random strategy
select(_P, _O, S, M) :-
    % Find all possible moves
    findall(move(P, Action), possible(move(P, Action), S), Moves),
    % Randomly select one move from the list
    random_member(move(P, M), Moves).