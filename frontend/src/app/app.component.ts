import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Task, TaskChanges, TaskService } from './task.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private readonly api = inject(TaskService);
  readonly tasks = signal<Task[]>([]);
  readonly busy = signal(false);
  readonly loaded = signal(false);
  readonly error = signal('');
  newTitle = '';
  newDescription = '';
  editId: string | null = null;
  editTitle = '';
  editDescription = '';

  ngOnInit() {
    void this.load();
  }

  load() {
    return this.run(async () => {
      this.tasks.set(await firstValueFrom(this.api.list()));
      this.loaded.set(true);
    });
  }

  add() {
    const title = this.newTitle.trim();
    if (!title) return;
    return this.run(async () => {
      const task = await firstValueFrom(this.api.create(title, this.newDescription.trim()));
      this.tasks.update(tasks => [...tasks, task]);
      this.newTitle = '';
      this.newDescription = '';
    });
  }

  startEdit(task: Task) {
    this.editId = task._id;
    this.editTitle = task.title;
    this.editDescription = task.description ?? '';
  }

  saveEdit(task: Task) {
    const title = this.editTitle.trim();
    if (!title) return;
    return this.run(async () => {
      await this.update(task, { title, description: this.editDescription.trim() });
      this.editId = null;
    });
  }

  toggle(task: Task) {
    return this.run(() => this.update(task, { completed: !task.completed }));
  }

  remove(task: Task) {
    return this.run(async () => {
      await firstValueFrom(this.api.remove(task._id));
      this.tasks.update(tasks => tasks.filter(item => item._id !== task._id));
      if (this.editId === task._id) this.editId = null;
    });
  }

  private async update(task: Task, changes: TaskChanges) {
    // Le serveur renvoie la version enregistrée dans MongoDB.
    const saved = await firstValueFrom(this.api.update(task._id, changes));
    this.tasks.update(tasks => tasks.map(item => item._id === saved._id ? saved : item));
  }

  private async run(action: () => Promise<void>) {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      await action();
    } catch (error) {
      this.error.set(error instanceof HttpErrorResponse && error.error?.message
        ? error.error.message
        : 'Impossible de joindre l’API. Vérifiez que le serveur est démarré.');
    } finally {
      this.busy.set(false);
    }
  }
}
