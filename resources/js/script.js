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

const backboneRowEl = $('#backbone');

calcularButtonEl.on('click', (e) => {
    $('.inserted').remove();

    tableEl.removeClass('hidden');

    calcularBackbone();
});

function calcularBackbone()
{
    //Numeração dos itens na tabela
    let i = 1;

    //Faz referência ao último item inserido 
    let trEl;

    const pavimentos = parseInt(inputs['pavimentos'].val());

    const caracteristicaFibra = parseInt($('#caracteristicas').val());

    const quantidadeBackbone = parseInt(inputs['qtd-backbone'].val());

    const paresPorCabo = parseInt(inputs['disponivel'].val());

    const peDireito = parseInt(inputs['pe-direito'].val());

    const paresPorAndar = paresPorCabo * quantidadeBackbone;
    const paresTotal = paresPorAndar * (pavimentos - 1);

    const fibrasPorAndar = paresPorAndar * 2;
    const fibrasTotal = paresTotal * 2;

    const tamanhoCabo = calcularCaboFO(pavimentos, peDireito);

    const quantidadeDio = Math.ceil((paresTotal / 2) / 24);

    const tipoFibra = caracteristicaFibra === 1 ? '50 x 125µm - MM':  '9 x 125µm - SM';

    const acoplador = paresPorAndar * (pavimentos - 1);

    const bandeja = Math.ceil(fibrasTotal / 12);

    const tamanhoTerminador = fibrasPorAndar <= 8 ? fibrasPorAndar : 8;
    const terminadoresTotal = Math.ceil((fibrasPorAndar) / tamanhoTerminador) * (pavimentos - 1);

    const pigTailInterno = fibrasTotal;

    const pigTail = paresTotal;

    const cordaoOptico = paresPorCabo;

    const cordaoOpticoTotal = cordaoOptico * (pavimentos - 1);

    trEl = inserirLinha(i++, `Cabo de Fibra Óptica Tight Buffer ${caracteristicaFibra === 1 ? '(FOMMIG) 50 x 125µm' : '(FOSMIG) 9 x 125µm'} - com ${paresPorCabo} fibras`, 'metros', tamanhoCabo, backboneRowEl);
    trEl = inserirLinha(i++, 'Chassi DIO (Distribuido Interno Óptico) com 24 portas - 1U - 19"', 'unid', quantidadeDio, trEl);
    trEl = inserirLinha(i++, `Acoplador óptico ${tipoFibra} - LC - duplo`, 'unid', acoplador, trEl);
    trEl = inserirLinha(i++, 'Bandeja para emenda de fibra no DIO - (comporta até 12 emendas)', 'unid', bandeja, trEl);
    trEl = inserirLinha(i++, `Terminador Óptico - ${tamanhoTerminador}`, 'unid', terminadoresTotal, trEl);
    trEl = inserirLinha(i++, `Pig tail ${tipoFibra} - 1,5m - simples - conector LC`, 'unid', pigTailInterno, trEl);
    trEl = inserirLinha(i++, `Pig tail ${tipoFibra} - 3,0m - duplo - conector LC`, 'unid', pigTail, trEl);
    trEl = inserirLinha(i++, `Cordão Óptico ${tipoFibra} - 3m - duplo - conector LC`, 'unid', cordaoOpticoTotal, trEl);
}

function calcularCaboFO(pavimentos, peDireito) {
    let tamanhoCabo = 0;

    for(let j = 1; j <= pavimentos - 1; j++) 
    {
        tamanhoCabo += peDireito * (j + 2);
    }

    tamanhoCabo = Math.ceil(tamanhoCabo * 1.2);

    return tamanhoCabo;
}

function calcularDIO() {

}

function calcularAcoplador() {

}

function calcularBandeja() {
    
}

function calcularTerminador() {

}

function calcularPigTailInterno() {

}

function calcularPigTail() {

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