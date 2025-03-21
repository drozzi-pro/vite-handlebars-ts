import Handlebars, {HelperDelegate} from 'handlebars'
interface HandlebarsHelper {
  name: string,
  action: HelperDelegate
}

function safeEval(comparison: string) {
  const operators = ['<=', '>=', '<', '>', '===', '==', '!==', '!='];
  let operator;

  // Найдем оператор в строке
  for (const op of operators) {
    if (comparison.includes(op)) {
      operator = op;
      break;
    }
  }

  if (!operator) {
    return false
  }

  const [left, right] = comparison.split(operator).map(str => str.trim());

  switch (operator) {
    case '<=': return Number(left) <= Number(right);
    case '>=': return Number(left) >= Number(right);
    case '<': return Number(left) < Number(right);
    case '>': return Number(left) > Number(right);
    case '===': return left === right;
    case '==': return left == right;
    case '!==': return left !== right;
    case '!=': return left != right;
    default: return false;
  }
}

export const handlebarsHelpers: HandlebarsHelper[] = [
  {
    name: 'safe',
    action: (string?: string) => !string ? null : new Handlebars.SafeString(string)
  },
  {
    name: 'or',
    action: (first: any, second: any) => first ? first : second
  },
  {
    name: 'str-equals',
    action: (first_str: any, second_str: any) => first_str === second_str
  },
  {
    name: 'str-concat',
    action: (...args) => args.filter(arg => typeof arg === 'string').join('')
  },
  {
    name: 'compare',
    action: (first_value: any, operator: string, second_value) => safeEval(`${first_value} ${operator} ${second_value}`)
  },
  {
    name: 'arr-compare',
    action: (field_name: string, operator: string, second_value: any, array: object) => {
      // @ts-ignore
      return array ? safeEval(`${array[field_name]} ${operator} ${second_value}`) : null
    }
  },
  {
    name: 'arr-slice',
    action: (index: number, array: []) => array && index in array ? array.slice(index) : []
  },
  {
    name: 'set-checked',
    action: (is_checked: boolean) => is_checked ? 'checked' : null
  },
  {
    name: 'set-disabled',
    action: (is_disabled: boolean) => is_disabled ? 'disabled' : null
  },
  {
    name: 'add-modificator',
    action: (main_class: string, modificator: string) => !!modificator && !!main_class ? `${main_class}--${modificator}` : null
  },
  {
    name: 'is-defined',
    action: (value: any) => value !== undefined
  },
  {
    name: 'str-to-bool',
    action: (string: string) => {
      if ( string === 'true' ) return true
      if ( string === 'false' ) return false
    }
  },
  {
    name: 'minify-tel',
    action: (phone_number: string) => phone_number.replace(/\D/g, '')
  },
  {
    name: 'entry-by-index',
    action: ( array: [], index: number ) => array[ index ]
  },
  {
    name: 'not',
    action: ( arg: any ) => !Boolean( arg )
  },
  {
    name: 'and',
    action: ( ...args ) => args.every( Boolean )
  },
]