export class Miner {
    name: string;
    // hash rate in TH/s
    hashRate: number;
    // power efficiency in J/TH
    powerEfficiency: number;
    // price in Euro
    price: number;
}

export const MINERS: Miner[] = [
    { 
        name: "Antminer S15 - High-Performance Mode",
        hashRate: 28,
        powerEfficiency: 59,
        price: 1035
     },
     { 
        name: "Antminer S15 - Energy-Saving Mode",
        hashRate: 17,
        powerEfficiency: 53,
        price: 1035
     }
]