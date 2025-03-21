import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, resolve, join } from "path";
import { PreRenderedAsset, PreRenderedChunk } from "rollup";
import { normalizePath } from "vite";


export const getDirectoriesByPath = ( path: string ): string[] => {
  if ( existsSync( path ) ) {
    return readdirSync( path, { withFileTypes: true } )
      .filter( d => d.isDirectory() )
      .map( d => d.name )
  } else {
    throw new Error( `[getDirectoriesByPath]:неверный_путь - ${ path }` )
  }
}
// @ts-ignore
export const getFilesRecursively = ( path: string, extension?: string ): string[] => {
  const result: string[] = []


  if ( existsSync( path ) ) {
    const firstLevelFiles = readdirSync( path );

    firstLevelFiles.forEach( file => {
      const fullPath = normalizePath( join( path, file ) );

      if ( statSync( fullPath ).isDirectory() ) {
        result.push( ...getFilesRecursively( fullPath, extension ) )
      } else {
        if ( !extension || fullPath.endsWith( `${ extension }` ) ) {
          result.push( fullPath )
        }
      }
    } )

    return result
  } else {
    throw new Error( `[getFilesRecursively]:неверный_путь - ${ path }` )
  }
}

export const getRollupInputFromDirectory = ( path: string ) => {
  const inputs: Record<string, string> = {}

  getDirectoriesByPath( path ).forEach( pageName => {
    const pageEntryFilePath = resolve( path, pageName, 'index.html' );
    if ( existsSync( pageEntryFilePath ) ) {
      inputs[ pageName ] = pageEntryFilePath
    }
  } )
  return inputs
}

export const setPathForEntryJsFiles = ( chunkInfo: PreRenderedChunk ): string => {
  const chunkPath = chunkInfo.facadeModuleId
  let pathToPages = 'pages/'

  // @ts-ignore
  if ( chunkPath && chunkPath.includes( pathToPages ) ) {
    const pageName = basename( dirname( chunkPath ) )
    return `${ pathToPages + pageName }/[name].[hash].js`
  }
  return 'assets/js/[name].[hash].js'
}

export const setPathForChunkJsFiles = ( chunkInfo: PreRenderedChunk ): string => {
  const chunkPath = chunkInfo.facadeModuleId
  let pathToPages = 'pages/'

  // @ts-ignore
  if ( chunkPath && chunkPath.includes( pathToPages ) ) {
    const pageName = basename( dirname( chunkPath ) )
    return `${ pathToPages + pageName }/[name].[hash].js`
  }
  return 'assets/js/[name].[hash].js'
}

//@ts-ignore
export const setPathForAssetsFiles = ( chunkInfo: PreRenderedAsset ): string => {
  // @ts-ignore
  let extType = chunkInfo?.names?.[ 0 ].split( '.' )[ 1 ];
  // let pathToPages = 'pages/'
  const pathToMedia = 'public/assets/media'

  if ( /png|jpe?g|svg|webp|gif|tiff|bmp|ico/i.test( extType ) ) {
    if ( chunkInfo?.originalFileNames?.[ 0 ].startsWith( `${ pathToMedia }/images/` ) ) {
      extType = 'images';
    }
    if ( chunkInfo?.originalFileNames?.[ 0 ].startsWith( `${ pathToMedia }/icons/` ) ) {
      extType = 'icons';
    }
  }

  if ( /woff|woff2|ttf/i.test( extType ) ) {
    extType = 'fonts';
  }

  if ( /css|scss/i.test( extType ) ) {
    extType = 'css';
  }

  if ( extType === 'css' ) {
    return `assets/css/[name].[hash][extname]`
  }

  if ( extType === 'images' || extType === 'icons' ) {
    return `assets/media/${ extType }/[name][extname]`
  }

  if ( extType === 'fonts' && chunkInfo?.originalFileNames?.[ 0 ] ) {
    const assetDirectory = basename( dirname( chunkInfo.originalFileNames[ 0 ] ) )

    return assetDirectory === 'fonts' ?
      `assets/fonts/[name][extname]` : `assets/fonts/${ assetDirectory }/[name][extname]`
  }

  return 'assets/[name][extname]'
}

export const getJsonFileContent = ( path: string ) => {
  if ( existsSync( path ) ) {
    try {
      return JSON.parse( readFileSync( path, { encoding: "utf8" } ) )
    } catch ( e ) {
      // @ts-ignore
      throw new Error( e.message )
    }
  }
}

export const firstCharToUpper = ( word: string ) => {
  return word.charAt( 0 ).toUpperCase() + word.slice( 1 )
}

export const getObjectFromJsonFile = ( path: string ) => {
  if ( existsSync( path ) ) {
    try {
      return JSON.parse( readFileSync( path, { encoding: "utf-8" } ) )
    } catch ( e ) {
      // @ts-ignore
      console.error( e.message )
    }
  }
}