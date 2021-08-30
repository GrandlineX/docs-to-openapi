// eslint-disable-next-line @typescript-eslint/no-var-requires
const { typeOf } = require('remedial');

export default function JsonToYmlParser(data: any) {
  let indentLevel = '';
  const handlers: any = {
    undefined() {
      return 'null';
    },
    null() {
      return 'null';
    },
    number(x: number) {
      return x;
    },
    boolean(x: boolean) {
      return x ? 'true' : 'false';
    },
    string(x: string) {
      return JSON.stringify(x);
    },
    array(x: any[]) {
      let output = '';
      if (x.length === 0) {
        output += '[]';
        return output;
      }

      indentLevel = indentLevel.replace(/$/, '  ');
      x.forEach(function (y) {
        const handler = handlers[typeOf(y)];
        if (!handler) {
          throw new Error(`what the crap: ${typeOf(y)}`);
        }

        output += `\n${indentLevel}- ${handler(y)}`;
      });
      indentLevel = indentLevel.replace(/ {2}/, '');

      return output;
    },
    object(x: any) {
      let output = '';
      if (Object.keys(x).length === 0) {
        output += '{}';
        return output;
      }

      indentLevel = indentLevel.replace(/$/, '  ');
      Object.keys(x).forEach(function (k) {
        const val = x[k];
        const handler = handlers[typeOf(val)];
        if (typeof val === 'undefined') {
          // the user should do
          // delete obj.key
          // and not
          // obj.key = undefined
          // but we'll error on the side of caution
          return;
        }

        if (!handler) {
          throw new Error(`what the crap: ${typeOf(val)}`);
        }

        output += `\n${indentLevel}${k}: ${handler(val)}`;
      });
      indentLevel = indentLevel.replace(/ {2}/, '');

      return output;
    },
    function() {
      return '[object Function]';
    },
  };

  return `${handlers[typeOf(data)](data)}\n`;
}
