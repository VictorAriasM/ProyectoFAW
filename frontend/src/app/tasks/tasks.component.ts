import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';

type User = {
  id: number;
  email: string;
  birthday: string;
  gender: string;
  name: string;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  priority: string;
  created_at: string;
  owner: number;
};

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule, ModalComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  user: User | null = null;
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  showModal = false;

  title = '';
  description = '';
  priority = '';

  //filters
  searchFilter = '';
  priorityFilter = '';
  sortFilter = 'asc';

  constructor(private router: Router) {
    const user = localStorage.getItem('user') || null;
    if (user) {
      this.user = JSON.parse(user);
    } else {
      this.router.navigate(['/login']);
    }
  }

  async ngOnInit() {
    if (this.user) {
      const response = await fetch(
        `http://localhost:5000/api/tasks?owner=${this.user.id}&sort=${
          this.sortFilter
        }${this.priorityFilter ? '&priority=' + this.priorityFilter : ''}${
          this.searchFilter ? '&search=' + this.searchFilter : ''
        }&status=ACTIVA`
      );
      const { data } = await response.json();
      this.tasks = data.tasks;
    }
  }

  async refetch() {
    await this.ngOnInit();
  }

  async createTask() {
    const response = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: this.title,
        description: this.description,
        priority: this.priority,
        owner: this.user?.id,
      }),
    });

    if (response.ok) {
      const { data } = await response.json();
      this.tasks.push(data.task);
      this.title = '';
      this.description = '';
      this.priority = '';

      await this.refetch();
    } else {
      alert('Invalid task');
    }
  }

  formatElapsedTime(date: string) {
    const now = new Date();
    const createdDate = new Date(date);
    const elapsedMilliseconds = now.getTime() - createdDate.getTime();

    const seconds = Math.floor(elapsedMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    const text = 'Creado hace';
    if (weeks > 0) {
      return `${text} ${weeks} semana${weeks > 1 ? 's' : ''}`;
    } else if (days > 0) {
      return `${text} ${days} día${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${text} ${hours} hora${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${text} ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else {
      return `${text} ${seconds} segundo${seconds > 1 ? 's' : ''}`;
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  setSelectedTask(task: Task) {
    this.selectedTask = task;
    this.showModal = true;
    setTimeout(() => {
      const currentModal = document.getElementById(`modal-${task.id}`);
      if (currentModal) {
        currentModal.style.display = 'flex';
      }
    }, 100);
  }

  closeModal() {
    this.showModal = false;
  }

  async finishTask(task: Task) {
    const response = await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'FINALIZADA',
      }),
    });

    if (response.ok) {
      await this.refetch();
    } else {
      alert('Invalid task');
    }
  }
}
