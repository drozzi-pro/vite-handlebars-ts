import { getEventData } from "./event";
import { EGlobalActions } from "./types"
import { app } from "../app";

export const initGlobalAction = () => {
  document.addEventListener( 'click', ( event ) => {
    const { target, action } = getEventData( event )

    if ( target ) {
      event.stopPropagation()

      if ( action === EGlobalActions.ModalOpen ) app.modalOpen()
      if ( action === EGlobalActions.ModalClose ) app.modalClose()
    }
  } )
}