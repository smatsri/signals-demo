import { Component, computed, effect, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

const CONTACT_DRAFT_KEY = 'signals-demo-contact-draft';

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
}

function getStoredDraft(): Partial<ContactPayload> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(CONTACT_DRAFT_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<ContactPayload>;
  } catch {
    return {};
  }
}

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.page.html',
  styleUrl: './contact.page.css',
})
export class ContactPage {
  readonly form = new FormGroup({
    name: new FormControl<string>('', { validators: Validators.required }),
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl<string>(''),
    message: new FormControl<string>('', {
      validators: [Validators.required, Validators.minLength(10)],
    }),
  });

  /** Form value as a signal (Reactive Forms + toSignal). */
  readonly formValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue() as ContactPayload,
  });

  /** Form status as a signal. */
  readonly formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  /** Derived: is the form valid? */
  readonly isFormValid = computed(() => this.formStatus() === 'VALID');

  /** Derived: message length for character count. */
  readonly messageLength = computed(() => {
    const value = this.formValue();
    return (value?.message ?? '').length;
  });

  /** Set after successful submit (demo: no real HTTP). */
  readonly submitted = signal(false);

  /** Last submitted payload, for display. */
  readonly lastPayload = signal<ContactPayload | null>(null);

  constructor() {
    const draft = getStoredDraft();
    if (draft.name != null) this.form.controls.name.setValue(draft.name);
    if (draft.email != null) this.form.controls.email.setValue(draft.email);
    if (draft.phone != null) this.form.controls.phone.setValue(draft.phone);
    if (draft.message != null) this.form.controls.message.setValue(draft.message);

    effect(() => {
      if (typeof localStorage === 'undefined') return;
      const value = this.formValue();
      if (value) {
        localStorage.setItem(CONTACT_DRAFT_KEY, JSON.stringify(value));
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue() as ContactPayload;
    this.lastPayload.set(payload);
    this.submitted.set(true);
    this.form.reset();
  }

  sendAnother(): void {
    this.submitted.set(false);
    this.lastPayload.set(null);
  }
}
