import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getTasks, createTask as apiCreate, updateTask as apiUpdate, deleteTask as apiDelete } from '../api';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { ...state, tasks: action.payload, loading: false };
    case 'ADD':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t._id === action.payload._id ? action.payload : t)),
      };
    case 'DELETE':
      return { ...state, tasks: state.tasks.filter((t) => t._id !== action.payload) };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, { tasks: [], loading: false, error: null });

  const fetchTasks = useCallback(async (filters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await getTasks(filters);
      dispatch({ type: 'SET', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.msg || 'Failed to load tasks' });
    }
  }, []);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

  const addTask = async (taskData) => {
    const { data } = await apiCreate(taskData);
    dispatch({ type: 'ADD', payload: data });
    return data;
  };

  const editTask = async (id, updates) => {
    const { data } = await apiUpdate(id, updates);
    dispatch({ type: 'UPDATE', payload: data });
    return data;
  };

  const removeTask = async (id) => {
    await apiDelete(id);
    dispatch({ type: 'DELETE', payload: id });
  };

  const moveTask = async (id, status) => {
    const { data } = await apiUpdate(id, { status });
    dispatch({ type: 'UPDATE', payload: data });
  };

  return (
    <TaskContext.Provider value={{ ...state, fetchTasks, addTask, editTask, removeTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
