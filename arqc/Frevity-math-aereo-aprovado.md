# Frevity — Especificação matemática do frete

**Destino:** `/arqc/Frevity-math.md`  
**Estado:** fórmula rodoviária aprovada; aérea e marítima pendentes.  
**Restrição:** os trechos TypeScript abaixo documentam a implementação futura. Nenhum arquivo do aplicativo será alterado antes de as três fórmulas estarem aprovadas.

## 1. Convenções de entrada

- **Peso ($P_r$):** peso **total** da remessa em kg, independentemente da quantidade. Três volumes e 25 kg significam 25 kg no total.
- **Dimensões ($C$, $L$, $A$):** comprimento, largura e altura **de um volume**, em metros. Pressupomos volumes com dimensões iguais.
- **Quantidade ($Q$):** número inteiro positivo de volumes. Multiplica o volume geométrico individual, **nunca o peso total informado**.
- O formulário converte unidades para kg e m antes do cálculo. As entradas devem ser finitas e positivas.
- A tarifa base é editável pelo usuário. Custos adicionais não são obrigatórios.

## 2. Modal rodoviário — fórmula aprovada

### 2.1 Grandezas

| Símbolo | Descrição | Unidade |
|---|---|---|
| $P_r$ | Peso real total | kg |
| $C,L,A$ | Dimensões de um volume | m |
| $Q$ | Quantidade de volumes idênticos | unidade |
| $V_t$ | Volume total | m³ |
| $F_c$ | Fator de cubagem adotado nesta simulação | 300 kg/m³ |
| $P_c$ | Peso cubado | kg |
| $P_t$ | Peso taxável | kg |
| $T_{kg}$ | Tarifa informada por kg taxável | moeda/kg |
| $F_{\min}$ | Frete mínimo, se informado | moeda |
| $C_i$ | Custo adicional opcional aplicável | moeda |
| $F_b$ | Frete base | moeda |
| $F_{\text{total}}$ | Frete total | moeda |

O fator de 300 kg/m³ é uma **premissa explícita do modelo**, não uma exigência universal para qualquer contrato rodoviário.

### 2.2 Fórmulas matemáticas

**Volume total:**

$$
V_t=C\times L\times A\times Q
$$

**Peso cubado:**

$$
P_c=V_t\times300
$$

**Peso taxável:**

$$
\boxed{P_t=\max(P_r,P_c)}
$$

**Frete base:**

$$
F_b = \max(P_t \times T_{kg}, F_{\min})
$$

Sem frete mínimo informado, utiliza-se $F_{\min}=0$ **apenas internamente** para avaliar a expressão; isso não cria uma cobrança mínima fictícia.

**Frete total:**

$$
\boxed{F_{\text{total}} = F_b + \sum_{i=1}^{n} C_i}
$$

Sem despesas adicionais, $n=0$ e a soma vale zero: $F_{\text{total}}=F_b$. GRIS, Ad Valorem, pedágio e outros encargos são **opcionais**. Somar apenas despesas efetivamente informadas, aplicáveis e não incluídas na tarifa. Todas as parcelas devem utilizar a mesma moeda; trocar o símbolo monetário não realiza conversão cambial.

### 2.3 Como funciona: raciocínio computacional

1. **Normalização:** converter dimensões para metros e o peso **total** para kg. Não multiplicar $P_r$ por $Q$.
2. **Geometria:** $C\times L\times A$ calcula o volume de um objeto retangular. Multiplicar por $Q$ produz o volume de toda a remessa.
3. **Análise dimensional:** $V_t$ em m³ multiplicado por $300$ kg/m³ produz $P_c$ em kg. O peso cubado é uma equivalência tarifária, não massa física adicional.
4. **Decisão:** `max(P_r, P_c)` seleciona o peso taxável deste modelo. O operador `max` é uma regra comercial explícita.
5. **Tarifação:** multiplicar kg taxáveis por moeda/kg resulta em moeda. O frete mínimo, quando presente, estabelece um limite inferior.
6. **Composição:** adicionar apenas despesas opcionais conhecidas, preservando cada parcela no resultado para auditoria.

