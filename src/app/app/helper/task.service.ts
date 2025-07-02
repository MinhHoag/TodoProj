// task.service.ts
import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { addTask, clearAllTasks, clearCompletedTasks, removeTask, sortTasks } from './task.utils';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = [];
  private completedTasks: Task[] = [];
  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(newTaskText: string): void {
    this.tasks = addTask(this.tasks, newTaskText);
  }

  removeTask(task: Task): void {
    this.tasks = removeTask(this.tasks, task);
  }

  clearCompleted(): void {
    const completed = this.tasks.filter(task => task.checked);
    this.completedTasks = [...this.completedTasks, ...completed]; // 👈 STORE them
    this.tasks = this.tasks.filter(task => !task.checked);
  }

  clearAll(): void {
    this.tasks = clearAllTasks();
  }

  updateTaskChecked(task: Task, checked: boolean): void {
    task.checked = checked;
    this.tasks = sortTasks(this.tasks);
  }
  clearAllCompleted(): void {
    this.completedTasks = [];
  }

  updateTaskText(task: Task, newText: string): void {
    task.text = newText;
  }


  getCompletedTasks(): Task[] {
    return [...this.completedTasks];
  }


  removeCompletedTask(task: Task): void {
    this.completedTasks = this.completedTasks.filter(t => t.id !== task.id);
  }



  reinsertFromCompleted(tasks: Task[]) {
    tasks.forEach(task => {
      const newTask = { ...task, checked: false };
      this.tasks.push(newTask);
      this.completedTasks = this.completedTasks.filter(t => t.id !== task.id);
    });
  }


}
