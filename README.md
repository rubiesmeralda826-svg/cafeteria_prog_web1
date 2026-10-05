# The Coffee Shop

Proyecto escolar de comercio electrónico: HTML, CSS y JavaScript.

## Abrir y probar

Abrir index.html en el navegador. También se puede ejecutar:

    python -m http.server 8086 --bind 127.0.0.1

Luego abrir http://127.0.0.1:8086/.

## Revisión contra la consigna

- Seis páginas: Inicio, Registro, Quiénes somos, Catálogo, Carrito y Búsqueda.
- Todas incluyen menú nav con ul/li, vínculos relativos y vínculos absolutos al repositorio y al sitio publicado.
- Estilos en styles.css y programación en script.js, sin CSS ni JavaScript en línea.
- Inicio: banner, bienvenida y lista de destacados.
- Registro: nombre, email con pattern HTML5, contraseña, fecha de nacimiento, teléfono, términos y envío. Sin required. JavaScript valida campos vacíos y HTML5. Botón deshabilitado hasta aceptar términos. Registro de demostración sin guardar datos ni crear cuentas.
- Quiénes somos: tabla con nombre, rol y correo; botón Ver más/Ver menos.
- Catálogo: imágenes, nombres, precios, botones y contador/mensaje al agregar.
- Carrito: cantidades solo con dígitos, subtotales y total recalculados; quitar productos. Carrito ficticio conservado durante la sesión del navegador, sin backend, pagos reales ni pedidos persistentes.
- Búsqueda: mensaje exacto «Resultados para la búsqueda de camisas» al escribir camisas, productos del catálogo de demostración filtrados automáticamente mientras se escribe (nombre y descripción, sin distinguir acentos o mayúsculas). Los términos sin coincidencias no muestran productos ajenos. El botón Buscar sigue disponible. El texto se inserta de forma segura con textContent.

## Funciones originales conservadas y corregidas

Diseño original: mismos colores, tipografías, imágenes, botones y distribución. Solo se añaden correcciones para elementos hidden, tablas y búsqueda en móvil, e impresión.
Se conservan Finalizar compra, métodos de pago y opciones de ticket.
El ticket se puede imprimir con el diálogo del navegador. El correo se prepara mediante un enlace mailto con destinatario, asunto y contenido: requiere una aplicación de correo configurada y que el usuario pulse Enviar. El sitio no envía correos automáticamente ni dice que los envió. El envío automático no es requisito del profesor y requeriría un servicio externo.

## Equipo

- Juan Manuel Nucamendi Díaz: Registro + Búsqueda; juanvesta123@gmail.com
- Rubi Esmeralda De los Santos López: Catálogo + Carrito; rubiesmeralda826@gmail.com
- Edson Samuel Jiménez Silvestre: Inicio + Quiénes somos; edsonsam16072006@gmail.com

## Publicación pendiente de confirmar

Repositorio: https://github.com/rubiesmeralda826-svg/cafeteria_prog_web1
Sitio: https://rubiesmeralda826-svg.github.io/cafeteria_prog_web1/

El sitio publicado respondió HTTP 200 durante la revisión inicial. Falta comprobar en Settings > Pages que Source sea Deploy from a branch, con main y /(root). No se modificó la configuración ni se subió esta copia. Antes de entregar, el equipo debe completar sus datos, revisar y subir los archivos y comprobar la publicación.

## Verificación local

71 comprobaciones en Edge: navegación y recursos de las seis páginas, código externo y ausencia de required, registro, búsqueda, Ver más/menos, catálogo, carrito, checkout, validación del correo de ticket, enlace mailto, CSS de impresión, cantidades cero, roles, móvil a 390 px y ausencia de errores JavaScript. Se verificó node --check script.js y los recursos locales. No se envió ningún correo ni se realizó un pago.

El logo permite volver a Inicio desde cualquiera de las seis páginas.

El correo de Juan aparece solo como texto informativo en la tabla, sin enlaces de envío ni uso desde JavaScript. Los correos genéricos y Persona 3 están puestos por indicación del equipo.
