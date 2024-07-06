import { EventHandler } from '@create-figma-plugin/utilities'

// export interface CreateRectanglesHandler extends EventHandler {
//   name: 'CREATE_RECTANGLES'
//   handler: (count: number) => void
// }

export interface CloseHandler {
  name: 'CLOSE'
  handler: () => void
}

export interface CreateRectanglesHandler {
  name: 'CREATE_RECTANGLES'
  handler: (items: string[]) => void
}