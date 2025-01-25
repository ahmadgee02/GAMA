% Helper predicate to append elements to a list if they're not already present
add_to_set(X, Set, Set) :- member(X, Set), !. % If X is already in the set, do nothing
add_to_set(X, Set, [X|Set]). % Otherwise, add X to the set

% Predicate to collect all payoff values
collect_payoffs(L) :-
    findall(P1, payoff(_, _, P1, _), P1List),
    findall(P2, payoff(_, _, _, P2), P2List),
    append(P1List, P2List, AllPayoffs),
    remove_duplicates(AllPayoffs, L).

% Predicate to remove duplicates from a list
remove_duplicates([], []).
remove_duplicates([H|T], Unique) :-
    remove_duplicates(T, TUnique),
    add_to_set(H, TUnique, Unique).

list_unique_payoffs(UniquePayoffs) :-
    collect_payoffs(UniquePayoffs).