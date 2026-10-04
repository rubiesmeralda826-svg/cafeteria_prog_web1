document.addEventListener('DOMContentLoaded', function () {
  var KEY = 'carritoCafeteria';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  var mensaje = document.getElementById('mensaje');
  var timer;

  function leer() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function guardar(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} contador(c); }
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
      if (p) { p.cant++; } else { c.push({ id: b.dataset.id, nombre: b.dataset.nombre, precio: Number(b.dataset.precio), img: b.dataset.img, cant: 1 }); }
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
      tr.innerHTML = '<td><img src="img/' + p.img + '.jpg" alt="' + p.nombre + '">' + p.nombre + '</td><td>$' + p.precio +
        '</td><td><input type="text" class="cantidad" inputmode="numeric" value="' + p.cant + '" data-i="' + i + '" aria-label="Cantidad de ' + p.nombre +
        '"></td><td class="subtotal"></td><td><button class="btn-quitar" data-i="' + i + '">Quitar</button></td>';
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
      e.target.value = e.target.value.replace(/\D/g, '');
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

    // Finalizar compra
    var checkout = document.getElementById('checkout');
    var campoCorreo = document.getElementById('campo-correo');
    var error = document.getElementById('error-pago');
    document.getElementById('btn-finalizar').addEventListener('click', function () {
      if (leer().length === 0) { aviso('Tu carrito está vacío'); return; }
      document.getElementById('ticket').hidden = true;
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
      var total = 0;
      var texto = 'THE COFFEE SHOP\nTicket de compra\n--------------------\n';
      c.forEach(function (p) { total += p.cant * p.precio; texto += p.cant + ' x ' + p.nombre + '  $' + (p.cant * p.precio) + '\n'; });
      texto += '--------------------\nTotal: $' + total + '\nPago: ' + pago.value + '\n';
      texto += ticket.value === 'correo' ? 'Ticket enviado a: ' + correo : 'Ticket impreso';
      var t = document.getElementById('ticket');
      t.textContent = texto;
      t.hidden = false;
      document.getElementById('form-pago').hidden = true;
      guardar([]);
      dibujar();
      aviso(ticket.value === 'correo' ? 'Ticket enviado a ' + correo : '¡Compra realizada!');
    });
  }

  // Búsqueda
  var fb = document.getElementById('form-busqueda');
  if (fb) {
    fb.addEventListener('submit', function (e) {
      e.preventDefault();
      var texto = document.getElementById('texto-busqueda').value.trim();
      if (texto === '') { aviso('Escribe algo para buscar'); return; }
      document.getElementById('titulo-resultados').textContent = 'Resultados para la búsqueda de ' + texto;
      document.getElementById('lista-resultados').hidden = false;
    });
  }

  // Registro
  var fr = document.getElementById('form-registro');
  if (fr) {
    var terminos = document.getElementById('terminos');
    var enviar = document.getElementById('btn-registro');
    var msg = document.getElementById('msg-registro');
    terminos.addEventListener('change', function () { enviar.disabled = !terminos.checked; });
    fr.addEventListener('submit', function (e) {
      e.preventDefault();
      var vacios = Array.prototype.filter.call(fr.querySelectorAll('input:not([type=checkbox])'), function (i) { return i.value.trim() === ''; });
      if (vacios.length) { msg.textContent = 'Completa todos los campos antes de enviar.'; vacios[0].focus(); return; }
      if (!fr.checkValidity()) { fr.reportValidity(); return; }
      msg.textContent = '¡Registro enviado! Gracias, ' + document.getElementById('nombre').value.trim() + '.';
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
      vm.textContent = extra.hidden ? 'Ver más' : 'Ver menos';
    });
  }
});
