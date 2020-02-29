import { XYInterface } from '../components/interfaces';
import shapesImage from '../images/shapes.svg';
import squareImg from '../images/square.svg';


class Node {
    category: string;
    categoryImage: string;
    color: string; // Object color on the canvas
    description: string; // The help text for that node type
    hidden: boolean; // Whether the object is rendered
    hovered: boolean; // Whether the object is currently being hovered over
    hoveredColor: string; // The color that appears on hover
    locked: boolean; // Whether to be able to edit the node or not
    mainToolbarIcon: string; // The icon that appears in the main tool bar
    name: string; // The name of the node type
    named: string; // The name of the particular instance
    offSet: XYInterface; // The offset between the cursor and this node
    placeholder: boolean; // Whether this shape has been dropped yet
    position: XYInterface; // Where the node is located on the canvas grid
    selected: boolean; // Whether this node is selected
    selectedColor: string; // The color to change the node to when it is selected
    size: XYInterface; // The size of the node
    connectedTo: Node[]; // The nodes this node is connected to
    connectedFrom: Node[]; // The nodes this node is connected from

    
    constructor() {
      // this.category = {
        //   name: "Shape", 
        //   image: shapesImage
        // }
        this.category = "Shape";
      this.categoryImage = shapesImage;
      this.color = '#2E2E2E';
      this.description = 'A node';
      this.hidden = true;
      this.hovered = false;
      this.hoveredColor = 'rgba(0, 0, 0, 0.2)';
      this.locked = false;
      this.mainToolbarIcon = squareImg;
      this.name = 'Node';
      this.named = "Unnamed Node"
      this.offSet = { x: 0, y: 0 };
      this.placeholder = true;
      this.position = { x: 0, y: 0 };
      this.selected = false;
      this.selectedColor = '#EDD02E';
      this.size = { x: 10, y: 10 };
      this.connectedTo = []
      this.connectedFrom = []
    }
    connectTo(node: Node){
        this.connectedTo.push(node)
    }
    disconnectTo(node: Node){
        this.connectedTo.splice(this.connectedTo.indexOf(node), 1)
    }
    connectFrom(node: Node){
        this.connectedFrom.push(node)
    }
    disconnectFrom(node: Node){
        this.connectedFrom.splice(this.connectedFrom.indexOf(node), 1)
    }
    update(tick: number) {
        //
      }
      draw(ctx: CanvasRenderingContext2D, imageCache: HTMLImageElement[]) {
        if (!this.hidden) {
          // Draw the background shape
          ctx.fillStyle = this.color;
          ctx.fillRect(
            Math.floor(this.position.x),
            Math.floor(this.position.y),
            Math.floor(this.size.x),
            Math.floor(this.size.y)
          );
          // Draw the hovered overlay
          if (this.hovered) {
            ctx.fillStyle = this.hoveredColor;
            ctx.fillRect(
              Math.floor(this.position.x),
              Math.floor(this.position.y),
              Math.floor(this.size.x),
              Math.floor(this.size.y)
            );
          }
          // Draw the border and change color if selected
          if (this.selected) {
            ctx.strokeStyle = this.selectedColor;
          } else {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
          }
          ctx.strokeRect(
            Math.floor(this.position.x),
            Math.floor(this.position.y),
            Math.floor(this.size.x),
            Math.floor(this.size.y)
          );
          // Add the category name as text
          ctx.fillStyle = '#2E2E2E';
          ctx.font = '14px Roboto';
          ctx.fillText(
            this.category,
            Math.floor(this.position.x + this.size.x + 12),
            Math.floor(this.position.y + 10)
          );
          ctx.fillStyle = '#000000';
          ctx.font = '18px Roboto';
          ctx.fillText(
            this.named,
            Math.floor(this.position.x + this.size.x + 12),
            Math.floor(this.position.y + 30)
          );
          // Add the category image from the cache
          ctx.drawImage(
            imageCache[0] as CanvasImageSource,
            Math.floor(this.position.x + this.size.x / 2 - 7),
            Math.floor(this.position.y + 7)
          );
        }
      }
  }

export {Node}