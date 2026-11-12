export type BreakerState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface BreakerConfig {
  failureRateThreshold: number;
  minimumWindowSize: number;
  cooldownMs: number;
}

export class CircuitBreaker {
  private state: BreakerState = "CLOSED";
  private openedAt: number = 0;

  // Deterministic Memory Mitigation: Static-sized Ring Buffer
  private readonly window: boolean[];
  private head: number = 0;
  private count: number = 0;
  private currentFailures: number = 0;

  constructor(private readonly config: BreakerConfig) {
    // Pre-allocate a contiguous memory block to eliminate runtime heap resizing
    this.window = new Array(config.minimumWindowSize).fill(true);
  }

  public getState(): BreakerState {
    if (this.state === "OPEN" && Date.now() - this.openedAt >= this.config.cooldownMs) {
      this.state = "HALF_OPEN";
    }
    return this.state;
  }

  public canAttempt(): boolean {
    return this.getState() !== "OPEN";
  }

  public recordSuccess(): void {
    if (this.state === "HALF_OPEN") {
      this.reset();
      return;
    }
    this.pushOutcome(true);
  }

  public recordFailure(): void {
    if (this.state === "HALF_OPEN") {
      this.open();
      return;
    }
    
    this.pushOutcome(false);
    if (this.shouldOpen()) {
      this.open();
    }
  }

  /**
   * O(1) Time, Zero Allocation Insertion using Modulo Arithmetic
   */
  private pushOutcome(success: boolean): void {
    if (this.count === this.config.minimumWindowSize) {
      const outgoing = this.window[this.head];
      if (!outgoing) this.currentFailures--;
    } else {
      this.count++;
    }

    if (!success) this.currentFailures++;
    this.window[this.head] = success;
    
    this.head = (this.head + 1) % this.config.minimumWindowSize;
  }

  /**
   * O(1) Time Evaluation using cached integer scalars
   */
  private shouldOpen(): boolean {
    if (this.count < this.config.minimumWindowSize) return false;
    return (this.currentFailures / this.count) >= this.config.failureRateThreshold;
  }

  private open(): void {
    this.state = "OPEN";
    this.openedAt = Date.now();
  }

  private reset(): void {
    this.state = "CLOSED";
    this.head = 0;
    this.count = 0;
    this.currentFailures = 0;
    // O(W) fill is acceptable on discrete state resets to preserve memory allocation
    this.window.fill(true); 
  }
}
