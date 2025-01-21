select(P, _O, S, M) :-
    setof(Mi, possible(move(P, Mi), S), Moves),
    random_member(M, Moves).