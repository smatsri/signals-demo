import { Pipe, type PipeTransform } from '@angular/core';
import type { JsonValueView, TreeNode } from './json-viewer.model';

const URL_PATTERN = /^https?:\/\/\S+$/;

@Pipe({
  name: 'jsonValueView',
  standalone: true,
  pure: true,
})
export class JsonValueViewPipe implements PipeTransform {
  transform(node: TreeNode): JsonValueView {
    if (node.type !== 'string') {
      return { kind: 'default' };
    }
    const value = node.value as string;
    const hint = node.valueHint;
    if (hint === 'url' || (typeof value === 'string' && URL_PATTERN.test(value))) {
      return { kind: 'url', href: value };
    }
    if (hint === 'date') {
      return { kind: 'date' };
    }
    return { kind: 'default' };
  }
}
