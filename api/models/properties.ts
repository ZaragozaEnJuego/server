export type Kind = "Transport" | "Education" | "Health" | "Groceries";

interface Propertie {
    name: string;
    id: string;
    address: string;
    price: number;
    income: number;
    owner?: string;
    kind: Kind;
}

interface KindRestrictions {
    MaxTemperature: { value: number; modifier: number };
    MinTemperature: { value: number; modifier: number };
    EnergyConsumption: number;
    Weather: { sunny: number; rainy: number; cloudy: number };
}
