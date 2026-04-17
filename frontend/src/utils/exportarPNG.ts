import { QuitacaoResponse, QuitacaoRequest } from '@/services/api';

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const fmtDate = (iso: string) => iso.split('-').reverse().join('/');
const safeDate = (iso: string) => iso.split('-').reverse().join('-');

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  r: number, fill: string, stroke?: string
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function txt(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number, y: number,
  size: number,
  color: string,
  weight = 'normal',
  align: CanvasTextAlign = 'left'
) {
  ctx.save();
  ctx.font = `${weight} ${size}px Arial, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  ctx.fillText(value, x, y);
  ctx.restore();
}

function desenharCanvas(
  ctx: CanvasRenderingContext2D,
  resultado: QuitacaoResponse,
  formData: QuitacaoRequest,
  W: number,
  H: number,
  SCALE: number
) {
  const pad = 20;
  const cardW = W - pad * 2;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(SCALE, SCALE);

  // fundo
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, W, H);

  // header
  ctx.fillStyle = '#1e40af';
  ctx.fillRect(0, 0, W, 175);

  txt(ctx, 'QUITAÇÃO ANTECIPADA', pad, 24, 10, '#93c5fd', 'bold');
  txt(ctx, `Data-base: ${fmtDate(formData.dataQuitacao)}`, pad, 42, 12, '#bfdbfe');
  txt(ctx, fmt(resultado.valorQuitacao), pad, 68, 32, '#ffffff', 'bold');

  // barra progresso
  const pct = Math.min(resultado.valorQuitacao / resultado.totalNominal, 1);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(pad, 118, cardW, 6);
  ctx.fillStyle = '#22d3ee';
  ctx.fillRect(pad, 118, cardW * pct, 6);

  txt(ctx, `${(pct * 100).toFixed(1)}% do total de ${fmt(resultado.totalNominal)}`, pad, 130, 10, '#bfdbfe');
  txt(ctx, `Taxa: ${formData.jurosMensal}% a.m.  ·  ${resultado.parcelas.length} parcelas`, pad, 146, 10, '#bfdbfe');

  // card economia
  let y = 191;
  fillRoundRect(ctx, pad, y, cardW, 80, 10, '#ffffff', '#e2e8f0');
  txt(ctx, 'ECONOMIA OBTIDA', pad + 14, y + 12, 9, '#64748b', 'bold');
  txt(ctx, fmt(resultado.economiaObtida), pad + 14, y + 28, 24, '#15803d', 'bold');
  txt(ctx, `${resultado.percentualEconomizado}% de desconto sobre o total nominal`, pad + 14, y + 60, 10, '#94a3b8');

  y += 80 + 12;

  // grid 2x2
  const gW = (cardW - 10) / 2;
  const gH = 74;

  const cells = [
    { label: 'TOTAL NOMINAL',    value: fmt(resultado.totalNominal),         sub: 'sem antecipação',  color: '#dc2626', bg: '#fff1f2', border: '#fecdd3' },
    { label: 'DESCONTO MÉDIO',   value: fmt(resultado.descontoMedioParcela), sub: 'por parcela',      color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
    { label: 'VALOR DA PARCELA', value: fmt(formData.valorParcela),          sub: 'original',         color: '#374151', bg: '#ffffff', border: '#e2e8f0' },
    { label: 'PARCELAS',         value: String(resultado.parcelas.length),   sub: 'antecipadas',      color: '#374151', bg: '#ffffff', border: '#e2e8f0' },
  ];

  cells.forEach((cell, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = pad + col * (gW + 10);
    const cy = y + row * (gH + 10);
    fillRoundRect(ctx, cx, cy, gW, gH, 10, cell.bg, cell.border);
    txt(ctx, cell.label, cx + 12, cy + 10, 9,  '#64748b', 'bold');
    txt(ctx, cell.value, cx + 12, cy + 26, 16, cell.color, 'bold');
    txt(ctx, cell.sub,   cx + 12, cy + 54, 10, '#94a3b8');
  });

  y += 2 * (gH + 10) + 2;

  // período
  fillRoundRect(ctx, pad, y, cardW, 54, 10, '#ffffff', '#e2e8f0');
  const p1 = resultado.parcelas[0]?.vencimento ?? '-';
  const pN = resultado.parcelas.at(-1)?.vencimento ?? '-';
  txt(ctx, 'PERÍODO ANTECIPADO', pad + 14, y + 10, 9, '#64748b', 'bold');
  txt(ctx, `${p1}  →  ${pN}`, pad + 14, y + 28, 13, '#1e293b', 'bold');

  y += 54 + 12;

  // aviso
  ctx.save();
  ctx.font = '9px Arial, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Resultado meramente informativo. Compare com o cálculo da instituição financeira.', W / 2, y);
  ctx.restore();
}

export function exportarPNG(
  resultado: QuitacaoResponse,
  formData: QuitacaoRequest
): Promise<void> {
  const W = 390;
  const H = 700;
  const SCALE = 2;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width  = W * SCALE;
    canvas.height = H * SCALE;

    // Firefox exige que o canvas esteja no DOM para toBlob funcionar corretamente.
    // visibility:hidden esconde sem suprimir o compositing (diferente de display:none).
    canvas.style.position = 'fixed';
    canvas.style.top = '-9999px';
    canvas.style.left = '-9999px';
    canvas.style.visibility = 'hidden';
    document.body.appendChild(canvas); // ✅ no DOM ANTES de desenhar

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      document.body.removeChild(canvas);
      reject(new Error('Canvas 2D indisponivel'));
      return;
    }

    // Desenha tudo sincronamente enquanto o canvas já está no DOM
    desenharCanvas(ctx, resultado, formData, W, H, SCALE);

    // Um único rAF para o Firefox confirmar o compositing antes do toBlob
    requestAnimationFrame(() => {
      canvas.toBlob((blob) => {
        document.body.removeChild(canvas); // cleanup imediato

        if (!blob) {
          reject(new Error('toBlob retornou null'));
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `quitacao-${safeDate(formData.dataQuitacao)}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        resolve();
      }, 'image/png');
    });
  });
}