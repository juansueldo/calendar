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
    'bg-primary',
    'bg-secondary',
    'bg-success',
    'bg-danger',
    'bg-warning',
    'bg-info',
    'bg-light',
    'bg-dark'
];

// Definir un índice para el color actual
var colorIndex = 0;

function generateCalendar(month, year) {
    var calendarContainer = document.getElementById('fullcalendar');
    calendarContainer.innerHTML = '';
  
    createCalendarHeader(calendarContainer, month, year);
    generateCalendarBody(calendarContainer, month, year);
}

function createCalendarHeader(container, month, year){
    var calendarHeader = document.createElement('div');
    calendarHeader.classList.add("calendar-header");
    calendarHeader.innerHTML = '<div class="d-flex justify-content-between align-items-center"><button class="btn btn-primary" onclick="previousMonth()"><span class="ti ti-chevron-left text-dark" role="img">Prev</span></button><h2 id="month-year" class="m-0 text-dark">' + months[month] + ' ' + year + '</h2><button class="btn btn-primary" onclick="nextMonth()"><span class="ti ti-chevron-right text-dark" role="img">Next</span></button></div>';
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
            cell.style.width = "150px"; 
            cell.style.height = "150px";
            cell.classList.add("c-day", "fc-day-wed", "fc-day-past", "fc-day-other", "fc-daygrid-day", "text-center");
  
            if (i === 0 && j < firstDay) {
                var daysInPreviousMonth = new Date(year, month, 0).getDate();
                cell.innerHTML = '<div class="fc-daygrid-day-frame"><div class="fc-daygrid-day-top"><a title="Go to ' + months[month - 1] + ' ' + (daysInPreviousMonth - firstDay + j + 1) + ', ' + year + '" data-navlink="" tabindex="0" id="fc-dom-' + (daysInPreviousMonth - firstDay + j + 1) + '" class="fc-daygrid-day-number text-muted">' + (daysInPreviousMonth - firstDay + j + 1) +'</a></div><div class="fc-daygrid-day-events"></div></div>';
            } else if (date > daysInMonth) {
                cell.innerHTML = '<div class="fc-daygrid-day-frame"><div class="fc-daygrid-day-top"><a title="Go to ' + months[month + 1] + ' ' + (date - daysInMonth) + ', ' + year + '" data-navlink="" tabindex="0" id="fc-dom-' + (date - daysInMonth) + '" class="fc-daygrid-day-number text-muted">' + (date - daysInMonth) + '</a></div><div class="fc-daygrid-day-events"></div></div>';
                date++;
            } else {
                var eventsToShow = getEventsForDay(month, year, date);
                var eventListHTML = eventsToShow.map(event => generateEventHTML(event, date)).join('');
                cell.innerHTML = '<div class="fc-daygrid-day-frame"><div class="fc-daygrid-day-top"><a title="Go to ' + months[month] + ' ' + date + ', ' + year + '" data-navlink="" tabindex="0" id="fc-dom-' + date + '" class="fc-daygrid-day-number">' + date +  '</a></div><div class="fc-daygrid-day-events">' + eventListHTML + '</div></div>';
  
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
}


function createTableHeader(thead) {
    thead.innerHTML = '<table class=""><thead><tr><th class="fc-day-header fc-widget-header fc-sun"><span class="text-dark">Sun</span></th><th class="fc-day-header fc-widget-header fc-mon"><span class="text-dark">Mon</span></th><th class="fc-day-header fc-widget-header fc-tue"><span class="text-dark">Tue</span></th><th class="fc-day-header fc-widget-header fc-wed"><span class="text-dark">Wed</span></th><th class="fc-day-header fc-widget-header fc-thu"><span class="text-dark">Thu</span></th><th class="fc-day-header fc-widget-header fc-fri"><span class="text-dark">Fri</span></th><th class="fc-day-header fc-widget-header fc-sat"><span class="text-dark">Sat</span></th></tr></thead></table>';
}

// Función para crear una celda de la tabla del calendario
function createTableCell(month, year, firstDay, daysInMonth, date) {
    var cell = document.createElement('td');
    cell.style.cursor = "pointer";
    cell.style.width = "150px"; 
    cell.style.height = "150px";
    cell.classList.add("c-day", "fc-day-wed", "fc-day-past", "fc-day-other", "fc-daygrid-day", "text-center");
  
    if (date <= daysInMonth || (date > daysInMonth && firstDay > 0)) {
      var dayNumber = date <= daysInMonth ? date : date - daysInMonth;
      cell.innerHTML = generateCellHTML(month, year, dayNumber);
    }
    return cell;
}

// Función para generar el HTML de una celda de la tabla del calendario
function generateCellHTML(month, year, day) {
    var eventsToShow = getEventsForDay(month, year, day);
    var eventListHTML = eventsToShow.map(event => generateEventHTML(event)).join('');
    return '<div class="fc-daygrid-day-frame"><div class="fc-daygrid-day-top"><a title="Go to ' + months[month] + ' ' + day + ', ' + year + '" data-navlink="" tabindex="0" id="fc-dom-' + day + '" class="fc-daygrid-day-number">' + day +  '</a></div><div class="fc-daygrid-day-events">' + eventListHTML + '</div></div>';
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
function generateEventHTML(event, currentDate) {
    var eventStart = new Date(event.startdate);
    var eventEnd = new Date(event.enddate);
    var eventDuration = (eventEnd - eventStart) / (1000 * 60 * 60); // Duración del evento en horas


     // Si el día actual coincide con la fecha de inicio y finalización del evento
     if (currentDate === eventStart.getDate() && currentDate === eventEnd.getDate()) {
        return '<span class="badge ' + assignColorToId(event.id) + '"><a data-xtz-source="/account/calendar/edit/'+event.id+'" data-xtz-method="replaceHtml" data-xtz-container="#canvas-end" data-bs-toggle="offcanvas" class="c-event fc-event-draggable fc-event-resizable fc-event-start fc-event-end fc-event-future fc-daygrid-event fc-daygrid-dot-event fc-event-info mb-1"><div class="fc-daygrid-event-dot"></div><div class="fc-event-time">'+ eventStart.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + ' - ' + eventEnd.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + '</div><div class="fc-event-title">'+event.title+'</div></a></span>';
    }
    // Si el día actual coincide con la fecha de inicio del evento
    else if (currentDate === eventStart.getDate()) {
        return '<span class="badge ' + assignColorToId(event.id) + '"><a data-xtz-source="/account/calendar/edit/'+event.id+'" data-xtz-method="replaceHtml" data-xtz-container="#canvas-end" data-bs-toggle="offcanvas" class="c-event fc-event-draggable fc-event-resizable fc-event-start fc-event-end fc-event-future fc-daygrid-event fc-daygrid-dot-event fc-event-info mb-1"><div class="fc-daygrid-event-dot"></div><div class="fc-event-time">'+ eventStart.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + '</div><div class="fc-event-title">'+event.title+'</div></a></span>';
    }
    // Si el día actual coincide con la fecha de finalización del evento
    else if (currentDate === eventEnd.getDate()) {
        return '<span class="badge ' + assignColorToId(event.id) + '"><a data-xtz-source="/account/calendar/edit/'+event.id+'" data-xtz-method="replaceHtml" data-xtz-container="#canvas-end" data-bs-toggle="offcanvas" class="c-event fc-event-draggable fc-event-resizable fc-event-start fc-event-end fc-event-future fc-daygrid-event fc-daygrid-dot-event fc-event-info mb-1"><div class="fc-daygrid-event-dot"></div><div class="fc-event-time">'+ eventEnd.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + '</div><div class="fc-event-title">'+event.title+'</div></a></span>';
    }
    // Si el evento dura más de un día y el día actual está entre la fecha de inicio y finalización del evento
    else if (eventDuration >= 24 && currentDate > eventStart.getDate() && currentDate < eventEnd.getDate()) {
        return '<span class="badge ' + assignColorToId(event.id) + '"><a data-xtz-source="/account/calendar/edit/'+event.id+'" data-xtz-method="replaceHtml" data-xtz-container="#canvas-end" data-bs-toggle="offcanvas" class="c-event fc-event-draggable fc-event-resizable fc-event-start fc-event-end fc-event-future fc-daygrid-event fc-daygrid-dot-event fc-event-info mb-1">'+event.title+'</a></span>';
    }
    // En todos los demás casos, no mostrar nada
    else {
        return '';
    }
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

generateCalendar(currentMonth, currentYear);