**Distância:** a distância rodoviária validada caracteriza a rota, mas **não é multiplicada por $T_{kg}$** nesta fórmula: a tarifa informada é entendida como tarifa aplicável à operação. Um modelo por km exigiria outra base tarifária e parâmetros próprios; não deve ser misturado automaticamente a este modelo.

**Escopo da fórmula:** a expressão aprovada corresponde à **base tarifária por peso taxável**. Outras bases atualmente existentes na interface (peso real, volume, unidade ou valor fixo) não devem ser interpretadas silenciosamente como essa fórmula. Seu tratamento será explicitado na futura integração, sem mudar o contrato aprovado.

### 2.4 Exemplo numérico

Dados hipotéticos: três volumes idênticos de 50 × 40 × 30 cm; peso **total** de 25 kg; tarifa de R$ 2,50/kg taxável; frete mínimo de R$ 80,00; nenhum custo adicional.

$$
V_t=0{,}50\times0{,}40\times0{,}30\times3=0{,}18\;\text{m}^3
$$

$$
P_c=0{,}18\times300=54\;\text{kg}
$$

$$
P_t=\max(25,54)=54\;\text{kg}
$$

$$
F_b=\max(54\times2{,}50,80)=\text{R\$ }135{,}00
$$

$$
F_{\text{total}}=135+0=\text{R\$ }135{,}00
$$

Se a rota validada tiver 100 km, a distância é exibida como informação técnica e **não** multiplica novamente a tarifa por kg.

### 2.5 Fórmula representada em TypeScript — documentação para implementação futura

O código abaixo exemplifica a fórmula aprovada. **Não substituir os módulos existentes nesta etapa.** Recebe dados já normalizados e cobre exclusivamente a base por peso taxável.

```ts
type Money = { amount: number; currency: string };
type OptionalCharge = { label: string; amount: Money };

type RoadMathInput = {
  totalWeightKg: number; // Peso de TODA a remessa.
  lengthM: number;       // Dimensões de UM volume.
  widthM: number;
  heightM: number;
  quantity: number;
  tariffPerChargeableKg: Money;
  minimumFreight?: Money;
  additionalCharges?: OptionalCharge[];
};

type RoadMathResult = {
  totalVolumeM3: number;
  cubedWeightKg: number;
  chargeableWeightKg: number;
  baseFreight: Money;
  additionalChargesTotal: Money;
  totalFreight: Money;
};

const ROAD_CUBAGE_FACTOR_KG_PER_M3 = 300;

function positive(value: number, name: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be positive and finite.`);
  }
}

