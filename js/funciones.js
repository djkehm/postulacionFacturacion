//Autor: Kehmit Uribe -->
//Valparaíso 13 de Abril del 2024 -->
function enviarFormulario(){   
    event.preventDefault();
    
    
    if (!validateEmail()) {
        alert('Por favor, ingrese un correo electrónico válido.');
        return; 
    }

    var rut = $('#rut').val();
    if (!validarRUT(rut)) {
        alert('Por favor, ingrese un RUT válido.');
        return;
    }

    var checkboxesValues = [];
    $('input[name="entero"]:checked').each(function() {
        checkboxesValues.push($(this).val());
    });

    var enteroString = checkboxesValues.join(',');

    var jsonData = {
        nombre: $('#nombre').val(),
        alias: $('#alias').val(),
        rut: rut,
        email: $('#email').val(),
        region: $('#region').val(),
        comuna: $('#comuna').val(),
        candidato: $('#candidato').val(),
        entero: enteroString 
    };

    console.log("guardarCambios(): " + JSON.stringify(jsonData));
    $.ajax({
        method: "POST",
        url: "http://localhost:8080/postulacionFacturacion/Controladores/guardarVotacion.php",
        async: true,
        contentType: 'application/json',
        data: JSON.stringify({ jsonData: JSON.stringify(jsonData) }),
        success: function(resp) {
            resp = JSON.parse(resp);
            if (resp.status && resp.message) {
            alert(resp.message);
            } else {
                alert('Respuesta del servidor no contiene el formato esperado.');
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert(xhr.responseText);
            alert(ajaxOptions);
            alert(thrownError);
        }

        });
};
    


function cargarDatos() {
    const regionesSelect = document.getElementById('region');
    const comunasSelect = document.getElementById('comuna');
    fetch('json/comunas-regiones.json')
        .then(response => response.json())
        .then(data => {
            data.regiones.forEach(region => {
                const option = document.createElement('option');
                option.value = region.region;
                option.textContent = region.region;
                regionesSelect.appendChild(option);
            });

            regionesSelect.addEventListener('change', () => {
                comunasSelect.innerHTML = '<option value="">Selecciona una comuna</option>';

                const regionSeleccionada = regionesSelect.value;
                const region = data.regiones.find(region => region.region === regionSeleccionada);
                if (region) {
                    
                    region.comunas.forEach(comuna => {
                        const option = document.createElement('option');
                        option.value = comuna;
                        option.textContent = comuna;
                        comunasSelect.appendChild(option);
                    });
                }
            });
        })
        .catch(error => console.error('Error al cargar los datos:', error));
}

function validarRUT(rutCompleto) {
    rutCompleto = rutCompleto.replace(/[^0-9Kk]/g, "").toUpperCase();
    var regex = /^(\d{1,8})([K0-9])$/;
    var matches = rutCompleto.match(regex);
    if (!matches) {
        return false;  
    }
    var cuerpo = matches[1];
    var dv = matches[2]; 
    var suma = 0;
    var multiplo = 2;
    for (var i = cuerpo.length - 1; i >= 0; i--) {
        suma += multiplo * cuerpo[i];
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    var dvCalculado = 11 - (suma % 11);
    if (dvCalculado === 10) {
        dvCalculado = 'K';  
    } else if (dvCalculado === 11) {
        dvCalculado = '0';  
    }
 
    return dv === dvCalculado.toString();
}

function formatearRUT(rut) {
    
    var rutLimpio = rut.replace(/[^0-9Kk]/g, "").toUpperCase();
    if (rutLimpio.length <= 1) {
        return rutLimpio;
    }

    var parteNumerica = rutLimpio.slice(0, -1); 
    var dv = rutLimpio.slice(-1); 
    return parteNumerica + '-' + dv; 
}





function validateEmail() {
    var emailInput = document.getElementById('email');
    var emailError = document.getElementById('emailError');
    var email = emailInput.value.trim();

    
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(email)) {
        emailError.textContent = ''; 
        return true; 
    } else {
        emailError.textContent = 'Formato de correo electrónico inválido';
        return false; 
    }
};



