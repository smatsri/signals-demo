import {
  Component,
  forwardRef,
  input,
  type Signal,
} from '@angular/core';
import type { TreeNode } from './json-viewer.model';

@Component({
  selector: 'app-json-node',
  standalone: true,
  templateUrl: './json-node.component.html',
  styleUrl: './json-node.component.css',
  imports: [forwardRef(() => JsonNodeComponent)],
})
export class JsonNodeComponent {
  readonly node = input.required<TreeNode>();
  readonly path = input.required<string>();
  readonly depth = input<number>(0);
  readonly collapsedPaths = input.required<Signal<Set<string>>>();
  readonly toggle = input.required<(path: string) => void>();

  protected childPath(child: TreeNode): string {
    const p = this.path();
    const key = child.key ?? '';
    return p === '' ? String(key) : `${p}.${key}`;
  }

  protected isCollapsed(path: string): boolean {
    if (path === '') return false;
    return this.collapsedPaths()().has(path);
  }

  protected isExpandable(node: TreeNode): node is TreeNode & { type: 'object' | 'array'; children: TreeNode[] } {
    return node.type === 'object' || node.type === 'array';
  }

  protected getChildren(node: TreeNode): TreeNode[] {
    return node.type === 'object' || node.type === 'array' ? node.children : [];
  }

  protected formatValue(node: TreeNode): string {
    if (node.type === 'string') {
      return `"${node.value}"`;
    }
    if (node.type === 'number' || node.type === 'boolean') {
      return String(node.value);
    }
    if (node.type === 'null') {
      return 'null';
    }
    return '';
  }
}
