export type PrimitiveType = 'string' | 'number' | 'boolean' | 'null';

export type ValueHint = 'url' | 'date';

export type JsonValueView =
  | { kind: 'url'; href: string }
  | { kind: 'date' }
  | { kind: 'default' };

export type TreeNode =
  | {
      key: string | null;
      type: PrimitiveType;
      value: string | number | boolean | null;
      valueHint?: ValueHint;
    }
  | {
      key: string | null;
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

function buildNode(key: string | null, value: unknown): TreeNode {
  if (value === null) {
    return { key, type: 'null', value: null };
  }
  if (typeof value === 'boolean') {
    return { key, type: 'boolean', value };
  }
  if (typeof value === 'number') {
    return { key, type: 'number', value };
  }
  if (typeof value === 'string') {
    const valueHint = getValueHint(value);
    return valueHint
      ? { key, type: 'string', value, valueHint }
      : { key, type: 'string', value };
  }
  if (Array.isArray(value)) {
    const children: TreeNode[] = value.map((item, i) =>
      buildNode(String(i), item)
    );
    return { key, type: 'array', children };
  }
  if (typeof value === 'object' && value !== null) {
    const children: TreeNode[] = Object.entries(value).map(([k, v]) =>
      buildNode(k, v)
    );
    return { key, type: 'object', children };
  }
  return { key, type: 'null', value: null };
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
    return { tree: buildNode(null, parsed) };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { error: `Invalid JSON: ${message}` };
  }
}
