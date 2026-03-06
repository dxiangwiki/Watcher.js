// 优化版 watcher.js
export class Watcher {
    constructor(options) {
        // 入参校验
        if (typeof options !== 'object' || options === null || Array.isArray(options)) {
            throw new TypeError('必须传入配置对象实现具名初始化');
        }
        if (options.target === undefined) {
            throw new Error('具名参数 "target" 是必填项');
        }
        if (typeof options.fn !== 'function') {
            throw new TypeError('具名参数 "fn" 必须是函数');
        }

        // 核心优化：自动包装基本类型
        this.target = this._wrapPrimitive(options.target);
        this.fn = options.fn;
        this.ruleDesc = options.ruleDesc || '';
    }

    // 私有方法：自动包装基本类型为 { value: xxx }
    _wrapPrimitive(value) {
        // 判断是否是基本类型（排除对象、数组、函数）
        const isPrimitive = [
            'string', 'number', 'boolean', 'symbol', 'bigint', 'null', 'undefined'
        ].includes(typeof value) || value === null;

        if (isPrimitive) {
            return { value }; // 自动包装成对象
        }
        return value; // 非基本类型直接返回
    }

    // 取值时自动解包
    judge() {
        const currentValue = this.target.value ?? this.target;
        return this.fn(currentValue);
    }

    checkAndThrow() {
        const currentValue = this.target.value ?? this.target;
        if (!this.fn(currentValue)) {
            const targetStr = typeof currentValue === 'object'
                ? JSON.stringify(currentValue)
                : String(currentValue);
            throw new Error(`规则[${this.ruleDesc}]不满足，当前值：${targetStr}`);
        }
    }

    static batchJudge(...watchers) {
        return watchers.every(watcher => {
            if (!(watcher instanceof Watcher)) {
                throw new TypeError('batchJudge 只能传入 Watcher 实例');
            }
            return watcher.judge();
        });
    }
}

export default Watcher;