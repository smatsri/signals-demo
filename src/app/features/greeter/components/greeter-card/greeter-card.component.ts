import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-greeter-card',
  standalone: true,
  templateUrl: './greeter-card.component.html',
  styleUrl: './greeter-card.component.css',
})
export class GreeterCardComponent {
  /** Required: name to greet (signal input). */
  readonly name = input.required<string>();

  /** Optional: greeting title. Defaults to "Hello". */
  readonly title = input<string>('Hello');

  /** Emitted when the user clicks "Wave". */
  readonly wave = output<void>();

  /** Derived from inputs: full greeting text (signals in → computed → template out). */
  readonly greeting = computed(
    () => `${this.title()}, ${this.name()}!`
  );

  onWave(): void {
    this.wave.emit();
  }
}
