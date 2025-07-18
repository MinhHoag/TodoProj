import { Component, OnInit } from '@angular/core';
import { Task } from '../../helper/tasks/task.model';
import { CommonModule, DatePipe } from '@angular/common';
import { TaskService } from '../../helper/tasks/task.service';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../reuse-components/pagination/pagination.component';
import { InlineEditComponent } from '../../reuse-components/inline-edit/inline-edit.component';
import { HeaderComponent } from '../../navigation/header/header';

@Component({
  selector: 'app-task-table',
  standalone: true,
  templateUrl: './table.html',
  styleUrls: ['./table.scss'],
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
  currentPage = 1;
  pageSize = 10;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: tasks => {
        this.tasks = tasks;
        this.userList = [...tasks];
        this.currentPage = 1;
      },
      error: (err: any) => console.error('Error fetching data:', err)
    });
  }

  get pagedTasks(): Task[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.userList.slice(start, start + this.pageSize);
  }

  onTaskTextChange(task: Task, newText: string | number): void {
    const updatedText = String(newText);
    if (task.text === updatedText) return;

    this.taskService.updateTaskText(task, updatedText).subscribe({
      next: () => {
        task.text = updatedText;
      },
      error: (err: any) => console.error('Failed to update task:', err)
    });
  }

  deleteTask(task: Task): void {
    this.taskService.removeTask(task).subscribe({
      next: () => {
        this.userList = this.userList.filter(t => t !== task);
        this.tasks = this.tasks.filter(t => t !== task);
      },
      error: (err: any) => console.error('Failed to delete task:', err)
    });
  }

  onCheckedChange(task: Task, checked: boolean): void {
    this.taskService.updateTaskChecked(task, checked).subscribe({
      next: () => {
        task.checked = checked;
      },
      error: (err: any) => console.error('Failed to update checked status:', err)
    });
  }

  onPageChange(event: { page: number; pageSize: number }) {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
  }

  protected readonly Math = Math;
}
