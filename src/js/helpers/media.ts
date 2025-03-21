import breakpointsMinData from '@src/settings/styles/breakpoints/breakpointsMin.module.scss';
import breakpointsMaxData from '@src/settings/styles/breakpoints/breakpointsMax.module.scss';

export interface IBreakpoints {
  min: {
    xs: string,
    sm: string,
    md: string,
    lg: string,
    xl: string,
    xxl: string,
  },
  max: {
    xs: string,
    sm: string,
    md: string,
    lg: string,
    xl: string,
  }
}


interface Changer {
  breakpoints: (keyof IBreakpoints['min'])[]
  onChange: ( { isBreakpointZone, breakpoint }: OnChangeProps ) => void
}

interface OnChangeProps {
  isBreakpointZone: boolean,
  breakpoint: keyof IBreakpoints['min']
}

interface AddChangerProps {
  name: string
  breakpoints: Changer['breakpoints']
  onChange: Changer['onChange']
}

interface ChangersData {
  changers: Record<string, Changer>
  addChanger: ( props: AddChangerProps ) => void
  removeChanger: ( name: string ) => void
}

type Device = 'mobile' | 'tablet' | 'pc'
type IsDevice = Record<Device, boolean>
type NumericBreakpoints = Record<keyof IBreakpoints['min'], number>

type StringBreakpoints = {
  [K in keyof IBreakpoints['min']]: IBreakpoints['min'][K]
} & {
  toNumbers: () => NumericBreakpoints
}

interface MediaResponse {
  addMediaAction: ChangersData['addChanger']
  isDevice: IsDevice
  breakpoints: StringBreakpoints
}


/**
 * @description Возвращает {addMediaAction, isDevice}.
 * isDevice - показывает какой экран при загрузке страницы mobile|tablet|pc.
 * addMediaAction - добавляет функцию которая будет срабатывать на брейкпоинтах переданных в поле breakpoints.
 *    принимает объект - {
 *      name: 'уникальноеНазваниеДляСобытия',
 *      breakpoints: ['xl', 'xxl'],  - название брейкпоинта из $breakpoints-min в scss
 *      onChange(dataOfBreakpoint){ do some } - функция которая срабатывает для каждого брейкпоинта в массиве breakpoints
 *    }
 *
 * dataOfBreakpoint = {
 *   isBreakpointZone - булиновое значение обозначающее находится ли размер экрана в зоне брейкпоинта
 *   breakpoint - название брейкпоинта из массива breakpoints
 * }
 *
 *
 * Пример:
 * addMediaAction({
 *   name: 'uniqueName',
 *   breakpoints: ['xl', 'xxl'],
 *   onChange({isBreakpointZone, breakpoint}){
 *     if (breakpoint === 'xl') {
 *       if (isBreakpointZone) {
 *         do on enter in breakpoint
 *       } else {
 *         do on exit of breakpoint
 *       }
 *     }
 *   }
 * })
 */
export const mqData = () => {
  //@ts-ignore
  const breakpointsMin: IBreakpoints['min'] = { ...breakpointsMinData };
  //@ts-ignore
  const breakpointsMax: IBreakpoints['max'] = { ...breakpointsMaxData };

  const minMatch = ( minWidth: string ) => {
    return window.matchMedia( `(min-width: ${ minWidth })` );
  };
  const betweenMatch = ( minWidth: string, maxWidth: string ) => {
    return window.matchMedia( `(min-width: ${ minWidth }) and (max-width: ${ maxWidth })` );
  };
  const breakpointToNumber = ( breakpoint: string ): number => {
    return +breakpoint.replace( /\D/g, '' )
  }

  const breakpoints: Record<keyof IBreakpoints['min'], MediaQueryList> = {
    xs: betweenMatch( breakpointsMin.xs, breakpointsMax.sm ),
    sm: betweenMatch( breakpointsMin.sm, breakpointsMax.sm ),
    md: betweenMatch( breakpointsMin.md, breakpointsMax.md ),
    lg: betweenMatch( breakpointsMin.lg, breakpointsMax.lg ),
    xl: betweenMatch( breakpointsMin.xl, breakpointsMax.xl ),
    xxl: minMatch( breakpointsMin.xxl ),
  };

  /**
   * Добавляет метод для события onChange на брейкпоинте из объекта changersData.changers
   *
   * @param changersData
   */
  const updateChangers = ( changersData: ChangersData ) => {
    Object.keys( breakpoints ).forEach( ( breakpoint ) => {
      const breakpointName = breakpoint as keyof IBreakpoints['min']

      breakpoints[ breakpointName ].onchange = ( event ) => {
        Object.keys( changersData.changers ).forEach( ( changerName ) => {
          if ( changersData.changers[ changerName ].breakpoints.includes( breakpointName ) ) {
            changersData.changers[ changerName ].onChange( {
              isBreakpointZone: event.matches,
              breakpoint: breakpointName
            } );
          }
        } );
      };
    } );
  };

  const changersData: ChangersData = {
    changers: {},
    addChanger( { name, breakpoints, onChange } ) {
      if ( ! this.changers[ name ] ) {
        this.changers[ name ] = {
          breakpoints,
          onChange,
        };
      } else {
        throw new Error( `changers.${ name } is already exist` );
      }
      updateChangers( this );
    },
    removeChanger( name ) {
      if ( Object.keys( this.changers ).includes( name ) ) {
        delete this.changers[ name ];
        updateChangers( this );
      }
    },
  };

  const response: MediaResponse = {
    addMediaAction: changersData.addChanger.bind( changersData ),
    isDevice: {
      mobile: breakpoints.xs.matches || breakpoints.sm.matches,
      tablet: breakpoints.md.matches,
      pc: breakpoints.lg.matches || breakpoints.xl.matches || breakpoints.xxl.matches,
    },
    breakpoints: {
      ...breakpointsMin,
      toNumbers: () => {
        const breakpointsNum: Partial<NumericBreakpoints> = {}

        for ( let key in breakpointsMin){
          const breakpointsKey = key as keyof IBreakpoints['min']
          breakpointsNum[ breakpointsKey] = breakpointToNumber( breakpointsMin[ breakpointsKey ] )
        }

        return breakpointsNum as NumericBreakpoints
      }
    },
  };

  return response;
};
