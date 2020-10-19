function ObservableExecutor(executor) {
    if (typeof executor === 'function') {
        this.executor = executor;
        this.subscribed = false;
        this.onEmit = (() => {});
        this.onDone = (() => {});
        this.onError = (() => {});
        return this;
    } else {
        this.executor = null;
        throw new Error('Executor must be provided as a function');
    }
}

ObservableExecutor.prototype.subscribe = function({onEmit, onDone, onError}) {
    const withSubscribedState = (emitter) => (...params) => {
        if (this.subscribed) {
            emitter(...params);
        }
    };
    this.subscribed = true;
    this.onEmit = typeof onEmit === 'function' ? withSubscribedState(onEmit) : (() => {});
    this.onDone = typeof onDone === 'function' ? withSubscribedState(onDone) : (() => {});
    this.onError = typeof onError === 'function' ? withSubscribedState(onError) : (() => {});
    return this;
};

ObservableExecutor.prototype.unsubscribe = function() {
    this.subscribed = false;
    return this;
};

ObservableExecutor.prototype.execute = function() {
    if (this.executor) {
        this.executor(this.onEmit, this.onDone, this.onError);
    }
    return this;
};

module.exports = ObservableExecutor;