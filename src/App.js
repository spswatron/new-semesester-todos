import "./App.css";
import { useEffect, useRef, useState } from "react";
import ls from "local-storage";

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

function TrashButton(props) {
  return (
    <button onClick={props.onClick} className={"trash-button"}>
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
        className="feather feather-trash-2"
      >
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    </button>
  );
}

function CheckBox(props) {
  return (
    <button className={"checkbox"} onClick={props.onClick}>
      {props.checked ? (
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
          className="feather feather-check-circle"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ) : (
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
          className="feather feather-circle"
        >
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      )}
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
    <div className={"task-wrapper" + (props.finished ? " finished" : "")}>
      <div className={"task"}>
        <CheckBox checked={props.finished} onClick={props.markFinished} />
        <div className={"task-item"}>
          <div className={"task-name"}>{props.task}</div>
          <div className={"task-right"}>
            {convertInterval(
              (props.finished
                ? props.finishedTime.getTime()
                : props.currTime.getTime()) - props.startTime.getTime()
            )}
            <TrashButton onClick={props.removeTask} />
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
}

function TaskList(props) {
  return (
    <div className={"task-list"}>
      {props.tasks.map((j, i) => (
        <Task
          startTime={j.startTime}
          currTime={props.currTime}
          finishedTime={j.finishedTime}
          key={j.key}
          task={j.task}
          finished={j.finished}
          removeTask={() => props.removeTask(i)}
          markFinished={() => props.markFinished(i)}
        />
      ))}
    </div>
  );
}

function App() {
  const initialTasks = (taskList) => {
    if (!taskList) {
      return [];
    }
    return taskList.map((j) => {
      return {
        task: j.task,
        key: j.key,
        finished: j.finished,
        startTime: new Date(j.startTime),
        finishedTime: new Date(j.finishedTime),
      };
    });
  };

  const [tasks, setTasks] = useState(initialTasks(ls.get("tasks")));
  const [input, setInput] = useState("");
  const [currTime, setCurrTime] = useState(new Date());
  const taskCount = useRef(ls.get("taskCount") || 0);

  useEffect(() => {
    setInterval(() => {
      setCurrTime(new Date());
    }, 1000);
  }, []);

  const markFinished = (index) => {
    if (tasks[index].finished) {
      return;
    }
    const newTasks = tasks.map((j, i) => {
      return {
        task: j.task,
        key: j.key,
        startTime: j.startTime,
        finished: j.finished || i === index,
        finishedTime: new Date(),
      };
    });
    setTasks(newTasks);
    ls.set("tasks", newTasks);
  };

  const removeTask = (index) => {
    tasks.splice(index, 1);
    const newTasks = [...tasks];
    setTasks(newTasks);
    ls.set("tasks", newTasks);
  };

  const addTask = () => {
    if (input.length === 0) return;
    const newTasks = tasks.concat({
      task: input,
      key: taskCount.current,
      startTime: new Date(),
      finished: false,
    });
    setTasks(newTasks);
    taskCount.current++;
    setInput("");
    ls.set("tasks", newTasks);
    ls.set("taskCount", taskCount.current);
  };

  return (
    <div className={"App"}>
      <h1>Carpe</h1>
      <TaskList
        removeTask={removeTask}
        markFinished={markFinished}
        currTime={currTime}
        tasks={tasks}
      />
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
