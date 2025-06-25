import { Routes } from '@angular/router';
import { TaskListComponent } from './app/Pages/task-list/task-list.component';
import { CompletedTaskComponent } from './app/Pages/completed-task/completed-task.component';
import {TaskTableComponent} from './app/Pages/table/table';

export const routes: Routes = [
  { path: 'task-list', component: TaskListComponent },
  { path: '', redirectTo: 'task-list', pathMatch: 'full' },
  { path: 'completed-task', component: CompletedTaskComponent },
  { path: 'table', component: TaskTableComponent },
];
