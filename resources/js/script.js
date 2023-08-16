const formEl = $('#form');

formEl.submit((e) => {e.preventDefault();});

const inputs = {};

formEl.find('input').not(':submit').toArray().forEach((el) => {
    let input = $(el);
    let inputName = input.attr('name');

    inputs[inputName] = input;
});

const calcularButtonEl = $('#calcular');

const tableEl = $('.table');

const areaDeTrabalhoRowEl = $('#area-trabalho');

const cabeamentoHorizontalRowEl = $('#cabeamento-horizontal');

const SEQSETRowEl = $('#seq-set');

const SEQRowEl = $('#seq');

const SETRowEl = $('#set');

const backboneRowEl = $('#backbone');

const miscelaneaRowEl = $('#miscelanea');

let pavimentos;
let pontosTelecomAndar;
let pontosTelecomTotal;
let pontosRedeAndar;
let pontosRedeTotal;
let tipoRack;

calcularButtonEl.on('click', (e) => {
    pavimentos = parseInt(inputs['pavimentos'].val());

    $('.inserted').remove();

    tableEl.removeClass('hidden');

    //calcularAreaDeTrabalho();
    //calcularCabeamentoHorizontal();
    calcularBackbone();
    //calcularSEQSET();
    //calcularMiscelanea();
});

function calcularBackbone()
{
    let i = 1;
    let trEl;

    const caracteristicaFibra = parseInt($('#caracteristicas').val());

    const quantidadeBackbone = inputs['qtd-backbone'].val();

    const paresDisponiveis = inputs['disponivel'].val() * 2;

    console.log(paresDisponiveis);

    const peDireito = inputs['pe-direito'].val();

    let tamanhoCabo = 0;

    for(let j = 1; j <= pavimentos - 1; j++) 
    {
        tamanhoCabo += peDireito * (j + 2);
    }

    tamanhoCabo = Math.ceil(tamanhoCabo * 1.2);

    const fibrasTotal = paresDisponiveis * (pavimentos - 1) * quantidadeBackbone;

    const quantidadeDio = Math.ceil((fibrasTotal / 2) / 24);

    const tipoFibra = caracteristicaFibra === 1 ? '50 x 125µm - MM':  '9 x 125µm - SM';

    const acopladorBBInterno = paresDisponiveis;
    const acopladorBBInternoTotal = acopladorBBInterno * (pavimentos - 1);

    //const acopladorBBExterno = fibrasPorCabo / 2;

    const bandeja = Math.ceil(fibrasTotal / 12);

    const tamanhoTerminador = paresDisponiveis * 2 <= 8 ? paresDisponiveis * 2 : 8;
    const terminadoresTotal = pavimentos;

    const pigTail = fibrasTotal / 2;

    const cordaoOptico = paresDisponiveis;

    const cordaoOpticoTotal = cordaoOptico * (pavimentos - 1);

    trEl = inserirLinha(i++, `Cabo de Fibra Óptica Tight Buffer ${caracteristicaFibra === 1 ? '(FOMMIG) 50 x 125µm' : '(FOSMIG) 9 x 125µm'} - com ${paresDisponiveis} fibras`, 
                        'metros', tamanhoCabo, backboneRowEl);
    trEl = inserirLinha(i++, 'Chassi DIO (Distribuido Interno Óptico) com 24 portas - 1U - 19"', 'unid', quantidadeDio, trEl);
    trEl = inserirLinha(i++, `Acoplador óptico ${tipoFibra} - LC - duplo`, 'unid', acopladorBBInternoTotal, trEl);
    //trEl = inserirLinha(i++, 'Acoplador óptico 9 x 125µm - SM - LC - duplo', 'unid', acopladorBBExterno, acopladorBBExterno, trEl);
    trEl = inserirLinha(i++, 'Bandeja para emenda de fibra no DIO - (comporta até 12 emendas)', 'unid', bandeja, trEl);
    trEl = inserirLinha(i++, `Terminador Óptico - ${paresDisponiveis * 2}`, 'unid', terminadoresTotal, trEl);
    trEl = inserirLinha(i++, `Pig tail ${tipoFibra} - 1,5m - duplo - conector LC`, 'unid', pigTail, trEl);
    trEl = inserirLinha(i++, `Pig tail ${tipoFibra} - 3,0m - duplo - conector LC`, 'unid', pigTail, trEl);
    trEl = inserirLinha(i++, `Cordão Óptico ${tipoFibra} - 3m - duplo - conector LC`, 'unid', cordaoOpticoTotal, trEl);
    //trEl = inserirLinha(i++, 'Pig tail 50 x 125µm - SM - 1,5m - simples - conector LC', 'unid', fibrasPorCabo, fibrasPorCabo, trEl);
    //trEl = inserirLinha(i++, `Cordão Óptico 9 x 125µm - SM - 3m - duplo - conector LC`, 'unid', fibrasPorCabo / 2, fibrasPorCabo / 2, trEl);
}

