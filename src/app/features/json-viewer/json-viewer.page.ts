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

  readonly exampleJsonString = `
  {
  "user": {
    "id": 42,
    "name": "Ada",
    "roles": ["admin", "editor"],
    "profile": {
      "age": 31,
      "country": "UK"
    }
  },
  "settings": {
    "theme": "dark",
    "notifications": {
      "email": true,
      "sms": false
    }
  },
  "lastLogin": "2026-01-30T18:45:12Z"
}

  `;
  readonly jsonInput = signal(this.exampleJsonString);
}
