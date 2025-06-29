import React, { createContext, useReducer } from "react";

const initialState = {
  season: "",
  races: [],
  selectedRace: null,
  raceResult: null,
  constructors: [],
  drivers: [],
  error: null,
  raceDetailsOpen: false,
};

function f1Reducer(state, action) {
  switch (action.type) {
    case "SET_SEASON":
      return { ...state, season: action.payload };
    case "SET_RACES":
      return { ...state, races: action.payload, error: null };
    case "SELECT_RACE":
      return { ...state, selectedRace: action.payload };
    case "SET_RACE_RESULT":
      return { ...state, raceResult: action.payload };
    case "SET_CONSTRUCTORS":
      return { ...state, constructors: action.payload, error: null };
    case "SET_DRIVERS":
      return { ...state, drivers: action.payload, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "OPEN_RACE_DETAILS":
      return { ...state, raceDetailsOpen: true };
    case "CLOSE_RACE_DETAILS":
      return { ...state, raceDetailsOpen: false };
    case "CLEAR_SELECTIONS":
      return { ...initialState };
    default:
      return state;
  }
}

export const F1Context = createContext();

export const F1Provider = ({ children, token }) => {
  const [state, dispatch] = useReducer(f1Reducer, initialState);

  return (
    <F1Context.Provider value={{ state, dispatch, token }}>
      {children}
    </F1Context.Provider>
  );
};
