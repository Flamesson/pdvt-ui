import Objects from "./Objects";

class Optional {
    constructor(value) {
        this.value = value;
    }

    static ofNullable(value: *): Optional {
        return new Optional(value);
    }

    static of(value: *): Optional {
        if (Objects.isNull(value)) {
            throw new Error("Given value is null");
        } else if (Objects.nonDefined(value)) {
            throw new Error("Given value is not defined");
        }

        return new Optional(value);
    }

    static empty(): Optional {
        return new Optional(null);
    }

    ifPresent(consumer: Function) {
        if (this.isPresent()) {
            consumer(this.value);
        }
    }

    ifPresentOrElse(consumer: Function, runnable: Function) {
        if (this.isPresent()) {
            consumer(this.value);
        } else {
            runnable();
        }
    }

    getOrElse(supplier: Function): * {
        if (this.isPresent()) {
            return this.value;
        } else {
            return supplier();
        }
    }

    getOrDefault(defaultValue: *): * {
        if (this.isPresent()) {
            return this.value;
        } else {
            return defaultValue;
        }
    }

    getOrThrow(): * {
        if (this.isEmpty()) {
            throw new Error("Nothing is present");
        }

        return this.value;
    }

    isPresent(): Boolean {
        return Objects.isCorrect(this.value);
    }

    isEmpty(): Boolean {
        return !this.isPresent();
    }

    map(mapper: Function): Optional {
        if (this.isEmpty()) {
            return Optional.empty();
        } else {
            let mapped = mapper(this.value);
            return Optional.of(mapped);
        }
    }
}

export default Optional;