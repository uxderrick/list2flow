import { once, showUI, on } from '@create-figma-plugin/utilities';
import { CloseHandler, CreateRectanglesHandler } from './types';

export default function () {
  // Function to create a new flow
  async function createFlow(items: string[]) {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });

    // Generate a unique name for each new flow
    const flowName = `List2Flow-${Date.now()}`;

    // Create a parent frame with auto layout
    const parentFrame = figma.createFrame();
    parentFrame.name = flowName;
    parentFrame.layoutMode = "HORIZONTAL";
    parentFrame.counterAxisSizingMode = "AUTO";
    parentFrame.primaryAxisSizingMode = "AUTO";
    parentFrame.itemSpacing = 20; // Space between frames
    parentFrame.paddingLeft = 20;
    parentFrame.paddingRight = 20;
    parentFrame.paddingTop = 20;
    parentFrame.paddingBottom = 20;

    const nodes: Array<SceneNode> = [];
    for (let i = 0; i < items.length; i++) {
      const frame = figma.createFrame();
      frame.resize(120, 120); // Set a fixed size for the frame
      frame.fills = [{ color: { b: 0, g: 0.5, r: 1 }, type: 'SOLID' }];
      frame.cornerRadius = 8;

      // Create text node for each item
      const text = figma.createText();
      text.characters = items[i];
      text.resize(frame.width - 20, frame.height - 20); // Leave some padding
      text.x = 10; // Center horizontally within frame
      text.y = 10; // Center vertically within frame
      text.textAutoResize = 'HEIGHT';
      text.textAlignHorizontal = 'CENTER';
      text.textAlignVertical = 'CENTER';
      text.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];

      frame.appendChild(text); // Add text to frame
      parentFrame.appendChild(frame); // Add frame to parent frame
      nodes.push(frame);
    }

    figma.currentPage.appendChild(parentFrame);
    figma.currentPage.selection = [parentFrame];
    figma.viewport.scrollAndZoomIntoView([parentFrame]);
    figma.notify('Flow created');
  }

  // Listen for the CREATE_RECTANGLES event
  on<CreateRectanglesHandler>('CREATE_RECTANGLES', async function (items: string[]) {
    try {
      await createFlow(items);
    } catch (error) {
      figma.notify('An error occurred while creating the flow');
      console.error(error);
    }
  });

  // Listen for the CLOSE event
  on<CloseHandler>('CLOSE', function () {
    figma.closePlugin();
  });

  showUI({
    height: 500,
    width: 300,
    title: 'List2Flow',
  });
}
