export class CreatedAt {
    private readonly _value: Date;

    constructor() {
        this._value = this.now();
    }
    
    get value() {
        return this._value.toISOString();
    }

    private now() {
        return new Date(
            new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
        );
    }
}
