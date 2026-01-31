import {
  Component,
  computed,
  forwardRef,
  inject,
  input,
  output,
  type Signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import type { JsonValueView, TreeNode } from './json-viewer.model';

@Component({
  selector: 'app-json-node',
  standalone: true,
  templateUrl: './json-node.component.html',
  styleUrl: './json-node.component.css',
  imports: [forwardRef(() => JsonNodeComponent)],
})
export class JsonNodeComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly node = input.required<TreeNode>();
  readonly collapsedPaths = input.required<Signal<Set<string>>>();
  readonly pathToggled = output<string>();

  readonly isExpandable = computed(
    () => this.node().type === 'object' || this.node().type === 'array'
  );

  readonly isCollapsed = computed(() => {
    const p = this.node().path;
    if (p === '') return false;
    return this.collapsedPaths()().has(p);
  });

  readonly children = computed(() => {
    const n = this.node();
    return n.type === 'object' || n.type === 'array' ? n.children : [];
  });

  readonly valueView = computed((): JsonValueView => {
    const n = this.node();
    if (n.type === 'object' || n.type === 'array') {
      return { kind: 'default' };
    }
    const v = (n as Extract<TreeNode, { valueView: JsonValueView }>).valueView;
    return v ?? { kind: 'default' };
  });

  readonly formattedValue = computed(() => {
    const n = this.node();
    if (n.type === 'string') return `"${n.value}"`;
    if (n.type === 'number' || n.type === 'boolean') return String(n.value);
    if (n.type === 'null') return 'null';
    return '';
  });

  protected safeUrl(href: string) {
    return this.sanitizer.bypassSecurityTrustUrl(href);
  }

  protected urlHref(view: JsonValueView): string {
    return view.kind === 'url' ? view.href : '';
  }

}
