export type PrimitiveType = 'string' | 'number' | 'boolean' | 'null';

export type ValueHint = 'url' | 'date';

export type JsonValueView =
  | { kind: 'url'; href: string }
  | { kind: 'date' }
  | { kind: 'default' };

export type TreeNode =
  | {
    key: string | null;
    path: string;
    depth: number;
    type: PrimitiveType;
    value: string | number | boolean | null;
    valueHint?: ValueHint;
    valueView: JsonValueView;
  }
  | {
    key: string | null;
    path: string;
    depth: number;
    type: 'object' | 'array';
    children: TreeNode[];
  };

const URL_PATTERN = /^https?:\/\/\S+$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}/;

function getValueHint(str: string): ValueHint | undefined {
  if (URL_PATTERN.test(str)) return 'url';
  if (ISO_DATE_PATTERN.test(str)) return 'date';
  return undefined;
}

function getValueView(
  type: PrimitiveType,
  value: string | number | boolean | null,
  valueHint?: ValueHint
): JsonValueView {
  if (type !== 'string') {
    return { kind: 'default' };
  }
  const str = value as string;
  if (valueHint === 'url' || URL_PATTERN.test(str)) {
    return { kind: 'url', href: str };
  }
  if (valueHint === 'date') {
    return { kind: 'date' };
  }
  return { kind: 'default' };
}

function buildNode(key: string | null, value: unknown, path: string, depth: number): TreeNode {
  if (value === null) {
    return { key, path, depth, type: 'null', value: null, valueView: { kind: 'default' } };
  }
  if (typeof value === 'boolean') {
    return { key, path, depth, type: 'boolean', value, valueView: { kind: 'default' } };
  }
  if (typeof value === 'number') {
    return { key, path, depth, type: 'number', value, valueView: { kind: 'default' } };
  }
  if (typeof value === 'string') {
    const valueHint = getValueHint(value);
    const valueView = getValueView('string', value, valueHint);
    return valueHint
      ? { key, path, depth, type: 'string', value, valueHint, valueView }
      : { key, path, depth, type: 'string', value, valueView };
  }
  if (Array.isArray(value)) {
    const children: TreeNode[] = value.map((item, i) =>
      buildNode(String(i), item, path, depth + 1)
    );
    return { key, path, depth, type: 'array', children };
  }
  if (typeof value === 'object' && value !== null) {
    const children: TreeNode[] = Object.entries(value).map(([k, v]) =>
      buildNode(k, v, path, depth + 1)
    );
    return { key, path, depth, type: 'object', children };
  }
  return { key, path, depth, type: 'null', value: null, valueView: { kind: 'default' } };
}

export type ParseResult = { tree: TreeNode } | { error: string };

/**
 * Parses a JSON string and returns either a root TreeNode or an error message.
 */
export function parseJsonToTree(jsonString: string): ParseResult {
  const trimmed = jsonString.trim();
  if (trimmed === '') {
    return { error: 'Please enter JSON' };
  }
  try {
    const parsed: unknown = JSON.parse(trimmed);
    return { tree: buildNode(null, parsed, '', 0) };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { error: `Invalid JSON: ${message}` };
  }
}
