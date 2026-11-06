import {
  computeTapePose,
  isTapeVisible,
  type ShelfDimensions,
  tapeOffsetX,
  wrapRelativeIndex,
} from './ShelfGeometry';
import {
  activeIndexFor,
  approach,
  nearestTarget,
  normalizationShift,
  settleProgress,
} from './ShelfNavigation';

const MAX_FRAME_SECONDS = 0.05;
const SCROLL_RATE = 5.2;
const DRAG_SCROLL_RATE = 18;
const SNAP_EPSILON = 1e-4;
const MAX_LOOPS_BEFORE_NORMALIZE = 4;
const LIFT_RATE = 12;
const TILT_RATE = 7;
const ACTIVE_HALF_WIDTH = 0.5;
const SETTLED_THRESHOLD = 0.3;
const COVER_HIT_AREA = 0.55;
const COVER_TILT_Y_DEG = 9;
const COVER_TILT_X_DEG = 6;
const IDLE_TILT_Y_DEG = 5;
const DRAG_THRESHOLD_PX = 5;
const WHEEL_FACTOR = 0.5;
const WHEEL_SNAP_DELAY_MS = 160;

export type Direction = 1 | -1;

export interface TapeElements {
  readonly root: HTMLElement;
  readonly spine: HTMLElement;
  readonly cover: HTMLElement;
}

export interface ShelfViewport {
  readonly width: number;
  /** Centro vertical da estante, em pixels da janela. */
  readonly centerY: number;
  readonly dims: ShelfDimensions;
}

export interface ShelfEngineOptions {
  readonly itemCount: number;
  readonly copies: number;
  readonly initialIndex: number;
  readonly reducedMotion: boolean;
  readonly onActiveChange: (index: number, direction: Direction) => void;
  readonly onOpenRequest: () => void;
  readonly onCoverHoverChange: (isOnCover: boolean) => void;
}

interface TapeState {
  readonly elements: TapeElements;
  lift: number;
  visible: boolean;
}

interface DragState {
  readonly startX: number;
  readonly startTarget: number;
  active: boolean;
}

export class ShelfEngine {
  private readonly options: ShelfEngineOptions;
  private readonly total: number;

  private tapes: TapeState[] = [];
  private viewport: ShelfViewport | null = null;
  private playRing: HTMLElement | null = null;
  private playRingScale = -1;

  private scroll: number;
  private target: number;
  private activeIndex: number;

  private readonly tilt = { x: 0, y: 0 };
  private readonly pointer = { x: 0, y: 0 };
  private hasPointer = false;
  private hoveredVirtual: number | null = null;
  private onCover = false;
  private isOpen = false;

  private drag: DragState | null = null;
  private wheelTimer: number | undefined;
  private frameId: number | undefined;
  private lastTime = 0;

  constructor(options: ShelfEngineOptions) {
    this.options = options;
    this.total = options.itemCount * options.copies;

    const middleCopyStart = Math.floor(options.copies / 2) * options.itemCount;
    this.scroll = middleCopyStart + options.initialIndex;
    this.target = this.scroll;
    this.activeIndex = options.initialIndex;
  }

  // ─── Ciclo de vida ──────────────────────────────────────────

  registerTapes(elements: readonly TapeElements[]): void {
    if (elements.length !== this.total) {
      throw new Error(`Esperados ${this.total} volumes, recebidos ${elements.length}.`);
    }
    this.tapes = elements.map((tapeElements) => ({
      elements: tapeElements,
      lift: 0,
      visible: true,
    }));
  }

  registerPlayRing(element: HTMLElement | null): void {
    this.playRing = element;
    this.playRingScale = -1;
  }

  setViewport(viewport: ShelfViewport): void {
    this.viewport = viewport;
    if (!this.hasPointer) {
      this.pointer.x = viewport.width / 2;
      this.pointer.y = viewport.centerY;
    }
  }

