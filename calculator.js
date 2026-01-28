function n(v) {
    const x = Number(v);
    return Number.isFinite(x) ? x : 0;
}

function brl(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function clamp01(x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return x;
}

/**
 * Premissas CLT (estimativa simples):
 * - Salário anual: 12 meses + 13º (1) + férias (1) + 1/3 férias (0,3333) = 14,3333 salários
 * - FGTS: 8% sobre 13 salários (12 + 13º). (Simplificado)
 * - Benefícios: somados mês a mês (x12)
 */
function calcCltTotalAnual(salarioBrutoMensal, beneficiosMensais) {
    const fatorSalarioAnual = 14.3333333333; // 12 + 1 + 1 + 1/3
    const salarioAnual = salarioBrutoMensal * fatorSalarioAnual;

    const fgtsAnual = salarioBrutoMensal * 13 * 0.08; // simplificado
    const beneficiosAnual = beneficiosMensais * 12;

    const totalAnual = salarioAnual + fgtsAnual + beneficiosAnual;
    return { totalAnual, salarioAnual, fgtsAnual, beneficiosAnual };
}

/**
 * PJ (estimativa genérica):
 * líquido = faturamento * (1 - taxaPJ - inss) - contabilidade
 * faturamento necessário (para bater CLT equivalente mensal):
 * faturamento = (alvoMensal + contabilidade) / (1 - taxaPJ - inss)
 */
function calcPj(fatorAlvoMensal, taxaPjPct, inssPct, contabMensal, margemPct) {
    const taxaPj = clamp01(taxaPjPct / 100);
    const inss = clamp01(inssPct / 100);
    const margem = clamp01(margemPct / 100);

    const alvoComMargem = fatorAlvoMensal * (1 + margem);

    const denom = 1 - taxaPj - inss;
    if (denom <= 0.05) {
        return { error: "Alíquotas muito altas. Ajuste impostos/INSS." };
    }

    const faturamento = (alvoComMargem + contabMensal) / denom;
    const tributos = faturamento * (taxaPj + inss);
    const liquido = faturamento - tributos - contabMensal;

    return { faturamento, tributos, liquido, alvoComMargem };
}

function getVal(id) {
    return document.getElementById(id).value;
}

function setText(id, text) {
    document.getElementById(id).textContent = text;
}

const form = document.getElementById("calcForm");
const emptyState = document.getElementById("emptyState");
const resultBox = document.getElementById("resultBox");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const salarioClt = n(getVal("salarioClt"));
    const vr = n(getVal("vr"));
    const vt = n(getVal("vt"));
    const plano = n(getVal("planoSaude"));
    const outros = n(getVal("outrosBenef"));

    const taxaPj = n(getVal("taxaPj"));
    const inssPj = n(getVal("inssPj"));
    const contab = n(getVal("contab"));
    const margem = n(getVal("margem"));

    const beneficiosMensais = vr + vt + plano + outros;

    const clt = calcCltTotalAnual(salarioClt, beneficiosMensais);
    const cltMensalEquiv = clt.totalAnual / 12;

    const pj = calcPj(cltMensalEquiv, taxaPj, inssPj, contab, margem);

    emptyState.style.display = "none";
    resultBox.classList.remove("hidden");

    setText("cltMensal", brl(cltMensalEquiv));
    setText("cltAnual", brl(clt.totalAnual));

    if (pj.error) {
        setText("pjFaturamento", "—");
        setText("pjLiquido", "—");
        setText("pjTributos", "—");
        setText("pjContab", brl(contab));
        document.getElementById("dicaTexto").textContent = pj.error;
        return;
    }

    setText("pjFaturamento", brl(pj.faturamento));
    setText("pjLiquido", brl(pj.liquido));
    setText("pjTributos", brl(pj.tributos));
    setText("pjContab", brl(contab));

    const dif = pj.liquido - cltMensalEquiv;
    const sinal = dif >= 0 ? "acima" : "abaixo";
    const difAbs = Math.abs(dif);

    document.getElementById("dicaTexto").textContent =
        `Com essas premissas, o PJ líquido fica ${brl(difAbs)} ${sinal} do equivalente CLT mensal. ` +
        `Se você quer mais “folga”, aumente a margem extra ou ajuste a alíquota conforme seu regime/atividade.`;
});