function inserirLinha(numero, descricao, unidade, quantidadeTotal, linhaReferencia) 
{
    let trEl = $('<tr>');

    trEl.append($('<td>').text(numero));
    trEl.append($('<td>').text(descricao));
    trEl.append($('<td>').text(unidade));
    trEl.append($('<td>').text(quantidadeTotal));

    trEl.attr('class', 'inserted');

    tableEl.find(linhaReferencia).after(trEl);

    return trEl;
}

/*
function calcularAreaDeTrabalho() 
{
    let i = 1;

    let trEl;

    trEl = inserirLinha(i++, 'Tomada RJ45 fêmea categoria 6', 'unid.', pontosRedeAndar, pontosRedeTotal, areaDeTrabalhoRowEl);
    trEl = inserirLinha(i++, 'Espelhos 4x4 - 2 furações/entradas', 'unid.', pontosTelecomAndar, pontosTelecomTotal, trEl);
    trEl = inserirLinha(i++, 'Patch Cord categoria 6, azul, 3 metros', 'unid.', pontosRedeAndar, pontosRedeTotal, trEl);
    trEl = inserirLinha(i++, 'Etiquetas para identificação de tomada e espelho', 'unid.', (pontosRedeAndar + pontosTelecomAndar), (pontosRedeTotal + pontosTelecomTotal), trEl);
}

function calcularCabeamentoHorizontal() 
{
    let i = 1;

    let trEl;

    const distanciaMH = inputs['distancia-malha'].val();

    const malhaHorizontalAndar = Math.ceil((pontosRedeAndar * distanciaMH) / 305);

    trEl = inserirLinha(i++, 'Cabo UTP par trançado categoria 6 (MH)', 'caixas', malhaHorizontalAndar, malhaHorizontalAndar * inputs['pavimentos'].val(), cabeamentoHorizontalRowEl);
    trEl = inserirLinha(i++, 'Etiqueta para identificação do cabo de malha horizontal', 'unid.', pontosRedeAndar * 2, pontosRedeTotal * 2, trEl);
}

function calcularSEQSET() 
{
    let i = 1;

    let trEl;

    const patchPanels = Math.ceil(pontosRedeAndar / 24);
    const patchPanelsTotal = patchPanels * pavimentos;

    const switches = patchPanels;
    const switchesTotal = patchPanelsTotal;

    const organizadores = patchPanels + switches;
    const organizadoresTotal = organizadores * pavimentos;

    let strTipoRack = 'aberto';

    let tamanhoReal = patchPanels + switches + organizadores + 4;

    //SEQ e SET
    trEl = inserirLinha(i++, 'Patch Panel categoria 6, 24 portas, 1U (PPMH)', 'unid.', patchPanels, patchPanelsTotal, SEQSETRowEl);
    trEl = inserirLinha(i++, 'Etiqueta para identificação de portas do Patch Panel', 'unid.', patchPanels * 24, patchPanelsTotal * 24, trEl);
    trEl = inserirLinha(i++, 'Etiqueta para identificação do Patch Panel', 'unid.', patchPanels, patchPanelsTotal, trEl);
    trEl = inserirLinha(i++, 'Switch categoria 6, 24 portas, 1U', 'unid.', switches, switchesTotal, trEl);
    trEl = inserirLinha(i++, 'Etiqueta para identificação de portas do Switch', 'unid.', switches * 24, switchesTotal * 24, trEl);
    trEl = inserirLinha(i++, 'Etiqueta para identificação do Switch', 'unid.', switches, switchesTotal, trEl);
    trEl = inserirLinha(i++, 'Organizador frontal de cabo', 'unid.', organizadores, organizadoresTotal, trEl);
    trEl = inserirLinha(i++, 'Patch Cable categoria 6, azul, 3 metros', 'unid.', pontosRedeAndar, pontosRedeTotal, trEl);
    trEl = inserirLinha(i++, 'Etiqueta para identificação do Patch Cable', 'unid.', pontosRedeAndar * 2, pontosRedeTotal * 2, trEl);
    trEl = inserirLinha(i++, 'Bandeja Fixa 4U', 'unid.', 1, pavimentos, trEl);

    if(tipoRack === 2) 
    {
        trEl = inserirLinha(i++, 'Exaustor de calor 19"', 'unid.', 1, pavimentos, trEl);

        tamanhoReal++;

        strTipoRack = 'fechado';
    }

    //SEQ
    i = 1;

    const tamanhoRealSEQ = tamanhoReal + 2; //Switch workgroup, + 1 organizador frontal

    trEl = inserirLinha(i++, 'Switch backbone', 'unid.', 1, 1, SEQRowEl);

    calcularRack(i, tamanhoRealSEQ, trEl, 'SEQ', strTipoRack);

    //SET
    calcularRack(1, tamanhoReal, SETRowEl, 'SET', strTipoRack);
}

function calcularMiscelanea() 
{
    let i = 1;

    let trEl;

    const abracadeiras = Math.ceil(pontosRedeAndar / 100);
    const abracadeirasTotal = abracadeiras * pavimentos;

    trEl = inserirLinha(i++, 'Abraçadeira de velcro (conjunto 100 unidades)', 'conjunto', abracadeiras, abracadeirasTotal, miscelaneaRowEl);
    trEl = inserirLinha(i++, 'Abraçadeira Hellermann (conjunto 100 unidade)', 'conujunto', abracadeiras, abracadeirasTotal, trEl);
    trEl = inserirLinha(i++, 'Filtro de linha com 6 tomadas', 'unid.', 1, pavimentos, trEl);
}

function calcularTamanhoRack(tamanhoReal) 
{
    const tamanhosFixos = [6, 8, 10, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48];

    const tamanhoTotal = tamanhoReal * 1.5;

    const tamanhoRack = tamanhosFixos.reduce((prev, curr) => {
        return Math.abs(curr - tamanhoTotal) < Math.abs(prev - tamanhoTotal) ? curr : prev;
    })

    return tamanhoRack;
}

function calcularRack(i, tamanhoReal, targetRow, tipoSala, strTipoRack) 
{
    let trEl;

    const tamanhoRack = calcularTamanhoRack(tamanhoReal);

    const porcasGaiola = Math.ceil((tamanhoRack * 4) / 10);
    const porcasGaiolaTotal = tipoSala === 'SEQ' ? porcasGaiola : porcasGaiola * (pavimentos - 1);

    const reguaFechamento = tamanhoRack - tamanhoReal;
    const reguaFechamentoTotal = tipoSala === 'SEQ' ? reguaFechamento : reguaFechamento * (pavimentos - 1);

    trEl = inserirLinha(i++, `Rack ${strTipoRack}, largura de 19", tamanho de ${tamanhoRack}U`, 'unid.', 1, tipoSala === 'SEQ' ? 1 : (pavimentos - 1), targetRow);
    trEl = inserirLinha(i++, 'Régua de fechamento', 'unid.', reguaFechamento, reguaFechamentoTotal, trEl);
    trEl = inserirLinha(i++, 'Parafuso porca gaiola (conjunto de 10 unidade)', 'conjunto', porcasGaiola, porcasGaiolaTotal, trEl);
}
*/