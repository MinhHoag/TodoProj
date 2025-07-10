import {Component, OnInit} from '@angular/core';
import {Task} from '../../helper/task.model';
import {CommonModule, DatePipe} from '@angular/common';

import {TaskApiService} from '../../helper/task-api.service';
import {FormsModule} from '@angular/forms';
import {PaginationComponent} from '../../reuse-components/pagination/pagination.component';
import {InlineEditComponent} from '../../reuse-components/inline-edit/inline-edit.component';
import {HeaderComponent} from '../../navigation/header/header';

@Component({
  selector: 'app-task-table',
  styleUrls: ['./table.scss'],
  templateUrl: './table.html',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule,
    FormsModule,
    PaginationComponent,

    InlineEditComponent,
    HeaderComponent
  ]
})
export class TaskTableComponent implements OnInit {
  tasks: Task[] = [];
  userList: Task[] = [];

  constructor(private taskService: TaskApiService) {
  }

  currentPage = 1;
  pageSize = 10;


  get pagedTasks(): Task[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    return this.userList.slice(start, end);
  }

  onTaskTextChange(task: Task, newText: string | number): void {
    const updatedText = String(newText);
    if (task.text === updatedText) return;

    const updatedTask = {...task, text: updatedText};

    this.taskService.updateTask(updatedTask).subscribe({
      next: () => {
        task.text = updatedText; // ✅ update local copy
      },
      error: err => console.error('Failed to update task:', err)
    });
  }

  deleteTask(task: Task): void {
    if (!task.id) return;

    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        // ✅ remove task from local list
        this.userList = this.userList.filter(t => t.id !== task.id);
        this.tasks = this.tasks.filter(t => t.id !== task.id);
      },
      error: err => console.error('Failed to delete task:', err)
    });
  }

  onCheckedChange(task: Task, checked: boolean): void {
    const updatedTask = {...task, checked};

    this.taskService.updateTask(updatedTask).subscribe({
      next: () => {
        task.checked = checked; // ✅ update local value for immediate UI update
      },
      error: err => console.error('Failed to update checked status:', err)
    });
  }


  onPageChange(event: { page: number; pageSize: number }) {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
  }


  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getList().subscribe({
      next: (data: any) => {
        this.tasks = data;
        this.userList = [...data];
        this.currentPage = 1;
      },
      error: err => console.error('Error fetching data:', err)
    });
  }


  protected readonly Math = Math;
}



