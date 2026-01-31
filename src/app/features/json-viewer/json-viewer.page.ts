import { Component, signal } from '@angular/core';
import { JsonViewerComponent } from '../../shared/components/json-viewer/json-viewer.component';

@Component({
  selector: 'app-json-viewer-page',
  standalone: true,
  templateUrl: './json-viewer.page.html',
  styleUrl: './json-viewer.page.css',
  imports: [JsonViewerComponent],
})
export class JsonViewerPage {
  protected readonly jsonInput = signal('');
}
