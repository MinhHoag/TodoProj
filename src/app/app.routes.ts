import {Routes} from '@angular/router';
import {TaskListComponent} from './app/Pages/task-list/task-list.component';
import {CompletedTaskComponent} from './app/Pages/completed-task/completed-task.component';
import {TaskTableComponent} from './app/Pages/table/table';
import {LoginComponent} from './app/Pages/login/login.component';

import {UserIdGuard} from './app/helper/mode(s)/user/user-id.guard';
import {UserRedirectGuard} from './app/helper/mode(s)/user/user-redirect.guard';
import {DummyRedirectComponent} from './app/helper/mode(s)/guest/dummy-redirect.component';
import {NotFound} from './app/Pages/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    canActivate: [UserRedirectGuard],
    component: DummyRedirectComponent,
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'task-list',
    redirectTo: 'task-list/guest',
    pathMatch: 'full'
  },

  {
    path: 'task-list/:username',
    component: TaskListComponent,
    canActivate: [UserIdGuard]
  },
  {
    path: 'table/:username',
    component: TaskTableComponent,
    canActivate: [UserIdGuard]
  },
  {
    path: 'completed-task/:username',
    component: CompletedTaskComponent,
    canActivate: [UserIdGuard]
  },

  {
    path: '**',
    component: NotFound
  }
];
