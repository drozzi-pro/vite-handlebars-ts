import { existsSync, readFileSync } from 'node:fs';
import { dirname, parse } from "path";
import { ContextOptions } from "../types.ts";
import { getFilesRecursively } from "../../../actions";

export const createContext = ( {
                                 file = 'context.json',
                                 postfix = '-context',
                                 prefix = '',
                                 partials,
                                 contextDir
                               }: ContextOptions ) => {
  const context = new Map<string, object>

  partials.forEach( ( path, partialName ) => {
    const contextFile = `${ dirname( path ) }/${ file }`;
    const contextName = prefix + partialName + postfix;

    if ( existsSync( contextFile ) ) {
      context.set( contextName, JSON.parse( readFileSync( contextFile, { encoding: "utf8" } ) ) )
    }
  } )

  if ( contextDir ) {
    const contextFiles = getFilesRecursively( contextDir )

    if ( contextFiles.length ) {
      contextFiles.forEach( ctxFile => {
        const contextName = prefix + parse( ctxFile ).name + postfix;

        if ( existsSync( ctxFile ) ) {
          const fileContent = readFileSync( ctxFile, { encoding: "utf8" } )

          if ( !!fileContent ) {
            context.set( contextName, JSON.parse( fileContent ) )
          }
        }
      } )
    }
  }

  return Object.fromEntries( context.entries() )
}