function nonNegative(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be non-negative and finite.`);
  }
}

function calculateRoadMath(input: RoadMathInput): RoadMathResult {
  positive(input.totalWeightKg, "Total weight");
  positive(input.lengthM, "Length");
  positive(input.widthM, "Width");
  positive(input.heightM, "Height");
  positive(input.quantity, "Quantity");
  if (!Number.isSafeInteger(input.quantity)) {
    throw new Error("Quantity must be a safe integer.");
  }
  positive(input.tariffPerChargeableKg.amount, "Tariff");

  const currency = input.tariffPerChargeableKg.currency;
  if (!currency.trim()) throw new Error("Currency is required.");
  if (input.minimumFreight) {
    nonNegative(input.minimumFreight.amount, "Minimum freight");
    if (input.minimumFreight.currency !== currency) {
      throw new Error("Minimum freight currency mismatch.");
    }
  }

  // Vt = C × L × A × Q
  const totalVolumeM3 =
    input.lengthM * input.widthM * input.heightM * input.quantity;

  // Pc = Vt × 300
  const cubedWeightKg = totalVolumeM3 * ROAD_CUBAGE_FACTOR_KG_PER_M3;

  // Pt = max(Pr, Pc). O peso informado JÁ é total.
  const chargeableWeightKg = Math.max(input.totalWeightKg, cubedWeightKg);

  // Fb = max(Pt × Tkg, Fmin)
  const baseAmount = Math.max(
    chargeableWeightKg * input.tariffPerChargeableKg.amount,
    input.minimumFreight?.amount ?? 0
  );

  // Soma somente despesas opcionais informadas.
  let additionalAmount = 0;
  for (const charge of input.additionalCharges ?? []) {
    nonNegative(charge.amount.amount, charge.label);
    if (charge.amount.currency !== currency) {
      throw new Error(`Currency mismatch: ${charge.label}`);
    }
    additionalAmount += charge.amount.amount;
  }

  const totalAmount = baseAmount + additionalAmount;
  for (const [name, value] of Object.entries({
    totalVolumeM3, cubedWeightKg, chargeableWeightKg,
    baseAmount, additionalAmount, totalAmount,
  })) {
    if (!Number.isFinite(value)) throw new Error(`${name} is not finite.`);
  }

  return {
    totalVolumeM3,
    cubedWeightKg,
    chargeableWeightKg,
    baseFreight: { amount: baseAmount, currency },
    additionalChargesTotal: { amount: additionalAmount, currency },
    totalFreight: { amount: totalAmount, currency },
  };
}
```

**Observação de engenharia:** na implementação real, o formulário já converte unidades. Precisaremos calcular o volume total com a quantidade sem duplicar a multiplicação, respeitar a seleção efetiva da base tarifária e definir a política de arredondamento monetário. O código documental preserva precisão intermediária; não arredonda pesos ou volumes antecipadamente.

## 3. Modal aéreo — fórmula aprovada

A fórmula aérea utiliza o **divisor volumétrico padrão de 6.000 cm³/kg**, configurável conforme as condições comerciais informadas pelo usuário. O formulário existente determina as entradas: origem, destino, quantidade, peso total, dimensões de um volume, divisor volumétrico, base tarifária, tarifa e custos adicionais opcionais. Nenhum novo campo obrigatório será criado.

**Política de arredondamento aprovada:** preservar a precisão integral dos pesos, volumes e cálculos intermediários, sem arredondamento comercial obrigatório para 0,5 kg ou 1 kg. A apresentação monetária poderá utilizar duas casas decimais; isso não modifica os valores intermediários. Uma configuração avançada de arredondamento comercial fica reservada para evolução futura, fora desta fórmula.

### 3.1 Grandezas

| Símbolo | Descrição | Unidade |
|---|---|---|
| $P_r$ | Peso real total da remessa | kg |
| $C,L,A$ | Dimensões de um volume, convertidas para centímetros | cm |
| $Q$ | Quantidade de volumes idênticos | unidade |
| $V_t$ | Volume geométrico total | cm³ |
| $D$ | Divisor volumétrico, padrão 6.000 | cm³/kg |
| $P_v$ | Peso volumétrico total | kg |
| $P_t$ | Peso tarifável | kg |
| $T_{kg}$ | Tarifa informada por kg tarifável | moeda/kg |
| $F_{\min}$ | Frete mínimo opcional, quando configurado | moeda |
| $C_i$ | Custo adicional opcional aplicável | moeda |
| $F_b$ | Frete base | moeda |
| $F_{\text{total}}$ | Frete total | moeda |

O divisor de 6.000 cm³/kg é uma **premissa explícita desta simulação**, não uma condição universal de todos os contratos aéreos. Quando o usuário informar outro divisor positivo, o cálculo utilizará o valor informado.

### 3.2 Fórmulas matemáticas

**Normalização:** o formulário pode receber diferentes unidades. Antes da fórmula aérea, o peso total é convertido para kg e cada dimensão é convertida para cm. A quantidade não multiplica o peso real total.

**Volume total:**

$$
V_t=C\times L\times A\times Q
$$

**Peso volumétrico:**

$$
P_v=\frac{V_t}{D},\qquad D_{\text{padrão}}=6000\;\text{cm}^3/\text{kg}
$$

**Peso tarifável:**

$$
\boxed{P_t=\max(P_r,P_v)}
$$

**Frete base, exclusivamente para a base tarifária por peso tarifável:**

$$
F_b=\max(P_t\times T_{kg},F_{\min})
$$

Na ausência de frete mínimo configurado, utiliza-se $F_{\min}=0$ **somente internamente**. O frete mínimo não será exigido no formulário e não representa uma cobrança automática.

**Frete total:**

$$
\boxed{F_{\text{total}}=F_b+\sum_{i=1}^{n}C_i}
$$

Se não houver custos adicionais, a soma será zero. Combustível, segurança, seguro, manuseio aeroportuário, documentação e demais encargos **não são aplicados automaticamente**: somente despesas efetivamente informadas, aplicáveis e não incluídas na tarifa poderão compor a soma. Todas as parcelas devem utilizar a mesma moeda; alterar a identificação da moeda não constitui conversão cambial.

**Outras bases tarifárias:** a fórmula acima se aplica à opção **peso tarifável**. Quando o usuário selecionar outra base já existente, o motor deve respeitar sua grandeza específica: peso real total para peso, volume total para volume, quantidade para unidade e uma tarifa por operação para valor fixo. A seleção de outra base não deve acionar silenciosamente a cobrança por peso tarifável.

**Escopo geográfico:** origem e destino identificam a operação nacional ou internacional e a moeda aplicável. Não existe multiplicação automática da tarifa pela distância ou cobrança automática de taxas de rota nesta fórmula.

### 3.3 Como funciona: raciocínio computacional

1. **Normalização:** converter o peso **total** para kg e as dimensões **individuais** para cm, independentemente das unidades selecionadas no formulário.
2. **Geometria:** multiplicar comprimento, largura e altura de um volume; multiplicar o resultado por $Q$ uma única vez.
3. **Análise dimensional:** dividir cm³ por um divisor em cm³/kg produz o peso volumétrico em kg. O peso volumétrico é uma equivalência tarifária, não massa física adicional.
4. **Decisão:** `max(P_r, P_v)` seleciona a maior grandeza como peso tarifável. O peso real informado já representa toda a remessa.
5. **Tarifação:** multiplicar o peso tarifável pela tarifa por kg e respeitar o mínimo apenas se estiver configurado.
6. **Composição:** somar despesas opcionais uma única vez no motor geral, preservando as parcelas para auditoria.
7. **Precisão:** não arredondar antecipadamente volume, peso volumétrico ou peso tarifável; a formatação monetária não altera os valores matemáticos intermediários.

### 3.4 Exemplo numérico

Dados hipotéticos: três volumes idênticos de 55 × 35 × 45 cm; peso **total** de 30 kg; divisor volumétrico de 6.000 cm³/kg; tarifa de US$ 4,00/kg tarifável; frete mínimo opcional configurado de US$ 100,00; custo adicional informado de US$ 25,00.

$$
V_t=55\times35\times45\times3=259.875\;\text{cm}^3
$$

$$
P_v=\frac{259.875}{6000}=43{,}3125\;\text{kg}
$$

$$
P_t=\max(30;43{,}3125)=43{,}3125\;\text{kg}
$$

$$
F_b=\max(43{,}3125\times4;100)=\text{US\$ }173{,}25
$$

$$
F_{\text{total}}=173{,}25+25=\text{US\$ }198{,}25
$$

O volume equivalente é 0,259875 m³. **Não** se aplica arredondamento comercial de 0,5 kg ou 1 kg: o peso tarifável utilizado permanece 43,3125 kg. Os valores monetários do exemplo são hipotéticos e pressupõem que todas as parcelas estejam em USD.

### 3.5 Fórmula representada em TypeScript — documentação para implementação futura

O código abaixo **documenta** a fórmula aprovada por peso tarifável; não substitui os módulos existentes. As dimensões chegam normalizadas em centímetros e o peso informado já corresponde a toda a remessa. Na implementação real, a soma de despesas adicionais permanece exclusivamente no motor geral, sem duplicação no motor aéreo.

```ts
type AirMoney = { amount: number; currency: string };
type AirOptionalCharge = { label: string; amount: AirMoney };

type AirMathInput = {
  totalWeightKg: number;        // Peso de TODA a remessa.
  lengthCm: number;             // Dimensões de UM volume.
  widthCm: number;
  heightCm: number;
  quantity: number;
  volumetricDivisor?: number;   // Padrão: 6.000 cm³/kg.
  tariffPerChargeableKg: AirMoney;
  minimumFreight?: AirMoney;
  additionalCharges?: AirOptionalCharge[];
};

type AirMathResult = {
  totalVolumeCm3: number;
  volumetricWeightKg: number;
  chargeableWeightKg: number;
  baseFreight: AirMoney;
  additionalChargesTotal: AirMoney;
  totalFreight: AirMoney;
};

const DEFAULT_AIR_VOLUMETRIC_DIVISOR = 6000;

function airPositive(value: number, name: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be positive and finite.`);
  }
}

