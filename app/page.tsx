"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import supabase from "@/lib/db";
import { useEffect, useState } from "react";

function App() {
  const [todoList, setTodoList] = useState<any[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase.from("TodoList").select("*");
    if (error) {
      console.log("Error fetching :", error);
    } else {
      setTodoList(data);
    }
  };

  const addTodo = async () => {
    const newTodoData = {
      name: newTodo,
      isCompleted: false,
    };
    const { data, error } = await supabase
      .from("TodoList")
      .insert([newTodoData])
      .select()
      .single();

    if (error) {
      console.log("error adding to do:", error);
    } else {
      console.log("berhasil nambah:", data);
      setTodoList((prev) => [...prev, data]);
      setNewTodo("");
    }
  };

  const completeTask = async (id: number, isCompleted: boolean) => {
    const { error } = await supabase
      .from("TodoList")
      .update({ isCompleted: !isCompleted })
      .eq("id", id);

    if (error) {
      console.log("error toggling task:", error);
    } else {
      const updatedTodoList = todoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo,
      );
      setTodoList(updatedTodoList);
    }
  }; // <- ini yang kurang

  const deleteTask = async (id: number) => {
    const { error } = await supabase.from("TodoList").delete().eq("id", id);

    if (error) {
      console.log("error deleting task:", error);
    } else {
      setTodoList((prev) => prev.filter((todo) => todo.id !== id));
    }
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">To do List</h1>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="New To Do..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <Button onClick={addTodo}>Add To Do Item</Button>
      </div>
      <ul>
        {todoList.map((todo) => (
          <li key={todo.id}>
            <span className={todo.isCompleted ? "line-through" : ""}>
              {todo.name}
            </span>
            <Button onClick={() => completeTask(todo.id, todo.isCompleted)}>
              {todo.isCompleted ? "Undo" : "Done"}
            </Button>
            <Button variant="destructive" onClick={() => deleteTask(todo.id)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
