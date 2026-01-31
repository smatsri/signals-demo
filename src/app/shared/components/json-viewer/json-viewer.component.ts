import { Component, computed, input, signal } from '@angular/core';
import {
  parseJsonToTree,
  type TreeNode,
} from './json-viewer.model';
import { JsonNodeComponent } from './json-node.component';

@Component({
  selector: 'app-json-viewer',
  standalone: true,
  templateUrl: './json-viewer.component.html',
  styleUrl: './json-viewer.component.css',
  imports: [JsonNodeComponent],
})
export class JsonViewerComponent {
  readonly jsonString = input<string>('');

  readonly parseResult = computed(() => parseJsonToTree(this.jsonString()));

  readonly collapsedPaths = signal<Set<string>>(new Set());

  readonly invalidError = computed(() => {
    const result = this.parseResult();
    return 'error' in result ? result.error : undefined;
  });

  readonly rootNode = computed(() => {
    const result = this.parseResult();
    return 'tree' in result ? result.tree : undefined;
  });

  protected toggle(path: string): void {
    this.collapsedPaths.update((set) => {
      const next = new Set(set);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }
}
