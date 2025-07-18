import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TaskService} from '../../helper/tasks/task.service';
import {Component} from '@angular/core';
import {Task} from '../../helper/tasks/task.model';
import {HeaderComponent} from '../../navigation/header/header';
import {ConfirmService} from '../../reuse-components/confirm-dialog/confirm.service';

@Component({
  selector: 'app-completed-task',
  standalone: true,
  templateUrl: './completed-task.component.html',
  styleUrls: ['./completed-task.component.scss'],
  imports: [CommonModule, FormsModule, HeaderComponent],
})
export class CompletedTaskComponent {
  tasks: (Task & { _selected?: boolean })[] = [];
  loading = false;
  loadingMessage = '';

  constructor(private taskService: TaskService, private confirm: ConfirmService) {
  }

  ngOnInit() {
    this.loadCompletedTasks();
  }


  loadCompletedTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks.filter((t: Task) => t.pushed);
    });
  }

  remove(task: Task) {
    this.taskService.removeTask(task).subscribe(() => this.loadCompletedTasks());
  }

  reinsert() {
    const selected = this.tasks.filter(t => t._selected);
    this.taskService.reinsertFromCompleted(selected).subscribe(() => {
      this.loadCompletedTasks();
    });
  }

  clearAll() {
    this.loading = true;
    this.loadingMessage = 'Deleting completed tasks...';
    this.taskService.clearCompletedWithConfirm(this.confirm, () => this.loadCompletedTasks()).subscribe({
      next: () => {
        window.location.reload();
      },
      error: () => {
        this.loadingMessage = 'Something went wrong!';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  cancelClearAll() {
    this.loadingMessage = 'Cancelling...';
    this.taskService.cancelClearCompleted();
  }
}
