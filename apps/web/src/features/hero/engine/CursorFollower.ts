import { type CursorState, resolveCursorState } from './CursorState';

export class CursorFollower {
  private readonly element: HTMLElement;

  private readonly position = { x: 0, y: 0 };
  private pointerTarget: Element | null = null;
  private state: CursorState = 'default';
  private visible = false;
  private frameId: number | undefined;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  start(): void {
    window.addEventListener('pointermove', this.handlePointerMove);
    document.documentElement.addEventListener('pointerleave', this.handlePointerLeave);
    this.frameId = requestAnimationFrame(this.tick);
  }

  destroy(): void {
    window.removeEventListener('pointermove', this.handlePointerMove);
    document.documentElement.removeEventListener('pointerleave', this.handlePointerLeave);
    if (this.frameId !== undefined) {
      cancelAnimationFrame(this.frameId);
    }
  }

  private readonly handlePointerMove = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return;

    this.position.x = event.clientX;
    this.position.y = event.clientY;
    this.pointerTarget = event.target instanceof Element ? event.target : null;

    if (!this.visible) {
      this.setVisible(true);
    }
  };

  private readonly handlePointerLeave = (): void => {
    this.setVisible(false);
  };

  private setVisible(visible: boolean): void {
    this.visible = visible;
    if (visible) {
      this.element.dataset.visible = 'true';
    } else {
      delete this.element.dataset.visible;
    }
  }

  private readonly tick = (): void => {
    if (this.visible) {
      this.element.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0)`;
      this.updateState();
    }
    this.frameId = requestAnimationFrame(this.tick);
  };

  private updateState(): void {
    const state = resolveCursorState(this.pointerTarget);
    if (state === this.state) return;

    this.state = state;
    this.element.dataset.state = state;
  }
}
