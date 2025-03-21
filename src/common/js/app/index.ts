import { AppInterface } from "./types";
import { Nullable } from "@js/types";
import { addClass, removeClass } from "@js/helpers/classHelper.ts";

const getScrollbarWidth = () => {
  const scrollDiv = document.createElement( "div" );
  let scrollbarWidth = 0;
  scrollDiv.style.width = "100px";
  scrollDiv.style.height = "100px";
  scrollDiv.style.overflowY = "scroll";
  scrollDiv.style.position = "absolute";
  scrollDiv.style.top = "-9999px";
  document.body.appendChild( scrollDiv );
  scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild( scrollDiv );
  return scrollbarWidth
}

export const app: AppInterface = {
  scrollbarWidth: 0,
  body: null,
  bodyBlock( isBlock = true ) {
    if ( this.body ) {
      isBlock ? addClass( "no-scroll", this.body ) : removeClass( "no-scroll", this.body )
    }
  },
  modalOpen() {
    this.body && addClass( "modal-open", this.body )
  },
  modalClose() {
    this.body && removeClass( "modal-open", this.body )
  },
  initDependencies() {
    this.body = document.body
    const root: Nullable<HTMLElement> = document.querySelector( ':root' );
    if ( !this.scrollbarWidth ) this.scrollbarWidth = getScrollbarWidth()
    if ( this.scrollbarWidth && root ) {
      root.style.setProperty( '--scrollbar-width', `${ this.scrollbarWidth }px` )
    }
  },
};