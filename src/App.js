import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Questions from "./Questions";

const initialState = {
  questions: {},
  //stateus:  active , loading ,error , active
  status: "Loading",
  index: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "recivedData":
      return { ...state, questions: action.payload, status: action.type };
    case "dataFaild":
      return { ...state, status: action.type };
    case "active":
      return { ...state, status: action.type };
    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [{ status, questions, index }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const NumOfQuestions = questions.legnth;

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "recivedData", payload: data }))
      .catch((err) => dispatch({ type: "dataFaild" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "Loading" && <Loader />}
        {status === "dataFaild" && <Error />}
        {status === "recivedData" && (
          <StartScreen NumOfQuestions={NumOfQuestions} dispatch={dispatch} />
        )}
        {status === "active" && <Questions questions={questions[index]} />}
      </Main>
    </div>
  );
}
