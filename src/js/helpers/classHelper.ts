export const addClass = ( className: string | string[], elem: HTMLElement ) => {
  typeof className === 'string' ? elem.classList.add( className ) : elem.classList.add( ...className );
};
export const removeClass = ( className: string | string[], elem: HTMLElement ) => {
  typeof className === 'string' ? elem.classList.remove( className ) : elem.classList.remove( ...className );
};
export const hasClass = ( className: string, elem: HTMLElement ) => {
  return elem.classList.contains( className );
};

export const addClassIfNot = ( className: string | string[], elem: HTMLElement ) => {
  if ( typeof className === 'string' && !elem.classList.contains( className ) ) addClass( className, elem )

  if ( typeof className === 'object' ) {
    className.forEach( classNameInArray => {
      addClassIfNot( classNameInArray, elem )
    } )
  }
}
