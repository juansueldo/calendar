// Definición de variables globales
var currentMonth = new Date().getMonth();
var currentYear = new Date().getFullYear();
var months = [
    'January', 
    'February', 
    'March', 
    'April', 
    'May', 
    'June', 
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
var monthYearText = document.getElementById('month-year');
var eventsData = [
    {id:1,title: "Evento 1", startdate: '2024-03-15 12:30',enddate: '2024-03-19 22:00'},
    {id:2,title: "Evento 2", startdate: '2024-03-03 12:30',enddate: '2024-03-07 22:00'},
    {id:3,title: "Evento 3", startdate: '2024-03-10 12:30',enddate: '2024-03-10 22:00'},
    {id:4,title: "Evento 4", startdate: '2024-04-01 12:30',enddate: '2024-04-07 22:00'},
    
];
var bootstrapColors = [
    'primary',
    'success',
    'danger',
    'warning',
    'info',
    'success',
    'secondary',
    'primary'
];

// Definir un índice para el color actual
var colorIndex = 0;

function generateCalendar(month, year) {
    var calendarContainer = document.getElementById('fullcalendar');
    calendarContainer.innerHTML = '';
  
    createCalendarHeader(calendarContainer, month, year);
    generateCalendarBody(calendarContainer, month, year);
}

function createCalendarHeader(container, month, year) {
    var calendarHeader = document.createElement('div');
    calendarHeader.classList.add("flatpickr-months");

    calendarHeader.innerHTML = 
        '<div sytle="display:flex;" class="mb-3 mt-3">'+
            '<span class="ti ti-chevron-left p-2" style="cursor:pointer;" data-icon="tabler:chevron-left" onclick="previousMonth()"></span>' +
            '<span class="ti ti-chevron-right p-2" style="cursor:pointer;"  data-icon="tabler:chevron-right" onclick="nextMonth()"></span>' +
            '<span class="cur-month">' + months[month] + ' '+ year + '</span>' +
        '</div>' ;

    container.appendChild(calendarHeader);
}




function generateCalendarBody(container, month, year) {
  var calendarBody = document.createElement('div');
  calendarBody.classList.add("calendar-container");
  container.appendChild(calendarBody);

  var table = document.createElement('table');
  table.classList.add("table", "table-bordered","fc-scrollgrid", "fc-scrollgrid-liquid");
  var thead = document.createElement('thead');
  var tbody = document.createElement('tbody');
  tbody.setAttribute('id', 'calendar-body');
  thead.style.borderColor = "#434968";
  createTableHeader(thead);
  table.appendChild(thead);
  table.appendChild(tbody);
  calendarBody.appendChild(table);

  var firstDay = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var date = 1;

  for (var i = 0; i < 6; i++) {
      var row = document.createElement('tr');
  
      for (var j = 0; j < 7; j++) {
          var cell = document.createElement('td');
          cell.style.cursor = "pointer";
          cell.style.width = "100px";
          cell.style.height = "100px";
          cell.classList.add("c-day", "fc-day-wed", "fc-day-past", "fc-day-other", "fc-daygrid-day");
          cell.style.position="relative";
          cell.style.padding=0;
          cell.style.borderColor = "#434968";
          cell.style.overflow = "hidden";

          var eventsToShow = getEventsForDay(month, year, date);
          var eventListHTML = eventsToShow.map(event => generateEventHTML(event, date)).join('');
          if (i === 0 && j < firstDay) {
              var daysInPreviousMonth = new Date(year, month, 0).getDate();
              cell.innerHTML = `<div class="fc-daygrid-day-frame" style="max-height: 100px; overflow: hidden;">
                                  <div class="fc-daygrid-day-top" style="position:absolute;top:0;left:0;">
                                    <a title="Go to ${months[month - 1]} ${(daysInPreviousMonth - firstDay + j + 1)}, ${year}" data-navlink="" tabindex="0" id="fc-dom-${(daysInPreviousMonth - firstDay + j + 1)}" class="fc-daygrid-day-number text-muted m-2">${(daysInPreviousMonth - firstDay + j + 1)}</a>
                                  </div>
                                <div class="fc-daygrid-day-events" style="margin-top:20px;height: 110px;overflow:hidden;">${eventListHTML}</div>
                              </div>
                               
                              `;
          } else if (date > daysInMonth) {
              cell.innerHTML = `<div class="fc-daygrid-day-frame" style="max-height: 100px;overflow: hidden;">
                                  <div class="fc-daygrid-day-top" style="position:absolute;top:0;left:0;">
                                    <a title="Go to ${months[month + 1]} ${(date - daysInMonth)}, ${year}" data-navlink="" tabindex="0" id="fc-dom-${(date - daysInMonth)}" class="fc-daygrid-day-number text-muted m-2">${(date - daysInMonth)}</a>
                                  </div>
                                <div class="fc-daygrid-day-events" style="margin-top:20px;height: 100px;overflow:hidden;">${eventListHTML}</div>
                              </div>`;
              date++;
          } else {
              var eventsToShow = getEventsForDay(month, year, date);
              // Ordenar los eventos según su fecha de finalización
              eventsToShow.sort((a, b) => {
                  var aEnd = new Date(a.enddate).getDate();
                  var bEnd = new Date(b.enddate).getDate();
                  if (aEnd === bEnd) return 0;
                  return aEnd > bEnd ? -1 : 1;
              });
              var eventListHTML = eventsToShow.map(event => generateEventHTML(event, date)).join('');
              var visibleEvents = eventsToShow.slice(0, 2); // Obtener los primeros tres elementos
              var hiddenEventCount = eventsToShow.length - visibleEvents.length; // Calcular la cantidad de elementos ocultos

              // Crear HTML para los eventos visibles
              var visibleEventsHTML = visibleEvents.map(event => generateEventHTML(event, date)).join('');

              // Crear la leyenda para los eventos ocultos
              var hiddenEventsLegend = hiddenEventCount > 0 ? `+${hiddenEventCount} more` : '';

              // Combinar HTML de eventos visibles y leyenda de eventos ocultos
              var eventListVisibleHTML = `${visibleEventsHTML}<span class="hidden-events">${hiddenEventsLegend}</span>`;

              cell.innerHTML = `<div class="fc-daygrid-day-frame" style="max-height: 100px; overflow: hidden;">
                                    <div id="hidden-date-info" style="display: none;">
                                        <span class="hidden-month">${month}</span>
                                        <span class="hidden-date">${date}</span>
                                        <span class="hidden-year">${year}</span>
                                    </div>
                                    <div class="fc-daygrid-day-top" style="position:absolute;top:0;left:0;">
                                        <a title="Go to ${months[month]} ${date}, ${year}" data-navlink="" tabindex="0" id="fc-dom-${date}" class="fc-daygrid-day-number m-2">${date}</a>
                                    </div>
                                    <div class="fc-daygrid-day-events" style="margin-top:20px;height: 110px;overflow:hidden;">${eventListVisibleHTML}</div>
                                </div>`;
              if (date === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                  cell.style.fontWeight = 'bold';
              }

              date++;
          }

          row.appendChild(cell);
      }
      tbody.appendChild(row);

      if (date > daysInMonth && i > 0) {
          break;
      }
  }
  showPopUpEvents();

}


function createTableHeader(thead) {
    thead.innerHTML = '<table class=""><thead><tr><th class="fc-day-header fc-widget-header fc-sun"><span class="text-dark">Sun</span></th><th class="fc-day-header fc-widget-header fc-mon"><span class="text-dark">Mon</span></th><th class="fc-day-header fc-widget-header fc-tue"><span class="text-dark">Tue</span></th><th class="fc-day-header fc-widget-header fc-wed"><span class="text-dark">Wed</span></th><th class="fc-day-header fc-widget-header fc-thu"><span class="text-dark">Thu</span></th><th class="fc-day-header fc-widget-header fc-fri"><span class="text-dark">Fri</span></th><th class="fc-day-header fc-widget-header fc-sat"><span class="text-dark">Sat</span></th></tr></thead></table>';
}

// Función para crear una celda de la tabla del calendario
function createTableCell(month, year, firstDay, daysInMonth, date) {
    var cell = document.createElement('td');
    cell.style.cursor = "pointer";
    cell.style.width = "100px"; 
    cell.style.height = "100px";
    cell.classList.add("c-day", "fc-day-wed", "fc-day-past", "fc-day-other", "fc-daygrid-day");
  
    if (date <= daysInMonth || (date > daysInMonth && firstDay > 0)) {
      var dayNumber = date <= daysInMonth ? date : date - daysInMonth;
      cell.innerHTML = generateCellHTML(month, year, dayNumber);
    }
    return cell;
}


// Función para obtener los eventos para un día dado
function getEventsForDay(month, year, day) {
    return eventsData.filter(event => {
        var eventStart = new Date(event.startdate);
        var eventEnd = new Date(event.enddate);
        var eventStartDate = new Date(year, month, day);
        var eventEndDate = new Date(year, month, day + 1); // Ajuste: agregar 1 día al día para incluir eventos que terminan en el mismo día

        // Ajuste: Comprobar si el evento comienza antes o al mismo tiempo que el día seleccionado,
        // y termina después o al mismo tiempo que el día seleccionado
        return (eventStart <= eventStartDate && eventEnd >= eventStartDate) || (eventStart <= eventEndDate && eventEnd >= eventEndDate) || (eventStart <= eventStartDate && eventEnd >= eventEndDate) || (eventStart.getDate() === day && eventEnd.getDate() === day); // Ajuste: Agregar condición para eventos que empiezan y terminan en el mismo día
    });
}
var idColors = {};

// Asignar colores a los IDs y reiniciar el ciclo después del noveno ID
function assignColorToId(id) {
    if (!(id in idColors)) {
        idColors[id] = bootstrapColors[colorIndex % bootstrapColors.length];
        colorIndex++;
        if (colorIndex === 9) {
            colorIndex = 0;
        }
    }
    return idColors[id];
}
// Función para generar el HTML de un evento
function generateEventHTML(event, currentDate, show=false) {
  var eventStart = new Date(event.startdate);
  var eventEnd = new Date(event.enddate);
  var eventMonthStart = eventStart.getMonth();
  var eventMonthEnd = eventEnd.getMonth();
  var eventYearStart = eventStart.getFullYear();
  var eventYearEnd = eventEnd.getFullYear();
  var eventDateStart = eventStart.getDate();
  var eventDateEnd = eventEnd.getDate();

  // Verificar si el evento está dentro del mes y año actual
  if ((eventMonthStart === currentMonth && eventYearStart === currentYear) || (eventMonthEnd === currentMonth && eventYearEnd === currentYear)) {
      // Si el día actual coincide con la fecha de inicio y finalización del evento
      if (currentDate === eventStart.getDate() && currentDate === eventEnd.getDate()) {
          return generateEventLink(event, eventStart, eventEnd, assignColorToId(event.id), true);
      }
      // Si el día actual coincide con la fecha de inicio del evento
      else if (currentDate === eventStart.getDate()) {
          return generateEventLink(event, eventStart, eventEnd, assignColorToId(event.id), true, true);
      }
      // Si el día actual coincide con la fecha de finalización del evento
      else if (currentDate === eventEnd.getDate()) {
          return generateEventLink(event, eventStart, eventEnd, assignColorToId(event.id), true,false);
      }
      // Si el día actual está entre la fecha de inicio y finalización del evento
      else if (currentDate > eventStart.getDate() || currentDate < eventEnd.getDate()) {
          return generateEventLink(event, eventStart, eventEnd, assignColorToId(event.id), show);
      }
  }
  /*if(currentMonth > eventMonthStart && currentMonth < eventMonthEnd){
    return generateEventLink(event, eventStart, eventEnd, assignColorToId(event.id), show);
  }*/
  else if((currentMonth > eventMonthStart && eventYearStart === currentYear) || (currentMonth < eventMonthEnd && eventYearEnd === currentYear)){
    if(eventDateStart !== eventDateEnd){
        return generateEventLink(event, eventStart, eventEnd, assignColorToId(event.id), show);
    }else{
        return '';
    }
  }

  // Si el evento no está dentro del mes y año actual, no mostrar nada
  return '';
}

function generateEventLink(event, eventStart, eventEnd, colorId, show, eventStatus=null) {
  var eventTime = '';
  if(eventStatus !== null){
    if(eventStatus === true){
        eventTime=eventStart.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }else{
        eventTime=eventEnd.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
  }else{
    eventTime = eventStart.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + ' - ' + eventEnd.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  
  var eventTitle = show === false ? '&nbsp' : event.title;
  var eventTime = show === false ? '&nbsp' : eventTime;

  return `<a data-xtz-source="/account/calendar/edit/${event.id}" data-xtz-method="replaceHtml" data-xtz-container="#canvas-end" data-bs-toggle="offcanvas" class="c-event fc-event-draggable fc-event-resizable fc-event-start fc-event-end fc-event-future fc-daygrid-event fc-daygrid-dot-event fc-event-${colorId} mb-1"><div class="fc-event-time mr-1">${eventTime} </div><div class="fc-event-title" style="max-width:60px;overflow:hidden;text-overflow: ellipsis; white-space: nowrap;"> ${eventTitle}</div></a>`;
}




function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
}

// Función para ir al siguiente mes
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
}

// Función para ir al año anterior
function previousYear() {
    currentYear--;
    generateCalendar(currentMonth, currentYear);
}

// Función para ir al siguiente año
function nextYear() {
    currentYear++;
    generateCalendar(currentMonth, currentYear);
}

generateCalendar(currentMonth, currentYear);
// Agregar un manejador de eventos de clic al span "+"
function showPopUpEvents() {
  function handleClick() {
      // Obtener el td padre
      var tdParent = $(this).closest('td');
      // Obtener la posición del td en la página
      var tdOffset = tdParent.offset();
      var month = parseInt($(this).closest('.fc-daygrid-day-frame').find('.hidden-month').text());
      var date= parseInt(($(this).closest('.fc-daygrid-day-frame').find('.hidden-date').text()));
      var year = parseInt(($(this).closest('.fc-daygrid-day-frame').find('.hidden-year').text()));
      // Crear el canvas

      var canvas = document.createElement('div');
      canvas.classList.add('hidden-events-canvas');
      canvas.style.position = 'absolute';
      canvas.style.top = tdOffset.top + 'px';
      canvas.style.left = tdOffset.left + 'px';
      canvas.style.width = '200px';
      canvas.style.height = '200px';
      canvas.style.backgroundColor = '#25293c';
      canvas.style.overflow = 'hidden'; // Ocultar el desplazamiento en el contenedor principal
      //canvas.style.overflowY = 'auto'; // Eliminar esta línea
      
      // Construir el HTML del popup con los eventos del día
      var canvas = document.createElement('div');
canvas.classList.add('hidden-events-canvas');
canvas.style.position = 'absolute';
canvas.style.top = tdOffset.top + 'px';
canvas.style.left = tdOffset.left + 'px';
canvas.style.width = '200px';
canvas.style.height = '220px';
canvas.style.backgroundColor = '#25293c';
canvas.style.overflow = 'hidden'; // Ocultar el desplazamiento en el contenedor principal
//canvas.style.overflowY = 'auto'; // Eliminar esta línea

// Construir el HTML del popup con los eventos del día
var popupHTML = '<div class="fc-popover fc-more-popover" style="display:block;">';
popupHTML += '<div class="fc-popover-header p-2" style="background-color:#7367f0;padding-left:10px;padding-right:10px;">';
popupHTML += '<span class="fc-popover-title">' + months[month] + ' ' + $(this).closest('.fc-daygrid-day-frame').find('.fc-daygrid-day-number').text() + ', ' + year + '</span>'; // Modificado para incluir mes, fecha y año
popupHTML += '<span class="fc-popover-close fc-icon fc-icon-x" title="Cerrar" style="float:right;"></span>';
popupHTML += '</div>';
popupHTML += '<div class="fc-popover-body mb-2" style="background-color:#25293c;padding-left:10px;padding:10px; overflow-y: auto;">'; // Añadir estilo de desplazamiento aquí

// Contenedor para el cuerpo del popup
popupHTML += '<div class="popup-body-container" style="max-height: 160px; overflow-y: auto;">'; // Ajusta la altura máxima según sea necesario

var eventsToShow = getEventsForDay(month, year, date);
var eventListHTML = eventsToShow.map(event => generateEventHTML(event, date, true)).join('');

popupHTML += eventListHTML;

popupHTML += '</div>'; // Cerrar el contenedor del cuerpo del popup
popupHTML += '</div></div>';

canvas.innerHTML = popupHTML;
document.body.appendChild(canvas);

          // Agregar un manejador de eventos de clic al canvas para cerrarlo al hacer clic fuera de él
          $(document).on('click', function(event) {
              if (!$(event.target).closest('.hidden-events-canvas').length) {
                  $(canvas).remove(); // Eliminar el canvas
              }
          });

          // Agregar evento de clic para cerrar el popup
          $(document).on('click', '.fc-popover-close', function() {
              $(canvas).remove(); // Eliminar el canvas
          });
      
  }

  // Asociar el manejador de eventos de clic a '.hidden-events' cada vez que se hace clic
  $(document).on('click', '.hidden-events', handleClick);
}



