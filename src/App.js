import logo from "./logo.svg";
import "./App.css";
import { useEffect, useRef, useState } from "react";

function RightButton(props) {
  return (
    <button onClick={props.onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="feather feather-arrow-right"
      >
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </button>
  );
}

function wrapNum(num) {
  if (num < 10) {
    return "0" + Math.max(0, num).toString();
  } else {
    return num.toString();
  }
}

function convertInterval(time) {
  time = Math.floor(time / 1000);
  const seconds = time % 60;
  time = Math.floor(time / 60);
  const minutes = time % 60;
  time = Math.floor(time / 60);
  const hours = time % 24;
  const days = Math.floor(time / 24);
  return (
    wrapNum(days) +
    ":" +
    wrapNum(hours) +
    ":" +
    wrapNum(minutes) +
    ":" +
    wrapNum(seconds)
  );
}

function Task(props) {
  return (
    <div className={"task"}>
      <input type={"checkbox"} />
      <span className={"checkbox"} />
      <div className={"task-item"}>
        <div>{props.task}</div>
        <div>
          {convertInterval(
            props.currTime.getTime() - props.startTime.getTime()
          )}
        </div>
      </div>
      <hr />
    </div>
  );
}

function TaskList(props) {
  return (
    <div className={"task-list"}>
      {props.tasks.map((j) => (
        <Task
          startTime={j.startTime}
          currTime={props.currTime}
          key={j.key}
          task={j.task}
        />
      ))}
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [currTime, setCurrTime] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setCurrTime(new Date());
    }, 1000);
  }, []);
  const taskCount = useRef(0);
  const addTask = () => {
    if (input.length === 0) return;
    setTasks(
      tasks.concat({
        task: input,
        key: taskCount.current,
        startTime: new Date(),
      })
    );
    taskCount.current++;
    setInput("");
  };
  return (
    <div className={"App"}>
      <h1>Carpe</h1>
      <TaskList currTime={currTime} tasks={tasks} />
      <div className={"input-wrapper"}>
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTask();
            }
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <RightButton onClick={addTask} />
      </div>
    </div>
  );
}

export default App;
