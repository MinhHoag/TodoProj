import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TaskService} from '../../helper/task.service';
import {Component} from '@angular/core';
import {Task} from '../../helper/task.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-completed-task',
  standalone: true,
  templateUrl: './completed-task.component.html',
  styleUrls: ['./completed-task.component.scss'],
  imports: [CommonModule, FormsModule, RouterLink],
})
export class CompletedTaskComponent {
  constructor(public taskService: TaskService) {
  }

  get tasks() {
    return this.taskService.getCompletedTasks();
  }

  remove(task: Task) {
    this.taskService.removeCompletedTask(task);
  }

  reinsert() {
    this.taskService.reinsertFromCompleted(true);
  }

  clearAll() {
    this.taskService.clearAllCompleted();

  }
}
