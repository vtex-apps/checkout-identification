/* eslint-disable import/order */

import * as Runtime from 'vtex.render-runtime'

declare module 'vtex.render-runtime' {
  export const useChildBlock: (opts: { id: string }) => {} | null

  export const useRuntime: () => Runtime.RenderContext
}
