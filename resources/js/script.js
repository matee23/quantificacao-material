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

    pontosTelecomAndar = parseInt(inputs['pontos-telecom'].val());

    pontosTelecomTotal = pontosTelecomAndar * pavimentos;

    pontosRedeAndar = pontosTelecomAndar * 2;

    pontosRedeTotal = pontosTelecomTotal * 2;

    tipoRack = parseInt($('#tipo-rack').val());

    $('.inserted').remove();

    tableEl.removeClass('hidden');

    calcularAreaDeTrabalho();
    calcularCabeamentoHorizontal();
    calcularSEQSET();
    calcularBackbone();
    calcularMiscelanea();
});

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

    const tamanhoRack = calcularTamanhoRack(tamanhoReal);

    const porcasGaiola = Math.ceil((tamanhoRack * 4) / 10);
    const porcasGaiolaTotal = porcasGaiola * pavimentos;

    const reguaFechamento = tamanhoRack - tamanhoReal;
    const reguaFechamentoTotal = reguaFechamento * pavimentos;

    trEl = inserirLinha(i++, `Rack ${strTipoRack}, largura de 19", tamanho de ${tamanhoRack}U`, 'unid.', 1, pavimentos, trEl);
    trEl = inserirLinha(i++, 'Régua de fechamento', 'unid.', reguaFechamento, reguaFechamentoTotal, trEl);
    trEl = inserirLinha(i++, 'Parafuso porca gaiola (conjunto de 10 unidade)', 'conjunto', porcasGaiola, porcasGaiolaTotal, trEl);
}

function calcularBackbone()
{
    let i = 1;
    let trEl;

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

function inserirLinha(numero, descricao, unidade, quantidadePorAndar, quantidadeTotal, linhaReferencia) 
{
    let trEl = $('<tr>');

    trEl.append($('<td>').text(numero));
    trEl.append($('<td>').text(descricao));
    trEl.append($('<td>').text(unidade));
    trEl.append($('<td>').text(quantidadePorAndar));
    trEl.append($('<td>').text(quantidadeTotal));

    trEl.attr('class', 'inserted');

    tableEl.find(linhaReferencia).after(trEl);

    return trEl;
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