import handlebars from 'handlebars';
import { registerPartials } from "./actions/partial.ts";
import { createContext } from "./actions/context.ts";
import { TPartials } from "./types.ts";
import { handlebarsHelpers } from "../../handlebarsHelpers";

interface ViteHandlebarsOptions {
  partialsDir: string | string[]
  contextDir?: string
}

//@ts-ignore
export default function viteHandlebars( { partialsDir, contextDir }: ViteHandlebarsOptions ): PluginOption {
  const partialsMap: TPartials = new Map();

  if ( handlebarsHelpers.length ) {
    handlebarsHelpers.forEach( ( { name, action } ) => {
      handlebars.registerHelper( name, action )
    } )
  }

  return {
    name: 'vite-handlebars',
    transformIndexHtml: {
      order: 'pre',
      async handler( html: any ) {
        await registerPartials( partialsDir, partialsMap )

        const template = handlebars.compile( html );

        const context = createContext( {
          partials: partialsMap,
          contextDir
        } );

        return template( context );
      },
    },
  };
}