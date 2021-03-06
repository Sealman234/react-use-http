import React, { useState, useEffect } from 'react';

import Tasks from './components/Tasks/Tasks';
import NewTask from './components/NewTask/NewTask';
import useHttp from './hooks/use-http';

function App() {
  const [tasks, setTasks] = useState([]);

  const transformTasks = (taskObj) => {
    const loadedTasks = [];

    for (const taskKey in taskObj) {
      loadedTasks.push({ id: taskKey, text: taskObj[taskKey].text });
    }

    setTasks(loadedTasks);
  };

  const { isLoading, error, sendRequest: fetchTasks } = useHttp();

  // 將 fetchTasks 加入 dependencies array，以偵測 sendRequest (fetchTasks) 的改變 (如果某些情況下改變了的話)
  // 照理來說是要加入沒錯，但是這樣會造成 Infinite loop...
  useEffect(() => {
    fetchTasks(
      {
        url: 'https://react-http-14f5a-default-rtdb.firebaseio.com/tasks.json',
      },
      transformTasks
    );
  }, [fetchTasks]); // 若加入 fetchTasks 函式，由於函式就是物件，因此每次新生成物件傳的參考都不同，就會一直重跑 useEffect

  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </React.Fragment>
  );
}

export default App;
