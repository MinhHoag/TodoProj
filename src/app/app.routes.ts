import { Routes } from '@angular/router';
import { TaskListComponent } from './app/task-list/task-list.component';
import { CompletedTaskComponent } from './app/completed-task/completed-task.component';
import {Table} from './app/table/table';

export const routes: Routes = [
  { path: 'task-list', component: TaskListComponent },
  { path: '', redirectTo: 'task-list', pathMatch: 'full' },
  { path: 'completed-task', component: CompletedTaskComponent },
  { path: 'table', component: Table },
];
