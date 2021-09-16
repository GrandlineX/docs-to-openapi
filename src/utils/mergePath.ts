function getKey(el: unknown): string {
  if (typeof el === 'object' && el !== null) {
    const keys = Object.keys(el);
    if (keys.length === 1) {
      return keys[0];
    }
    throw new Error(
      "Merge error - Multiple path definition in one @openapi tag, that's not allowed"
    );
  }
  throw new Error('Merge error - Invalid type');
}

export default function mergePath(src: unknown[]): unknown[] {
  let cur = src;
  const out: unknown[] = [];

  while (cur.length !== 0) {
    const el: any = cur.pop();
    if (cur.length > 0) {
      const key = getKey(el);

      const tmp = cur.filter((del) => {
        return getKey(del) === key;
      });

      if (tmp.length !== 0) {
        let tempEl = el[key];
        tmp.forEach((del: any) => {
          tempEl = Object.assign(tempEl, del[key]);
        });
        el[key] = tempEl;
        cur = cur.filter((del) => {
          return getKey(del) !== key;
        });
      }
    }
    out.push(el);
  }

  return out;
}
