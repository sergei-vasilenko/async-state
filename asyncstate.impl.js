class AsyncState {
  #value;
  #maxDuration;
  #resolve = null;
  #reject = null;
  #timer = null;
  #status = "fulfilled";

  constructor(defaultValue, maxDuration = 0) {
    this.#value = Promise.resolve(defaultValue);
    this.#maxDuration = maxDuration;
  }

  get status() {
    return this.#status;
  }

  then(onFulfilled, onRejected) {
    return this.#value.then(onFulfilled, onRejected);
  }

  set(value) {
    this.#value = this.#value.then(() => value);
  }

  update(callback) {
    this.#value = this.#value.then((data) => callback(data));
  }

  wait(maxDuration) {
    this.#value = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
    this.#status = "pending";
    const duration = maxDuration || this.#maxDuration;
    if (duration > 0) {
      this.#timer = setTimeout(
        () => this.fail(new Error("Timeout has expired")),
        duration
      );
    }
  }

  result(data) {
    clearTimeout(this.#timer);
    this.#timer = null;
    this.#resolve(data);
    this.#status = "fulfilled";
  }

  fail(data) {
    clearTimeout(this.#timer);
    this.#timer = null;
    this.#reject(data);
    this.#status = "rejected";
  }
}

export default AsyncState;
