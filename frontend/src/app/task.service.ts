import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export type TaskChanges = Partial<Pick<Task, 'title' | 'description' | 'completed'>>;

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly url = '/tasks';

  list() {
    return this.http.get<Task[]>(this.url);
  }

  create(title: string, description: string) {
    return this.http.post<Task>(this.url, { title, description });
  }

  update(id: string, changes: TaskChanges) {
    return this.http.put<Task>(this.url + '/' + id, changes);
  }

  remove(id: string) {
    return this.http.delete<void>(this.url + '/' + id);
  }
}
