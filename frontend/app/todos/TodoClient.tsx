"use client";

import { useState } from "react";
import { createTodo, deleteTodo, updateTodo, getTodos } from "../actions";
import type { Todo } from "../actions";
import Link from "next/link";

function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export default function TodoClient({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [currentFilter, setCurrentFilter] = useState("all");
  const [inputText, setInputText] = useState("");

  const dayNames = ["월", "화", "수", "목", "금", "토", "일"];
  const todayString = formatDate(new Date());
  const selectedString = formatDate(selectedDate);

  const weekStart = currentWeekStart.getFullYear() + "년 " + (currentWeekStart.getMonth() + 1) + "월";

  function getTodoCount(dateString: string) {
    return todos.filter((t) => t.date === dateString).length;
  }

  async function refreshTodos() {
    const updated = await getTodos();
    setTodos(updated);
  }

  async function handleAdd() {
    if (!inputText.trim()) {
      alert("할 일을 입력해주세요!");
      return;
    }
    const formData = new FormData();
    formData.append("title", inputText.trim());
    formData.append("description", "");
    formData.append("date", selectedString);
    await createTodo(formData);
    setInputText("");
    await refreshTodos();
  }

  async function handleDelete(id: number) {
    await deleteTodo(id);
    await refreshTodos();
  }

  async function handleToggle(todo: Todo) {
    await updateTodo(todo.id, { completed: !todo.completed });
    await refreshTodos();
  }

  async function handleEdit(todo: Todo) {
    const newText = prompt("수정할 내용을 입력하세요:", todo.title);
    if (newText !== null && newText.trim() !== "") {
      await updateTodo(todo.id, { title: newText.trim() });
      await refreshTodos();
    }
  }

  function prevWeek() {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - 7);
    setCurrentWeekStart(d);
  }

  function nextWeek() {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + 7);
    setCurrentWeekStart(d);
  }

  let filteredTodos = todos.filter((t) => t.date === selectedString);
  if (currentFilter === "active") filteredTodos = filteredTodos.filter((t) => !t.completed);
  if (currentFilter === "completed") filteredTodos = filteredTodos.filter((t) => t.completed);

  return (
    <main className="min-h-screen bg-[#f5f5f5] flex items-start justify-center pt-12 pb-12">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-5">
        <h1 className="text-2xl font-bold text-center text-[#672be0] mb-5">Todo List</h1>

        {/* 달력 */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <button onClick={prevWeek} className="text-[#672be0] font-bold text-lg">&lt;</button>
            <span className="text-sm font-medium text-gray-700">{weekStart}</span>
            <button onClick={nextWeek} className="text-[#672be0] font-bold text-lg">&gt;</button>
          </div>
          <div className="flex justify-between">
            {dayNames.map((name, i) => {
              const d = new Date(currentWeekStart);
              d.setDate(d.getDate() + i);
              const dateStr = formatDate(d);
              const isToday = dateStr === todayString;
              const isSelected = dateStr === selectedString;
              const count = getTodoCount(dateStr);

              return (
                <div
                  key={i}
                  onClick={() => setSelectedDate(new Date(d))}
                  className={`flex flex-col items-center cursor-pointer p-1.5 rounded-lg w-11 transition-all
                    ${isSelected ? "bg-[#672be0] text-white" : ""}
                  `}
                >
                  <span className={`text-xs mb-1 ${isSelected ? "text-white" : "text-gray-400"}`}>{name}</span>
                  <span className={`text-sm font-bold ${isSelected ? "text-white" : isToday ? "text-[#672be0]" : "text-gray-700"}`}>
                    {d.getDate()}
                  </span>
                  <span className={`text-xs mt-1 font-bold ${isSelected ? "text-white" : "text-[#672be0]"}`}>
                    {count > 0 ? `${count}개` : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 필터 */}
        <div className="flex justify-center gap-2 mb-4">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setCurrentFilter(f)}
              className={`px-4 py-1 rounded-full text-sm font-bold border border-[#672be0] transition-all
                ${currentFilter === f ? "bg-[#672be0] text-white" : "text-[#672be0] bg-white hover:bg-[#672be0] hover:text-white"}
              `}
            >
              {f === "all" ? "전체" : f === "active" ? "진행 중" : "완료"}
            </button>
          ))}
        </div>

        {/* 입력 */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="선택한 날짜에 할 일을 추가하세요"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#672be0]"
          />
          <button
            onClick={handleAdd}
            className="bg-[#672be0] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#5520c0]"
          >
            추가
          </button>
        </div>

        {/* 할 일 목록 */}
        {filteredTodos.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6">할 일이 없습니다. 추가해보세요!</p>
        ) : (
          <ul>
            {filteredTodos.map((todo) => (
              <li key={todo.id} className={`flex justify-between items-center py-2.5 border-b border-gray-100 ${todo.completed ? "opacity-60" : ""}`}>
                <span
                  onClick={() => handleToggle(todo)}
                  className={`cursor-pointer flex-1 text-sm ${todo.completed ? "line-through text-gray-400" : "text-gray-700"}`}
                >
                  {todo.title}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(todo)} className="text-xs bg-[#f0c14b] text-gray-800 px-2 py-1 rounded">수정</button>
                  <button onClick={() => handleDelete(todo.id)} className="text-xs bg-[#ff4d4f] text-white px-2 py-1 rounded">삭제</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}