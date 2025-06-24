import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { TaskService } from './helper/task.service';
import { Task } from './helper/task.model';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.scss'],
  standalone: true,
  imports: [FormsModule, NgForOf, RouterModule],
})
export class TaskListComponent {
  newTaskText = '';
  editingTask: Task | null = null;
  editedText: string = '';
  constructor(public taskService: TaskService) {}

  get tasks(): Task[] {
    return this.taskService.getTasks();
  }

  get isAddDisabled(): boolean {
    const trimmed = this.newTaskText.trim();
    return !trimmed || this.tasks.some(task => task.text === trimmed);
  }

  addTask(): void {
    this.taskService.addTask(this.newTaskText);
    this.newTaskText = '';
  }

  removeTask(task: Task): void {
    this.taskService.removeTask(task);
  }

  clearCompletedTasks(): void {
    this.taskService.clearCompleted();
  }

  clearAllTasks(): void {
    this.taskService.clearAll();
  }

  onCheckboxChange(event: Event, task: Task): void {
    const checkbox = event.target as HTMLInputElement;
    this.taskService.updateTaskChecked(task, checkbox.checked);
  }



  startEdit(task: Task) {
    this.editingTask = task;
    this.editedText = task.text;
  }

  confirmEdit(task: Task) {
    const trimmed = this.editedText.trim();
    if (trimmed && trimmed !== task.text) {
      task.text = trimmed;
    }
    this.editingTask = null;
  }



}

