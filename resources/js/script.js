const formEl = $('#form');

formEl.submit((e) => { e.preventDefault(); });

const options = {};

formEl.find('input').not(':submit').not(':radio').each(function ()
{
    let input = $(this);
    let inputName = input.attr('name');

    options[inputName] = input;
});

formEl.find('select').toArray().forEach((el) =>
{
    let select = $(el);
    let selectName = select.attr('name');

    options[selectName] = select;
});

console.log(options)

const calcularButtonEl = $('#calcular');

const tableEl = $('.table');

const backboneRowEl = $('#backbone');

let equipamentos = [];

const possuiSecundarioInputs = $('input[name="possui-secundario"]');

const containerBackboneSecundarioEl = $('#container-backbone-secundario');

let possuiSecundario = !!parseInt($('input[name="possui-secundario"]:checked').val());

possuiSecundarioInputs.each(function ()
{
    $(this).on('click', (e) =>
    {
        possuiSecundario = !!parseInt($(this).val());

        possuiSecundario === true ? containerBackboneSecundarioEl.removeClass('hidden') : containerBackboneSecundarioEl.addClass('hidden');
    })
});

calcularButtonEl.on('click', (e) =>
{
    $('.inserted').remove();

    tableEl.removeClass('hidden');

    calcularBackbonePrimario();

    calcularBackboneSecundario();

    inserirLinhas();

    equipamentos = [];
});

function calcularBackbonePrimario()
{
    const caracteristicaFibra = parseInt(options['caracteristicas-primario'].val());

    const quantidadeBackbone = parseInt(options['backbone-primario'].val());

    const pares = parseInt(options['disponivel-primario'].val());

    //DIO
    const quantidadeDIO = Math.ceil((pares / 2) / 24) * 2; //Multiplicando por 2 por se tratar de duas salas de equipamentos diferentes

    atualizarEquipamentos('dio', 'Chassi DIO (Distribuidor Interno Óptico) com 24 portas - 1U - 19"', 'unid.', quantidadeDIO);

    //Acoplador
    const acoplador = pares * 2;

    atualizarEquipamentos('acoplador 9 x 125µm - SM', 'Acoplador óptico 9 x 125µm - SM - LC - duplo', 'unid.', acoplador);

    //Pig tail

    const pigTail = pares * 2 * 2;

    atualizarEquipamentos('pig tail simples 9 x 125µm - SM', 'Pig tail 9 x 125µm - SM - 1,5m - simples - conector LC', 'unid', pigTail);
}

function calcularBackboneSecundario()
{
    if (!possuiSecundario)
        return;

    const pavimentos = parseInt(options['pavimentos'].val());

    const caracteristicaFibra = parseInt(options['caracteristicas-secundario'].val());

    const quantidadeBackbone = parseInt(options['backbone-secundario'].val());

    const paresPorCabo = parseInt(options['disponivel-secundario'].val());

    const peDireito = parseInt(options['pe-direito'].val());

    const especificacao = caracteristicaFibra === 1 ? '50 x 125µm - MM' : '9 x 125µm - SM';

    const paresPorAndar = paresPorCabo * quantidadeBackbone;
    const paresTotal = paresPorAndar * (pavimentos - 1);

    const fibrasPorAndar = paresPorAndar * 2;
    const fibrasTotal = paresTotal * 2;

    //Cabo
    let tamanhoCabo = 0;

    for (let j = 1; j <= pavimentos - 1; j++) 
    {
        tamanhoCabo += peDireito * (j + 2);
    }

    tamanhoCabo = Math.ceil(tamanhoCabo * 1.2);

    atualizarEquipamentos('cabo', `Cabo de Fibra Óptica Tight Buffer ${caracteristicaFibra === 1 ? '(FOMMIG) 50 x 125µm' : '(FOSMIG) 9 x 125µm'} - com ${paresPorCabo} fibras`, 'metros', tamanhoCabo);

    //DIO
    const quantidadeDio = Math.ceil((paresTotal / 2) / 24);

    atualizarEquipamentos('dio', 'Chassi DIO (Distribuido Interno Óptico) com 24 portas - 1U - 19"', 'unid', quantidadeDio);

    //Acoplador
    const acoplador = paresPorAndar * (pavimentos - 1);

    atualizarEquipamentos(`acoplador ${especificacao}`, `Acoplador óptico ${especificacao} - LC - duplo`, 'unid', acoplador);

    //Bandeja
    const bandeja = Math.ceil(fibrasTotal / 12);

    atualizarEquipamentos('bandeija', 'Bandeja para emenda de fibra no DIO - (comporta até 12 emendas)', 'unid', bandeja);

    //Terminador
    const tamanhoTerminador = fibrasPorAndar <= 8 ? fibrasPorAndar : 8;
    const terminadoresTotal = Math.ceil((fibrasPorAndar) / tamanhoTerminador) * (pavimentos - 1);

    atualizarEquipamentos('terminador', `Terminador Óptico - ${tamanhoTerminador}`, 'unid', terminadoresTotal);

    //Pig tail interno
    const pigTailInterno = fibrasTotal;

    atualizarEquipamentos(`pig tail simples ${especificacao}`, `Pig tail ${especificacao} - 1,5m - simples - conector LC`, 'unid', pigTailInterno);

    //Pig tail externo
    const pigTailExterno = paresTotal;

    atualizarEquipamentos(`pig tail duplo ${especificacao}`, `Pig tail ${especificacao} - 3,0m - duplo - conector LC`, 'unid', pigTailExterno);

    //Cordão óptico
    const cordaoOptico = paresPorCabo;

    const cordaoOpticoTotal = cordaoOptico * (pavimentos - 1);

    atualizarEquipamentos('cordao', `Cordão Óptico ${especificacao} - 3m - duplo - conector LC`, 'unid', cordaoOpticoTotal);
}

function atualizarEquipamentos(chave, descricao, unidade, quantidade)
{
    if (equipamentos[chave] === undefined)
    {
        equipamentos[chave] = {
            descricao: descricao,
            unidade: unidade,
            quantidade: quantidade
        };

        return;
    }

    equipamentos[chave].quantidade += quantidade;
}

function inserirLinhas() 
{
    for (const key in equipamentos) 
    {
        let equipamento = equipamentos[key];

        let elements = $('.inserted');

        let trEl = $('<tr>');

        trEl.append($('<td>').text(elements.length + 1));
        trEl.append($('<td>').text(equipamento.descricao));
        trEl.append($('<td>').text(equipamento.unidade));
        trEl.append($('<td>').text(equipamento.quantidade));

        trEl.attr('class', 'inserted');

        tableEl.find(elements.last().length === 0 ? backboneRowEl : elements.last()).after(trEl);
    }
}