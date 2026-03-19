const produtos = [
  {
    id:1,
    nome:'X-Burguer',
    preco:15,
    img:'download (3).jpg',
    descricao:'Pão, carne, queijo e molho especial',
    categoria:'Hambúrguer',
    avaliacao:4.8
  },
  {
    id:2,
    nome:'Coca-Cola',
    preco:5,
    img:'download (2).jpg',
    descricao:'Refrigerante gelado, lata 350ml',
    categoria:'Bebida',
    avaliacao:4.7
  },
  {
    id:3,
    nome:'Batata Frita',
    preco:10,
    img:'download (4).jpg',
    descricao:'Batata crocante e sequinha com sal',
    categoria:'Acompanhamento',
    avaliacao:4.6
  },
  {
    id:4,
    nome:'Pizza',
    preco:33,
    img:'download (6).jpg',
    descricao:'Pizza sabor tradicional com queijo e molho especial',
    categoria:'Pizza',
    avaliacao:4.9
  },
  {
    id:5,
    nome:'Combo Batata Frita+Coca-cola',
    preco:25,
    img:'download (5).jpg',
    descricao:'Combo com batata frita + Coca-Cola gelada',
    categoria:'Combo',
    avaliacao:4.8
  },
  {
    id:6,
    nome:'Suco',
    preco:2,
    img:'download (7).jpg',
    descricao:'Suco natural refrescante',
    categoria:'Bebida',
    avaliacao:4.5
  }
];

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function salvar(){ localStorage.setItem('carrinho', JSON.stringify(carrinho)); }
function imprimirPedido() {
  const codigo = gerarCodigoPedido();
  let total = 0;

  const linhasProdutos = carrinho.map(p => {
    const subtotal = p.preco * p.qtd;
    total += subtotal;
    return `<tr>
              <td style="padding:5px 0;">${p.nome}</td>
              <td style="text-align:center;">${p.qtd}</td>
              <td style="text-align:right;">R$ ${subtotal.toFixed(2)}</td>
            </tr>`;
  }).join('');

  // CNPJ fake
  const cnpjFake = "12.345.678/0001-90";

  const htmlPedido = `
    <div id="pedido" style="font-family: 'Courier New', monospace; width: 300px; margin:auto; padding:10px; font-size:12px; color:#000;">

  <div style="text-align:center;">
    <strong>PEDIDOS20 LANCHES</strong><br>
    CNPJ: ${cnpjFake}<br>
    Rua Exemplo, 123<br>
    Ananindeua - PA<br>
    Tel: (91) 99999-9999
  </div>

  <div style="margin:8px 0;">
    ============================
  </div>

<div style="display:flex; justify-content:center; margin-bottom:5px;">
  <div style="font-size:22px; font-weight:bold; text-align:center;">
    Pedido: ${codigo}
  </div>
</div>

<strong style="display:block; text-align:center;">CUPOM NÃO FISCAL</strong><br>

Tipo: ${opcaoConsumo}<br>
Data: ${new Date().toLocaleDateString('pt-BR')}<br>
Hora: ${new Date().toLocaleTimeString('pt-BR')}<br>
Caixa: 01<br>
Operador: SISTEMA

  <div style="margin:8px 0;">
    ----------------------------
  </div>
      <hr style="border:none; border-top:1px dashed #aaa; margin:10px 0;">
      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        <thead>
          <tr>
            <th style="text-align:left;">Produto</th>
            <th style="text-align:center;">Qtd</th>
            <th style="text-align:right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${linhasProdutos}
        </tbody>
      </table>
      <hr style="border:none; border-top:1px dashed #aaa; margin:10px 0;">
      <div style="text-align:right; font-size:16px; font-weight:bold; color:#00000;">
        Total: R$ ${total.toFixed(2)}
      </div>
      <div id="qrcode" style="margin:15px auto; width:100px; height:100px;"></div>
      <p style="text-align:center; font-size:12px; color:#999; margin-top:10px;">
        Obrigado pela preferência! 🍽️
      </p>
    </div>
  `;

  const printWindow = window.open('', '', 'width=400,height=650');
  printWindow.document.write(`<html><head><title>Pedido ${codigo}</title></head><body>${htmlPedido}</body></html>`);
  printWindow.document.close();

  const script = printWindow.document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
  script.onload = function() {
    new printWindow.QRCode(printWindow.document.getElementById("qrcode"), {
      text: `Pedido: ${codigo} | Total: R$${total.toFixed(2)}`,
      width: 100,
      height: 100,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: printWindow.QRCode.CorrectLevel.H
    });

    printWindow.focus();
    printWindow.print();
  };
  printWindow.document.body.appendChild(script);
}
function renderProdutos(){
  const div = document.getElementById('produtos');
  const busca = document.getElementById('search').value.toLowerCase();
  div.innerHTML = '';

  produtos
    .filter(p=>p.nome.toLowerCase().includes(busca))
    .forEach(p=>{
      div.innerHTML += `
        <div class="bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden fade-in">
          <img src="${p.img}" class="w-full h-40 object-cover" />
          <div class="p-4">
           <h3 class="font-semibold text-lg">${p.nome}</h3>

<p class="text-gray-400 text-sm">${p.descricao}</p>

<p class="text-xs text-gray-500">
  📂 ${p.categoria} • ⭐ ${p.avaliacao}
</p>

<p class="text-gray-600 font-semibold mt-2 mb-3">
  R$ ${p.preco}
</p>
            <button onclick="add(${p.id})" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl transition">
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      `;
    });
}

