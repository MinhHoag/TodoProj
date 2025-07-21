import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {TaskService} from '../../helper/tasks/task.service';
import {Task} from '../../helper/tasks/task.model';
import {RouterModule} from '@angular/router';
import {PaginationComponent} from '../../reuse-components/pagination/pagination.component';
import {InlineEditComponent} from '../../reuse-components/inline-edit/inline-edit.component';
import {ConfirmService} from '../../reuse-components/confirm-dialog/confirm.service';
import {HeaderComponent} from '../../navigation/header/header';
import {sortTasks} from '../../helper/tasks/task.utils';


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
  searchQuery = '';
  filteredTasks: Task[] = [];
  currentPage = 1;
  pageSize = 10;
  loading = false;
  loadingMessage = '';

  constructor(private confirm: ConfirmService, private taskService: TaskService) {
  }

//api
  get pagedTasks(): Task[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTasks.slice(start, start + this.pageSize);
  }

  //check if task empty or existed
  get isAddDisabled(): boolean {
    const trimmed = this.newTaskText.trim();
    return !trimmed || this.tasks.some(task => task.text === trimmed);
  }

  //updating data

  ngOnInit() {
    setTimeout(() => {
      console.log('isGuest =', this.taskService['guestService'].isGuest());
      this.loadTasks();
    });
  }

  //turning page
  onPageChange(event: { page: number; pageSize: number }) {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
  }

  //ticking checkboxes
  onCheckboxChange(event: Event, task: Task): void {
    const checkbox = event.target as HTMLInputElement;
    const checked = checkbox.checked;

    this.taskService.updateTaskChecked(task, checked).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: err => console.error('Failed to update checkbox:', err)
    });
  }

    loadTasks() {
    this.taskService.getTasks().subscribe(all => {
      this.tasks = sortTasks(all.filter(t => !t.pushed));
      this.applySearch(); // filter based on current query
    });
  }

//search task
  applySearch() {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredTasks = !query
      ? [...this.tasks]
      : this.tasks.filter(task => task.text.toLowerCase().includes(query));
  }

//remove button
  removeTask(task: Task): void {
    this.taskService.deleteWithLoading(
      task,
      val => this.loading = val,
      msg => this.loadingMessage = msg
    ).subscribe(() => this.loadTasks());
  }

//clear all
  clearAllWithConfirm(): void {
    this.loading = true;
    this.loadingMessage = `Task(s) remaining... ${this.tasks.length}`;

    this.taskService.clearActiveWithConfirm(
      this.confirm,
      () => {
        this.loadTasks();
        this.loadingMessage = `Task(s) remaining... ${this.tasks.length}`;
      }
    ).subscribe({
      next: () => {
        window.location.reload();
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

  //cancel clear all
  cancelLoading() {
    this.taskService.cancelClear();
    this.loadingMessage = 'Cancelling...';
    setTimeout(() => {
      this.loading = false;
      this.loadingMessage = '';
    }, 300);
  }

//push to completed task
  pushCompletedTasks(): void {
    this.taskService.pushCompleted().subscribe(() => {
      this.loadTasks();
    });
  }

//add task input behavior
  addTask(): void {
    this.taskService.addTask(this.newTaskText).subscribe(() => {
      this.loadTasks();
      this.newTaskText = '';
    });
  }

  //change task
  updateTaskText(task: Task, newText: string | number): void {
    this.taskService.updateTaskText(task, String(newText)).subscribe(() => {
      this.loadTasks();
    });
  }


  onEnter(input: HTMLInputElement): void {
    if (this.isAddDisabled) {
      input.select();
    } else {
      this.addTask();
    }
  }


}

