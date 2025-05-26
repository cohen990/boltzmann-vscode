export function Some<T>(inner: T){
    return Option.Some<T>(inner);
}

export function None<T>(){
    return Option.None<T>();
}

export class Option<T>{
    private inner: T | null;
    
    
    private constructor(inner: T | null) {
        this.inner = inner;
    }
    
    static Some<T>(inner: T) {
        return new Option<T>(inner);
    }
    
    static None<T>() {
        return new Option<T>(null);
    }

	then<R>(action: (inner: any) => R): Option<R> {
        if(this.inner === null){
            return None();
        }

        return Some(action(this.inner));
	}
}