  start(): void {
    this.lastTime = performance.now();
    this.frameId = requestAnimationFrame(this.tick);
  }

  destroy(): void {
    if (this.frameId !== undefined) {
      cancelAnimationFrame(this.frameId);
    }
    window.clearTimeout(this.wheelTimer);
    this.tapes = [];
    this.playRing = null;
  }

  // ─── Comandos ───────────────────────────────────────────────

  getActiveIndex(): number {
    return this.activeIndex;
  }

  /** Face da capa do volume mais próximo do centro, de onde a folha de detalhe nasce. */
  getActiveCover(): HTMLElement | null {
    let closest: TapeState | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const [virtualIndex, tape] of this.tapes.entries()) {
      const distance = Math.abs(wrapRelativeIndex(virtualIndex, this.scroll, this.total));
      if (distance < closestDistance) {
        closest = tape;
        closestDistance = distance;
      }
    }
    return closest?.elements.cover ?? null;
  }

  step(direction: Direction): void {
    if (this.isOpen) return;
    this.target = Math.round(this.target) + direction;
  }

  goToIndex(index: number): void {
    if (this.isOpen) return;
    this.target = nearestTarget(this.target, index, this.options.itemCount);
  }

  /** Clique num volume: abre se for o do centro, senão traz ele para o centro. */
  selectTape(virtualIndex: number): void {
    if (this.isOpen) return;
    const relativeIndex = wrapRelativeIndex(virtualIndex, this.scroll, this.total);

    if (Math.abs(relativeIndex) < ACTIVE_HALF_WIDTH) {
      this.target = Math.round(this.target);
      this.options.onOpenRequest();
      return;
    }
    this.target = Math.round(this.target + relativeIndex);
  }

  setOpen(isOpen: boolean): void {
    this.isOpen = isOpen;
    if (isOpen) {
      this.target = Math.round(this.target);
    }
  }

  setHover(virtualIndex: number | null): void {
    this.hoveredVirtual = virtualIndex;
  }

  setPointer(x: number, y: number): void {
    this.hasPointer = true;
    this.pointer.x = x;
    this.pointer.y = y;
  }

  wheel(deltaX: number, deltaY: number): void {
    if (this.isOpen || !this.viewport) return;

    const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
    const { spineWidth, gap } = this.viewport.dims;
    this.target += (delta / (spineWidth + gap)) * WHEEL_FACTOR;

    window.clearTimeout(this.wheelTimer);
    this.wheelTimer = window.setTimeout(() => {
      this.target = Math.round(this.target);
    }, WHEEL_SNAP_DELAY_MS);
  }

  beginDrag(x: number): void {
    if (this.isOpen) return;
    this.drag = { startX: x, startTarget: this.target, active: false };
  }

  moveDrag(x: number): void {
    const { drag, viewport } = this;
    if (!drag || !viewport) return;

    const dx = x - drag.startX;
    if (!drag.active && Math.abs(dx) > DRAG_THRESHOLD_PX) {
      drag.active = true;
    }
    if (drag.active) {
      const { spineWidth, gap } = viewport.dims;
      this.target = drag.startTarget - dx / (spineWidth + gap);
    }
  }

  /** Encerra o arraste. Devolve true se houve arraste de fato (para ignorar o clique). */
  endDrag(): boolean {
    const wasDragging = this.drag?.active ?? false;
    this.drag = null;
    if (wasDragging) {
      this.target = Math.round(this.target);
    }
    return wasDragging;
  }

  // ─── Loop ───────────────────────────────────────────────────

  private readonly tick = (now: number): void => {
    const dt = Math.min(MAX_FRAME_SECONDS, (now - this.lastTime) / 1000);
    this.lastTime = now;

    this.updateScroll(dt);
    this.updateActive();
    this.updateTilt(dt);
    this.render(dt);
    this.renderPlayRing();

    this.frameId = requestAnimationFrame(this.tick);
  };

  private updateScroll(dt: number): void {
    const rate = this.drag?.active ? DRAG_SCROLL_RATE : SCROLL_RATE;
    this.scroll = this.options.reducedMotion
      ? this.target
      : approach(this.scroll, this.target, rate, dt);

    if (Math.abs(this.target - this.scroll) < SNAP_EPSILON) {
      this.scroll = this.target;
    }

    const shift = normalizationShift(this.scroll, this.total, MAX_LOOPS_BEFORE_NORMALIZE);
    this.scroll -= shift;
    this.target -= shift;
    if (this.drag) {
      this.drag = { ...this.drag, startTarget: this.drag.startTarget - shift };
    }
  }

  private updateActive(): void {
    const index = activeIndexFor(this.scroll, this.options.itemCount);
    if (index === this.activeIndex) return;

    const direction: Direction = this.target >= this.scroll ? 1 : -1;
    this.activeIndex = index;
    this.options.onActiveChange(index, direction);
  }

  private updateTilt(dt: number): void {
    const { viewport } = this;
    if (!viewport) return;

    const { width, centerY, dims } = viewport;
    const dx = this.pointer.x - width / 2;
    const dy = this.pointer.y - centerY;
    const isSettled = Math.abs(this.target - this.scroll) < SETTLED_THRESHOLD;

    const onCover =
      !this.isOpen &&
      isSettled &&
      Math.abs(dx) < COVER_HIT_AREA * dims.coverWidth &&
      Math.abs(dy) < COVER_HIT_AREA * dims.height;

    if (onCover !== this.onCover) {
      this.onCover = onCover;
      this.options.onCoverHoverChange(onCover);
    }

    const targetY = onCover
      ? (dx / (COVER_HIT_AREA * dims.coverWidth)) * COVER_TILT_Y_DEG
      : (dx / width) * IDLE_TILT_Y_DEG;
    const targetX = onCover ? -(dy / (dims.height / 2)) * COVER_TILT_X_DEG : 0;

    this.tilt.x = approach(this.tilt.x, targetX, TILT_RATE, dt);
    this.tilt.y = approach(this.tilt.y, targetY, TILT_RATE, dt);
  }

  private render(dt: number): void {
    const { viewport } = this;
    if (!viewport) return;

    const { width, dims } = viewport;

    this.tapes.forEach((tape, virtualIndex) => {
      const relativeIndex = wrapRelativeIndex(virtualIndex, this.scroll, this.total);

      const isHovered =
        virtualIndex === this.hoveredVirtual && Math.abs(relativeIndex) > ACTIVE_HALF_WIDTH;
      const liftTarget = isHovered ? 1 : 0;
      tape.lift = this.options.reducedMotion
        ? liftTarget
        : approach(tape.lift, liftTarget, LIFT_RATE, dt);

      const visible = isTapeVisible(tapeOffsetX(relativeIndex, dims), width, dims);
      if (visible !== tape.visible) {
        tape.elements.root.style.visibility = visible ? 'visible' : 'hidden';
        tape.visible = visible;
      }
      if (!visible) return;

      const pose = computeTapePose({ relativeIndex, tilt: this.tilt, lift: tape.lift }, dims);
      const { root, spine, cover } = tape.elements;

      root.style.transform =
        `translate3d(${pose.x}px, ${pose.y}px, ${pose.z}px) ` +
        `rotateZ(${pose.rotateZ}deg) rotateX(${pose.rotateX}deg) rotateY(${pose.rotateY}deg)`;
      root.style.zIndex = String(pose.zIndex);
      spine.style.setProperty('--shade', String(pose.spineShade));
      cover.style.setProperty('--shade', String(pose.coverShade));
    });
  }

  private renderPlayRing(): void {
    if (!this.playRing) return;

    const scale = this.isOpen ? 0 : settleProgress(this.scroll, this.target);
    if (scale === this.playRingScale) return;

    this.playRingScale = scale;
    this.playRing.style.transform = `scale(${scale})`;
  }
}
