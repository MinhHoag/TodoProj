import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TaskService} from '../../helper/task.service';
import {Component} from '@angular/core';
import {Task} from '../../helper/task.model';
import {RouterLink} from '@angular/router';
import {HeaderComponent} from '../../navigation/header/header';

@Component({
  selector: 'app-completed-task',
  standalone: true,
  templateUrl: './completed-task.component.html',
  styleUrls: ['./completed-task.component.scss'],
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent],
})
export class CompletedTaskComponent {
  tempt: Task[] = [];

  constructor(public taskService: TaskService) {
    this.refreshLocalCompleted();
  }

  get tasks() {
    return this.tempt;
  }

  remove(task: Task) {
    this.taskService.removeCompletedTask(task);
    this.tempt = this.tempt.filter(t => t.id !== task.id);
  }

  reinsert() {
    const toReinsert = this.tempt.filter(task => task.checked);
    this.taskService.reinsertFromCompleted(toReinsert);
    this.tempt = this.tempt.filter(task => !task.checked); // remove from local
  }

  clearAll() {
    this.taskService.clearAllCompleted();
    this.tempt = [];
  }

  private refreshLocalCompleted() {
    const completed = this.taskService.getCompletedTasks();
    this.tempt = completed.map(task => ({ ...task, checked: false }));
  }
}
