import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../tasks/tasks.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() show = false;
  @Input() task: Task | null = null;
  @Output() onAccept = new EventEmitter<Task>();
  @Output() onClose = new EventEmitter();

  closeModal() {
    this.show = false;
    this.onClose.emit();
  }

  accept() {
    if (this.task) {
      this.onAccept.emit(this.task);
      this.closeModal();
    }
  }
}
