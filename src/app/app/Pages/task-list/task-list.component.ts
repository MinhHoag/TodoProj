import {Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { TaskService } from '../../helper/task.service';
import { Task } from '../../helper/task.model';
import { RouterModule } from '@angular/router';
import {PaginationComponent} from '../../reuse-components/pagination/pagination.component';
import {InlineEditComponent} from '../../reuse-components/inline-edit/inline-edit.component';
import {ConfirmService} from '../../reuse-components/confirm-dialog/confirm.service';
import {MatButton} from '@angular/material/button';
import {HeaderComponent} from '../../navigation/header/header';
import {confirmAndRun} from '../../helper/task.utils';
import {tap} from 'rxjs';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.scss'],
  standalone: true,
  imports: [FormsModule, NgForOf, RouterModule, PaginationComponent, InlineEditComponent, HeaderComponent, NgClass, NgIf],
})
export class TaskListComponent implements OnInit {
  newTaskText = '';
  tasks: Task[] = [];
  ngOnInit() {
    this.loadTasks();
  }




  constructor(private confirm: ConfirmService, private taskService: TaskService) {}

  currentPage = 1;
  pageSize = 10;
  get pagedTasks(): Task[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.tasks.slice(start, start + this.pageSize);
  }

  onPageChange(event: { page: number; pageSize: number }) {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
  }




  loadTasks() {
    this.taskService.getTasks().subscribe(all => {
      this.tasks = all.filter(t => !this.taskService.hasBeenPushed(t));
    });
  }


  loading = false;
  loadingMessage = '';
  cancelled = false;


  clearAllWithConfirm(): void {
    this.cancelled = false;
    this.loading = true;
    this.loadingMessage = 'Task(s) remaining...';

    this.taskService.clearActiveWithConfirm(
      this.confirm,
      () => this.loadTasks(),           // update UI on each delete
      () => this.cancelled              // stop if user cancels
    ).subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loadingMessage = 'Something went wrong!';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }


  cancelLoading() {
    this.taskService.cancelClear(); // ✅ trigger cancel
    this.loadingMessage = 'Cancelling...';
    setTimeout(() => {
      this.loading = false;
      this.loadingMessage = '';
    }, 300); // Optional slight delay to allow UI to update
  }








  get isAddDisabled(): boolean {
    const trimmed = this.newTaskText.trim();
    return !trimmed || this.tasks.some(task => task.text === trimmed);
  }

  addTask(): void {
    this.taskService.addTask(this.newTaskText).subscribe(() => {
      this.loadTasks();
      this.newTaskText = '';
    });
  }


  removeTask(task: Task): void {
    this.taskService.removeTask(task).subscribe(() => {
      this.loadTasks();
    });
  }

  clearCompletedTasks(): void {
    this.taskService.clearCompleted().subscribe(() => {
      this.loadTasks(); // refresh active list
    });
  }


  updateTaskText(task: Task, newText: string | number): void {
    this.taskService.updateTaskText(task, String(newText)).subscribe(() => {
      this.loadTasks();
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
    const checked = checkbox.checked;

    this.taskService.updateTaskChecked(task, checked).subscribe({
      next: () => {
        this.loadTasks(); // ✅ refresh local task list so clearCompleted() sees updated flags
      },
      error: err => console.error('Failed to update checkbox:', err)
    });
  }


  generateDebugTasks(): void {
    this.taskService.generateSampleTasks().subscribe(() => {
      this.loadTasks(); // reload task list after generation
    });
  }










}

