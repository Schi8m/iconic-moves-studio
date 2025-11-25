import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.css']
})
export class BookingModalComponent {
  @Input() showModal = false;
  @Input() trainingDataId: number | null = null;
  @Output() modalClosed = new EventEmitter<void>();

  contactForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      secondName: ['', Validators.nullValidator],
      phone: ['', Validators.required]
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.contactForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
    this.modalClosed.emit();
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const formData = {
        ...this.contactForm.value,
        trainingId: this.trainingDataId
      }

      this.http.post('http://localhost:3000/api/bookings', formData)
        .subscribe({
          next: (response: any) => {
            this.isLoading = false;
            this.contactForm.reset();
            this.successMessage = 'Вы успешно записаны'
            setTimeout(() => {
                this.successMessage = '';
                this.closeModal();
            }, 2000);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = 'Ошибка при отправке. Попробуйте еще раз.';
            console.error('Error:', error);
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });
  }
}