function airNonNegative(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be non-negative and finite.`);
  }
}

function calculateAirMath(input: AirMathInput): AirMathResult {
  airPositive(input.totalWeightKg, "Total weight");
  airPositive(input.lengthCm, "Length");
  airPositive(input.widthCm, "Width");
  airPositive(input.heightCm, "Height");
  airPositive(input.quantity, "Quantity");

  if (!Number.isSafeInteger(input.quantity)) {
    throw new Error("Quantity must be a safe integer.");
  }

  const divisor = input.volumetricDivisor ?? DEFAULT_AIR_VOLUMETRIC_DIVISOR;
  airPositive(divisor, "Volumetric divisor");
  airPositive(input.tariffPerChargeableKg.amount, "Tariff");

  const currency = input.tariffPerChargeableKg.currency;
  if (!currency.trim()) throw new Error("Currency is required.");

  if (input.minimumFreight) {
    airNonNegative(input.minimumFreight.amount, "Minimum freight");
    if (input.minimumFreight.currency !== currency) {
      throw new Error("Minimum freight currency mismatch.");
    }
  }

  // Vt = C × L × A × Q. Dimensões já convertidas para cm.
  const totalVolumeCm3 =
    input.lengthCm * input.widthCm * input.heightCm * input.quantity;

  // Pv = Vt / D. D está em cm³/kg.
  const volumetricWeightKg = totalVolumeCm3 / divisor;

  // Pt = max(Pr, Pv). O peso real informado JÁ é total.
  const chargeableWeightKg = Math.max(
    input.totalWeightKg,
    volumetricWeightKg
  );

  // Sem arredondamento comercial obrigatório.
  // Fb = max(Pt × Tkg, Fmin).
  const baseAmount = Math.max(
    chargeableWeightKg * input.tariffPerChargeableKg.amount,
    input.minimumFreight?.amount ?? 0
  );

  // Representação documental da composição total.
  // Na aplicação, somente o motor geral executará esta soma.
  let additionalAmount = 0;
  for (const charge of input.additionalCharges ?? []) {
    if (!charge.label.trim()) {
      throw new Error("Additional charge label is required.");
    }
    airNonNegative(charge.amount.amount, charge.label);
    if (charge.amount.currency !== currency) {
      throw new Error(`Currency mismatch: ${charge.label}`);
    }
    additionalAmount += charge.amount.amount;
  }

  const totalAmount = baseAmount + additionalAmount;

  for (const [name, value] of Object.entries({
    totalVolumeCm3,
    volumetricWeightKg,
    chargeableWeightKg,
    baseAmount,
    additionalAmount,
    totalAmount,
  })) {
    if (!Number.isFinite(value)) {
      throw new Error(`${name} is not finite.`);
    }
  }

  return {
    totalVolumeCm3,
    volumetricWeightKg,
    chargeableWeightKg,
    baseFreight: { amount: baseAmount, currency },
    additionalChargesTotal: { amount: additionalAmount, currency },
    totalFreight: { amount: totalAmount, currency },
  };
}
```

**Observação de engenharia:** a implementação deve adaptar os dados ao contrato existente do motor aéreo, multiplicar o volume pela quantidade **uma única vez** e respeitar a base tarifária efetivamente selecionada. O código acima documenta a matemática e não autoriza alterações antecipadas no aplicativo.


## 4. Modal marítimo — pendente de aprovação

Reservado para as fórmulas LCL e FCL, tarifas, mínimos, custos opcionais, exemplos numéricos e representação TypeScript aprovados.

## 5. Condição para materialização

**Somente após a aprovação das fórmulas rodoviária, aérea e marítima** faremos alterações nos arquivos da aplicação. Este documento registra a especificação; não autoriza implementação antecipada.
