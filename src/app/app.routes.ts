import { Routes } from '@angular/router';
import { TaskListComponent } from './app/Pages/task-list/task-list.component';
import { CompletedTaskComponent } from './app/Pages/completed-task/completed-task.component';
import { TaskTableComponent } from './app/Pages/table/table';
import { LoginComponent } from './app/Pages/login/login.component';

import { UserIdGuard } from './app/helper/user-id.guard';
import { UserRedirectGuard } from './app/helper/user-redirect.guard';
import { DummyRedirectComponent } from './app/helper/dummy-redirect.component'; // <- add this

export const routes: Routes = [
  // 🔁 Dynamically redirect root based on login
  {
    path: '',
    canActivate: [UserRedirectGuard],
    component: DummyRedirectComponent,
    pathMatch: 'full'
  },

  { path: 'login', component: LoginComponent },
  { path: 'task-list', redirectTo: 'task-list/guest', pathMatch: 'full' },

  { path: 'task-list/:userId', component: TaskListComponent, canActivate: [UserIdGuard] },
  { path: 'table/:userId', component: TaskTableComponent, canActivate: [UserIdGuard] },
  { path: 'completed-task/:userId', component: CompletedTaskComponent, canActivate: [UserIdGuard] },

  { path: '**', redirectTo: '' }
];
