import { PluginOption } from "vite";
import { viteRewriteUrlInFilesOptions } from "./types";

/**
 * @param paths
 * @description Принимает объект в котором "ключи" это паттерн для поиска в регулярном выражении,
 *              а "значения" это на что заменять путь. Для ключа вложенность не указывать т.к. он
 *              ищет совпадение и меняет само совпадение и всё что было до него на переданное значение.
 *              Например объект {"/media": "../media"}. По ключу найдется путь "../../../../media/images/img.jpg"
 *              или "./media/img.jpg" и заменит на "../media/images/img.jpg" и "../media/img.jpg"
 */
export default function viteRewriteUrlInFiles( { files }: viteRewriteUrlInFilesOptions ): PluginOption {
  return {
    name: 'vite-rewrite-url-in-files',
    apply: 'build',
    enforce: 'post',
    //@ts-ignore
    generateBundle( options, bundle ) {
      const extOptions: Record<string, any> = {}
      files.forEach( option => {
        extOptions[ option.ext ] = option.paths
      } )

      // Проходим по всем файлам бандла
      for ( const fileName in bundle ) {
        const chunk = bundle[ fileName ];
        const ext = fileName.split( "." ).slice( -1 )[ 0 ]

        // @ts-ignore
        if ( ext in extOptions && Object.keys( extOptions[ ext ] ).length && chunk.source ) {
          // Заменяемые значения(ключи) собранные в строку в формате "ключ1|ключ2"
          const pathKeysString = Object.keys( extOptions[ ext ] ).join( '|' )

          // RegExp ищет урлы у которых нужно заменить значения
          const regexForMainCode = new RegExp( `url\\((['"]?)\.?(${pathKeysString})[^'")]*?['"]?\\)`, 'g' )

          // Искомое значение. ВНИМАНИЕ ХАРДКОД!!! Ниже берется первое значение из переданных по ключу 0
          const targetPattern = Object.keys( extOptions[ ext ] )[ 0 ]

          // Значение для замены
          const targetReplacement = extOptions[ ext ][ targetPattern ]

          // @ts-ignore
          chunk.source = chunk.source.replace( regexForMainCode, ( foundUrl ) => {
            const urlRegex = /url\((['"]?)([^'")]+)\1\)/;
            const foundUrlData = foundUrl.match( urlRegex )

            // foundUrlData[ 2 ] - то что заключено внутри url
            if ( foundUrlData && foundUrlData[ 2 ] ) {
              const quotes = foundUrlData[ 1 ]
              const pathAfterPattern = foundUrlData[ 2 ].split( targetPattern )[ 1 ]

              return `url(${ quotes + targetReplacement + pathAfterPattern + quotes })`;
            }

            return foundUrl;
          } )
        }
      }
    }
  };
}