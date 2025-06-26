import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { TaskService } from '../../helper/task.service';
import { Task } from '../../helper/task.model';
import { RouterModule } from '@angular/router';
import {PaginationComponent} from '../../reuse-components/pagination/pagination.component';
import {InlineEditComponent} from '../../reuse-components/inline-edit/inline-edit.component';
import {ConfirmService} from '../../reuse-components/confirm-dialog/confirm.service';
import {MatButton} from '@angular/material/button';
import {HeaderComponent} from '../../navigation/header/header';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.scss'],
  standalone: true,
  imports: [FormsModule, NgForOf, RouterModule, PaginationComponent, InlineEditComponent, HeaderComponent],
})
export class TaskListComponent {
  newTaskText = '';



  constructor(private confirm: ConfirmService, private taskService: TaskService) {}

  currentPage = 1;
  pageSize = 5;
  get pagedTasks(): Task[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.tasks.slice(start, start + this.pageSize);
  }

  onPageChange(event: { page: number; pageSize: number }) {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
  }

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


  updateTaskText(task: Task, newText: string | number): void {
    this.taskService.updateTaskText(task, String(newText));
  }


  clearAllWithConfirm() {
    this.confirm.open('Are you sure you want to clear all tasks?')
      .subscribe(confirmed => {
        if (confirmed) {
          this.taskService.clearAll();
        }
      });
  }

  onEnter(input: HTMLInputElement): void {
    if (this.isAddDisabled) {
      input.select(); // ✅ highlight all text in the input box
    } else {
      this.addTask();
    }
  }



  onCheckboxChange(event: Event, task: Task): void {
    const checkbox = event.target as HTMLInputElement;
    this.taskService.updateTaskChecked(task, checkbox.checked);
  }







}

