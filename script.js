document.addEventListener('DOMContentLoaded', function () {
  var KEY = 'carritoCafeteria';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  var mensaje = document.getElementById('mensaje');
  var timer;

  var memoria = [];
  function leer() {
    try {
      var datos = JSON.parse(sessionStorage.getItem(KEY));
      if (!Array.isArray(datos)) { return memoria; }
      memoria = datos.filter(function (p) {
        return p && typeof p.id === 'string' && typeof p.nombre === 'string' &&
          typeof p.img === 'string' && /^[a-z0-9-]+$/.test(p.img) &&
          Number.isFinite(p.precio) && p.precio >= 0 &&
          Number.isInteger(p.cant) && p.cant >= 0 && p.cant <= 999;
      });
    } catch (e) {  }
    return memoria;
  }
  function guardar(c) {
    memoria = c;
    try { sessionStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    contador(c);
  }
  function contador(c) {
    var s = document.getElementById('contador');
    if (s) { s.textContent = (c || leer()).reduce(function (t, p) { return t + p.cant; }, 0); }
  }
  function aviso(texto) {
    mensaje.textContent = texto;
    mensaje.classList.add('visible');
    clearTimeout(timer);
    timer = setTimeout(function () { mensaje.classList.remove('visible'); }, 2200);
  }
  contador();

  // Catálogo y búsqueda: agregar al carrito
  document.querySelectorAll('.btn-agregar').forEach(function (b) {
    b.addEventListener('click', function () {
      var c = leer();
      var p = c.find(function (x) { return x.id === b.dataset.id; });
      if (p) { p.cant = Math.min(999, p.cant + 1); } else { c.push({ id: b.dataset.id, nombre: b.dataset.nombre, precio: Number(b.dataset.precio), img: b.dataset.img, cant: 1 }); }
      guardar(c);
      aviso(b.dataset.nombre + ' agregado al carrito');
    });
  });

  // Carrito
  var cuerpo = document.getElementById('cuerpo-carrito');
  function recalcular() {
    var c = leer(), total = 0;
    cuerpo.querySelectorAll('tr').forEach(function (fila, i) {
      var sub = c[i].cant * c[i].precio;
      fila.querySelector('.subtotal').textContent = '$' + sub;
      total += sub;
    });
    document.getElementById('total').textContent = '$' + total;
    return total;
  }
  function dibujar() {
    var c = leer();
    cuerpo.innerHTML = '';
    c.forEach(function (p, i) {
      var tr = document.createElement('tr');
      var producto = document.createElement('td');
      var imagen = document.createElement('img');
      imagen.src = 'img/' + p.img + '.jpg'; imagen.alt = p.nombre;
      producto.append(imagen, document.createTextNode(p.nombre));
      var precio = document.createElement('td'); precio.textContent = '$' + p.precio;
      var cantidad = document.createElement('td');
      var input = document.createElement('input');
      input.type = 'text'; input.className = 'cantidad'; input.inputMode = 'numeric';
      input.maxLength = 3; input.value = p.cant; input.dataset.i = i;
      input.setAttribute('aria-label', 'Cantidad de ' + p.nombre);
      cantidad.appendChild(input);
      var subtotal = document.createElement('td'); subtotal.className = 'subtotal';
      var acciones = document.createElement('td');
      var quitar = document.createElement('button');
      quitar.type = 'button'; quitar.className = 'btn-quitar'; quitar.dataset.i = i;
      quitar.textContent = 'Quitar'; acciones.appendChild(quitar);
      tr.append(producto, precio, cantidad, subtotal, acciones);
      cuerpo.appendChild(tr);
    });
    document.getElementById('vacio').hidden = c.length > 0;
    document.getElementById('tabla-carrito').hidden = c.length === 0;
    recalcular();
  }
  if (cuerpo) {
    dibujar();
    cuerpo.addEventListener('input', function (e) {
      if (!e.target.classList.contains('cantidad')) { return; }
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
      var c = leer();
      c[e.target.dataset.i].cant = parseInt(e.target.value, 10) || 0;
      guardar(c);
      recalcular();
    });
    cuerpo.addEventListener('click', function (e) {
      if (!e.target.classList.contains('btn-quitar')) { return; }
      var c = leer();
      c.splice(e.target.dataset.i, 1);
      guardar(c);
      dibujar();
    });

    document.getElementById('btn-imprimir').addEventListener('click', function () { window.print(); });

    // Finalizar compra
    var checkout = document.getElementById('checkout');
    var campoCorreo = document.getElementById('campo-correo');
    var error = document.getElementById('error-pago');
    document.getElementById('btn-finalizar').addEventListener('click', function () {
      if (!leer().some(function (p) { return p.cant > 0; })) { aviso('Agrega una cantidad mayor que cero.'); return; }
      document.getElementById('ticket').hidden = true;
      document.getElementById('acciones-ticket').hidden = true;
      error.textContent = '';
      document.getElementById('form-pago').hidden = false;
      checkout.hidden = false;
      checkout.scrollIntoView({ behavior: 'smooth' });
    });
    document.querySelectorAll('input[name="ticket"]').forEach(function (r) {
      r.addEventListener('change', function () { campoCorreo.hidden = r.value !== 'correo'; });
    });
    document.getElementById('form-pago').addEventListener('submit', function (e) {
      e.preventDefault();
      var pago = document.querySelector('input[name="pago"]:checked');
      var ticket = document.querySelector('input[name="ticket"]:checked');
      var correo = document.getElementById('correo-ticket').value.trim();
      if (!pago) { error.textContent = 'Elige un método de pago.'; return; }
      if (!ticket) { error.textContent = 'Elige cómo quieres tu ticket.'; return; }
      if (ticket.value === 'correo' && !EMAIL_RE.test(correo)) { error.textContent = 'Escribe un correo válido para enviar el ticket.'; return; }
      error.textContent = '';
      var c = leer().filter(function (p) { return p.cant > 0; });
      if (!c.length) { error.textContent = 'Agrega una cantidad mayor que cero.'; return; }
      var total = 0;
      var texto = 'THE COFFEE SHOP\nTicket de compra de demostración\n--------------------\n';
      c.forEach(function (p) { total += p.cant * p.precio; texto += p.cant + ' x ' + p.nombre + '  $' + (p.cant * p.precio) + '\n'; });
      texto += '--------------------\nTotal: $' + total + '\nPago: ' + pago.value + '\n';
      texto += '\nDemostración escolar: sin cobros ni pedidos reales.';
      var t = document.getElementById('ticket');
      t.textContent = texto;
      t.hidden = false;
      document.getElementById('form-pago').hidden = true;
      guardar([]);
      dibujar();
      document.getElementById('acciones-ticket').hidden = false;
      var enlaceCorreo = document.getElementById('enviar-ticket');
      enlaceCorreo.hidden = ticket.value !== 'correo';
      if (ticket.value === 'correo') {
        enlaceCorreo.href = 'mailto:' + encodeURIComponent(correo) +
          '?subject=' + encodeURIComponent('Ticket de demostración - The Coffee Shop') +
          '&body=' + encodeURIComponent(texto);
      } else { enlaceCorreo.removeAttribute('href'); }
      document.getElementById('nota-ticket').textContent = ticket.value === 'correo' ?
        'Pulsa «Abrir correo con el ticket» y envíalo desde tu aplicación de correo. Este sitio no lo envía automáticamente.' :
        'Pulsa «Imprimir ticket» para abrir el diálogo de impresión del navegador.';
      aviso('Ticket de demostración preparado.');
    });
  }

  // Búsqueda
  var fb = document.getElementById('form-busqueda');
  if (fb) {
    var campoBusqueda = document.getElementById('texto-busqueda');
    var listaResultados = document.getElementById('lista-resultados');
    var tarjetas = Array.from(listaResultados.querySelectorAll('.producto'));
    function normalizar(texto) {
      return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }
    function buscar() {
      var texto = campoBusqueda.value.trim();
      var palabras = normalizar(texto).split(/\s+/);
      var coincidencias = 0;
      tarjetas.forEach(function (tarjeta) {
        var contenido = normalizar(tarjeta.querySelector('h3').textContent + ' ' + tarjeta.querySelector('p').textContent);
        var coincide = texto !== '' && palabras.every(function (palabra) { return contenido.includes(palabra); });
        tarjeta.hidden = !coincide;
        if (coincide) { coincidencias++; }
      });
      document.getElementById('titulo-resultados').textContent = texto ?
        'Resultados para la búsqueda de ' + texto : 'Escribe para buscar productos';
      document.getElementById('estado-busqueda').textContent = !texto ? '' :
        coincidencias ? coincidencias + (coincidencias === 1 ? ' producto encontrado.' : ' productos encontrados.') :
        'No encontramos productos que coincidan. Prueba con café, pastel o croissant.';
      listaResultados.hidden = coincidencias === 0;
    }
    campoBusqueda.addEventListener('input', buscar);
    fb.addEventListener('submit', function (e) { e.preventDefault(); buscar(); });
    buscar();
  }

  // Registro
  var fr = document.getElementById('form-registro');
  if (fr) {
    var terminos = document.getElementById('terminos');
    var enviar = document.getElementById('btn-registro');
    var msg = document.getElementById('msg-registro');
    function actualizarEnvio() { enviar.disabled = !terminos.checked; }
    actualizarEnvio();
    terminos.addEventListener('change', actualizarEnvio);
    window.addEventListener('pageshow', actualizarEnvio);
    fr.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!terminos.checked) { msg.textContent = 'Acepta los términos antes de enviar.'; return; }
      var vacios = Array.prototype.filter.call(fr.querySelectorAll('input:not([type=checkbox])'), function (i) { return i.value.trim() === ''; });
      if (vacios.length) { msg.textContent = 'Completa todos los campos antes de enviar.'; vacios[0].focus(); return; }
      if (!EMAIL_RE.test(document.getElementById('email').value.trim())) { msg.textContent = 'Escribe un correo válido, por ejemplo nombre@correo.com.'; document.getElementById('email').focus(); return; }
      if (!fr.checkValidity()) { fr.reportValidity(); return; }
      msg.textContent = '¡Registro de demostración completado! Gracias, ' + document.getElementById('nombre').value.trim() + '.';
      fr.reset();
      enviar.disabled = true;
    });
  }

  // Quiénes somos: ver más
  var vm = document.getElementById('btn-vermas');
  if (vm) {
    vm.addEventListener('click', function () {
      var extra = document.getElementById('info-extra');
      extra.hidden = !extra.hidden;
      vm.setAttribute('aria-expanded', String(!extra.hidden));
      vm.textContent = extra.hidden ? 'Ver más' : 'Ver menos';
    });
  }
});