function add(id){
  const item = carrinho.find(p=>p.id===id);
  if(item){ item.qtd++; }
  else {
    const prod = produtos.find(p=>p.id===id);
    carrinho.push({...prod, qtd:1});
  }
  atualizarQtd();
  salvar();
}

function remover(id){
  carrinho = carrinho.filter(p=>p.id!==id);
  atualizarCarrinho();
  atualizarQtd();
  salvar();
}

function atualizarQtd(){
  const total = carrinho.reduce((acc,p)=>acc+p.qtd,0);
  document.getElementById('qtd').innerText = total;
}

function abrirCarrinho(){
  document.getElementById('modal').classList.remove('hidden');
  atualizarCarrinho();
}

function fecharCarrinho(){
  document.getElementById('modal').classList.add('hidden');
}

function atualizarCarrinho(){
  const lista = document.getElementById('lista');
  lista.innerHTML = '';
  let total = 0;

  carrinho.forEach(p=>{
    total += p.preco * p.qtd;
    lista.innerHTML += `
      <li class="flex justify-between items-center">
        <div>
          <p class="font-medium">${p.nome} x${p.qtd}</p>
          <small class="text-gray-500">R$ ${p.preco}</small>
        </div>
        <button onclick="remover(${p.id})" class="text-red-500 text-sm">Remover</button>
      </li>
    `;
  });

  document.getElementById('total').innerText = total;
}
function gerarCodigoPedido(){
  let contador = localStorage.getItem('pedido_contador');

  if(!contador){
    contador = 1;
  } else {
    contador = parseInt(contador) + 1;
  }

  // Limite até 300 (opcional)
  if(contador > 300){
    contador = 1; // reinicia
  }

  localStorage.setItem('pedido_contador', contador);

  // Retorna só 001, 002, 003...
  return String(contador).padStart(3, '0');
}

