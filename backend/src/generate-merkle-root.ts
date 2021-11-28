import { parseBalanceMap } from "./parse-balance-map";
const jsonData = {
  "0xF3c6F5F265F503f53EAD8aae90FC257A5aa49AC1": 1,
  "0xB9CcDD7Bedb7157798e10Ff06C7F10e0F37C6BdD": 2,
  "0xf94DbB18cc2a7852C9CEd052393d517408E8C20C": 3,
  "0xf0591a60b8dBa2420408Acc5eDFA4f8A15d87308": 4,
};
 
console.log(JSON.stringify(parseBalanceMap(jsonData)));
