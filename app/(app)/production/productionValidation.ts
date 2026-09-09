export type ProductionFieldRule<T extends string> = {
    name: T;
    label: string;
    integer?: boolean;
    allowZero?: boolean;
};

export type ProductionFieldErrors<T extends string> = Partial<Record<T, string>>;

export function validateProductionFields<T extends Record<string, string | number | null | undefined>>(
    form: T,
    rules: ProductionFieldRule<Extract<keyof T, string>>[]
): ProductionFieldErrors<Extract<keyof T, string>> {
    const errors: ProductionFieldErrors<Extract<keyof T, string>> = {};

    rules.forEach((rule) => {
        const rawValue = form[rule.name];
        const value = rawValue === null || rawValue === undefined ? "" : String(rawValue).trim();

        if (value === "") {
            errors[rule.name] = `${rule.label} wajib diisi.`;
            return;
        }

        const numberValue = Number(value);

        if (!Number.isFinite(numberValue)) {
            errors[rule.name] = `${rule.label} harus berupa angka.`;
            return;
        }

        if (rule.integer && !Number.isInteger(numberValue)) {
            errors[rule.name] = `${rule.label} harus berupa angka bulat.`;
            return;
        }

        if (rule.allowZero) {
            if (numberValue < 0) {
                errors[rule.name] = `${rule.label} tidak boleh negatif.`;
            }
            return;
        }

        if (numberValue <= 0) {
            errors[rule.name] = `${rule.label} harus lebih dari 0.`;
        }
    });

    return errors;
}

export function firstProductionError<T extends string>(errors: ProductionFieldErrors<T>) {
    for (const key of Object.keys(errors) as T[]) {
        const message = errors[key];

        if (message) {
            return message;
        }
    }

    return null;
}