function enviarWhatsApp(){
  let total = 0;
  const codigo = gerarCodigoPedido();
  
  msg += `🍴 Opção: *${opcaoConsumo}*%0A`;

  let msg = '';

  msg += `🛒 *NOVO PEDIDO*%0A`;
  msg += `━━━━━━━━━━━━━━━━━━%0A`;
  msg += `📦 Pedido: *${codigo}*%0A`;
  msg += `📅 ${new Date().toLocaleDateString('pt-BR')}%0A`;
  msg += `⏰ ${new Date().toLocaleTimeString('pt-BR')}%0A`;
  msg += `📌 Status: *Aguardando confirmação*%0A`;
  msg += `━━━━━━━━━━━━━━━━━━%0A%0A`;

  msg += `📋 *RESUMO DO PEDIDO*%0A%0A`;

  carrinho.forEach((p)=>{
    const subtotal = p.preco * p.qtd;

    msg += `🔸 *${p.nome}*%0A`;
    msg += `   🧮 Qtd: ${p.qtd} | 💵 R$${p.preco}%0A`;
    msg += `   📊 Subtotal: *R$${subtotal}*%0A%0A`;

    total += subtotal;
  });

  msg += `━━━━━━━━━━━━━━━━━━%0A`;
  msg += `💰 *TOTAL GERAL: R$${total}*%0A`;
  msg += `━━━━━━━━━━━━━━━━━━%0A`;

  const numero = '5591980208294';

  window.open(`https://wa.me/${numero}?text=${msg}`, '_blank');
}
// eventos

document.getElementById('search').addEventListener('input', renderProdutos);
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    function toggleFavorito(id) {
      if (favoritos.includes(id)) {
        favoritos = favoritos.filter(f => f !== id);
      } else {
        favoritos.push(id);
      }

      localStorage.setItem('favoritos', JSON.stringify(favoritos));
      renderProdutos();
    }

    function renderProdutos() {
  const busca = document.getElementById('search').value.toLowerCase();
  const container = document.getElementById('produtos');
  container.innerHTML = '';

  produtos
    .filter(p => p.nome.toLowerCase().includes(busca))
    .forEach(prod => {
      container.innerHTML += `
        <div class="bg-white p-3 rounded-xl shadow relative">

          <button onclick="toggleFavorito(${prod.id})"
            class="absolute top-2 right-2 text-2xl">
            ${favoritos.includes(prod.id) ? '❤️' : '🤍'}
          </button>

          <img src="${prod.img}" class="w-full h-32 object-cover rounded-lg mb-2">

          <h2 class="font-bold">${prod.nome}</h2>
          <p class="text-sm text-gray-500">${prod.descricao}</p>

          <p class="text-green-600 font-bold mt-2">
            R$ ${prod.preco}
          </p>

          <button onclick="add(${prod.id})" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl mt-2 transition">
            Adicionar ao carrinho
          </button>
        </div>
      `;
    });
}
let opcaoConsumo = 'Levar'; // padrão

document.getElementById('opcao-levar').addEventListener('click', () => {
  opcaoConsumo = 'Levar';
  atualizarOpcaoUI();
});

document.getElementById('opcao-comer').addEventListener('click', () => {
  opcaoConsumo = 'Consumir no local';
  atualizarOpcaoUI();
});

function atualizarOpcaoUI() {
  document.getElementById('opcao-levar').classList.remove('bg-green-500', 'text-white');
  document.getElementById('opcao-comer').classList.remove('bg-green-500', 'text-white');
  document.getElementById('opcao-levar').classList.add('bg-gray-200', 'text-black');
  document.getElementById('opcao-comer').classList.add('bg-gray-200', 'text-black');

  if(opcaoConsumo === 'Levar') {
    document.getElementById('opcao-levar').classList.add('bg-green-500', 'text-white');
  } else {
    document.getElementById('opcao-comer').classList.add('bg-green-500', 'text-white');
  }
}
function atualizarOpcaoUI() {
  const levar = document.getElementById('opcao-levar');
  const comer = document.getElementById('opcao-comer');

  levar.classList.remove('btn-ativo');
  comer.classList.remove('btn-ativo');

  if (opcaoConsumo === 'Levar') {
    levar.classList.add('btn-ativo');
  } else {
    comer.classList.add('btn-ativo');
  }
}

renderProdutos();
atualizarQtd();
