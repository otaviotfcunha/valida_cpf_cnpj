$(function(){
    $('.cpf_cnpj').blur(function(){
        var cpf_cnpj = $(this).val();
        if ( formata_cpf_cnpj( cpf_cnpj ) ) {
            $(this).val( formata_cpf_cnpj( cpf_cnpj ) );
        } else {
            alert('CPF ou CNPJ inválido!');
			$(this).val("");
			$(this).focus();
        }
    });
});

function verifica_cpf_cnpj ( valor ) {

    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, '');
    if ( valor.length === 11 ) {
        return 'CPF';
    } 
    else if ( valor.length === 14 ) {
        return 'CNPJ';
    } 
    else {
        return false;
    }
    
}

function calc_digitos_posicoes( digitos, posicoes = 10, soma_digitos = 0 ) {

    digitos = digitos.toString();

    // Faz a soma dos dígitos com a posição
    // Ex. para 10 posições:
    //   0    2    5    4    6    2    8    8   4
    // x10   x9   x8   x7   x6   x5   x4   x3  x2
    //   0 + 18 + 40 + 28 + 36 + 10 + 32 + 24 + 8 = 196
    for ( var i = 0; i < digitos.length; i++  ) {
        // Preenche a soma com o dígito vezes a posição
        soma_digitos = soma_digitos + ( digitos[i] * posicoes );

        // Subtrai 1 da posição
        posicoes--;

        // Parte específica para CNPJ
        // Ex.: 5-4-3-2-9-8-7-6-5-4-3-2
        if ( posicoes < 2 ) {
            // Retorno a posição para 9
            posicoes = 9;
        }
    }

    // Captura o resto da divisão entre soma_digitos dividido por 11
    // Ex.: 196 % 11 = 9
    soma_digitos = soma_digitos % 11;

    // Verifica se soma_digitos é menor que 2
    if ( soma_digitos < 2 ) {
        // soma_digitos agora será zero
        soma_digitos = 0;
    } else {
        // Se for maior que 2, o resultado é 11 menos soma_digitos
        // Ex.: 11 - 9 = 2
        // Nosso dígito procurado é 2
        soma_digitos = 11 - soma_digitos;
    }

    // Concatena mais um dígito aos primeiro nove dígitos
    // Ex.: 025462884 + 2 = 0254628842
    var cpf = digitos + soma_digitos;

    // Retorna
    return cpf;
    
} 


function valida_cpf( valor ) {
	valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, '');
    var digitos = valor.substr(0, 9);
    var novo_cpf = calc_digitos_posicoes( digitos );
    var novo_cpf = calc_digitos_posicoes( novo_cpf, 11 );
    if ( novo_cpf === valor ) {
        return true;
    } else {
        return false;
    }
    
} 

function valida_cnpj ( valor ) {
    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, '');
    var cnpj_original = valor;
    var primeiros_numeros_cnpj = valor.substr( 0, 12 );
    var primeiro_calculo = calc_digitos_posicoes( primeiros_numeros_cnpj, 5 );
    var segundo_calculo = calc_digitos_posicoes( primeiro_calculo, 6 );
    var cnpj = segundo_calculo;
    if ( cnpj === cnpj_original ) {
        return true;
    }
    return false;
    
} 

function valida_cpf_cnpj ( valor ) {
    var valida = verifica_cpf_cnpj( valor );
    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, '');
    if ( valida === 'CPF' ) {
        return valida_cpf( valor );
    } 
    else if ( valida === 'CNPJ' ) {
        return valida_cnpj( valor );
    } 
    else {
        return false;
    }
    
}

function formata_cpf_cnpj( valor ) {

    var formatado = false;
    var valida = verifica_cpf_cnpj( valor );
    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, '');
    if ( valida === 'CPF' ) {
    
        // Verifica se o CPF é válido
        if ( valida_cpf( valor ) ) {
        
            // Formata o CPF ###.###.###-##
            formatado  = valor.substr( 0, 3 ) + '.';
            formatado += valor.substr( 3, 3 ) + '.';
            formatado += valor.substr( 6, 3 ) + '-';
            formatado += valor.substr( 9, 2 ) + '';
        }
    }
    else if ( valida === 'CNPJ' ) {
    
        // Verifica se o CNPJ é válido
        if ( valida_cnpj( valor ) ) {
        
            // Formata o CNPJ ##.###.###/####-##
            formatado  = valor.substr( 0,  2 ) + '.';
            formatado += valor.substr( 2,  3 ) + '.';
            formatado += valor.substr( 5,  3 ) + '/';
            formatado += valor.substr( 8,  4 ) + '-';
            formatado += valor.substr( 12, 14 ) + '';
        }
    } 

    // Retorna o valor 
    return formatado;
    
}