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
      name: "Antminer S17 Pro - Normal",
      hashRate: 53,
      powerEfficiency: 39.5,
      price: 2599
   },
   {
      name: "Antminer S17 Pro - Turbo",
      hashRate: 62,
      powerEfficiency: 45,
      price: 2599
   },
   {
      name: "Antminer S17 Pro - Low Power",
      hashRate: 36,
      powerEfficiency: 36,
      price: 2599
   },
   {
      name: "Antminer S17 - Normal Mode",
      hashRate: 56,
      powerEfficiency: 45,
      price: 2450
   },
   {
      name: "Antminer S17 - Low Power",
      hashRate: 35,
      powerEfficiency: 42,
      price: 2450
   },
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