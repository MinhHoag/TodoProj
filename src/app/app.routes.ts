//app.route.ts
import { UserIdResolver } from './app/helper/user-id.resolver';
import {TaskListComponent} from './app/Pages/task-list/task-list.component';
import {Routes} from '@angular/router';
import {CompletedTaskComponent} from './app/Pages/completed-task/completed-task.component';
import {TaskTableComponent} from './app/Pages/table/table'; // adjust path

import { UserRedirectGuard } from './app/helper/user-redirect.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'task-list',
    pathMatch: 'full'
  },
  {
    path: 'task-list',
    canActivate: [UserRedirectGuard]
  },
  {
    path: 'task-list/:userId',
    component: TaskListComponent,
    resolve: { _: UserIdResolver }
  },
  {
    path: 'completed-task/:userId',
    component: CompletedTaskComponent,
    resolve: { _: UserIdResolver }
  },
  {
    path: 'table/:userId',
    component: TaskTableComponent,
    resolve: { _: UserIdResolver }
  },
  {
    path: '**',
    redirectTo: 'task-list'
  }
];
