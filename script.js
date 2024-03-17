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
  {title: "Evento 1", startdate: '2024-03-15 12:30',enddate: '2024-03-19 22:00'},
  {title: "Evento 2", startdate: '2024-03-03 12:30',enddate: '2024-03-07 22:00'},
  {title: "Evento 3", startdate: '2024-03-10 12:30',enddate: '2024-03-10 22:00'},
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

  var firstDayOfMonth = new Date(year, month, 1).getDay(); // Obtener el día de la semana del primer día del mes
  var firstDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; // Convertir el domingo (0) a 6 y restar 1 para que el primer día de la semana sea lunes

  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var date = 1;

  for (var i = 0; i < 6; i++) {
    var row = document.createElement('tr');

    for (var j = 0; j < 7; j++) {
      var cell = createTableCell(month, year, firstDay, daysInMonth, date);
      row.appendChild(cell);
      date++;
    }
    tbody.appendChild(row);

    if (date > daysInMonth && i > 0) {
      break;
    }
  }
}

function generateCalendar(month, year) {
  var calendarContainer = document.getElementById('fullcalendar');
  calendarContainer.innerHTML = '';

  // Create calendar header
  var calendarHeader = document.createElement('div');
  calendarHeader.classList.add("calendar-header");
  calendarHeader.innerHTML = '<button class="btn btn-primary" onclick="previousMonth()"><span class="ti ti-chevron-left" role="img"></span></button><h2 id="month-year">' + months[month] + ' ' + year + '</h2><button class="btn btn-primary" onclick="nextMonth()"><span class="ti ti-chevron-right" role="img"></button>';
  calendarContainer.appendChild(calendarHeader);

  // Generate calendar body
  var calendarBody = document.createElement('div');
  calendarBody.classList.add("calendar-container");
  calendarContainer.appendChild(calendarBody);

  var table = document.createElement('table');
  table.classList.add("table", "table-bordered","fc-scrollgrid", "fc-scrollgrid-liquid");
  var thead = document.createElement('thead');
  var tbody = document.createElement('tbody');
  tbody.setAttribute('id', 'calendar-body');

  thead.innerHTML = '<table class=""><thead><tr><th class="fc-day-header fc-widget-header fc-sun"><span>Sun</span></th><th class="fc-day-header fc-widget-header fc-mon"><span>Mon</span></th><th class="fc-day-header fc-widget-header fc-tue"><span>Tue</span></th><th class="fc-day-header fc-widget-header fc-wed"><span>Wed</span></th><th class="fc-day-header fc-widget-header fc-thu"><span>Thu</span></th><th class="fc-day-header fc-widget-header fc-fri"><span>Fri</span></th><th class="fc-day-header fc-widget-header fc-sat"><span>Sat</span></th></tr></thead></table>';
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
      cell.style.width = "150px"; // Establece un ancho fijo para cada celda
      cell.style.height = "150px"; // Establece una altura fija para cada celda

      cell.classList.add("c-day", "fc-day-wed", "fc-day-past", "fc-day-other", "fc-daygrid-day", "text-center");

      if (i === 0 && j < firstDay) {
        var daysInPreviousMonth = new Date(year, month, 0).getDate();
        cell.innerHTML = '<div class="fc-daygrid-day-frame"><div class="fc-daygrid-day-top"><a title="Go to ' + months[month - 1] + ' ' + (daysInPreviousMonth - firstDay + j + 1) + ', ' + year + '" data-navlink="" tabindex="0" id="fc-dom-' + (daysInPreviousMonth - firstDay + j + 1) + '" class="fc-daygrid-day-number text-muted">' + (daysInPreviousMonth - firstDay + j + 1) +'</a></div><div class="fc-daygrid-day-events"></div></div>';
      } else if (date > daysInMonth) {
        cell.innerHTML = '<div class="fc-daygrid-day-frame"><div class="fc-daygrid-day-top"><a title="Go to ' + months[month + 1] + ' ' + (date - daysInMonth) + ', ' + year + '" data-navlink="" tabindex="0" id="fc-dom-' + (date - daysInMonth) + '" class="fc-daygrid-day-number text-muted">' + (date - daysInMonth) + '</a></div><div class="fc-daygrid-day-events"></div></div>';
        date++;
      } else {
        var eventsToShow = [];
        var eventsToShowStart = [];
        var eventsMiddle=[];
        eventsData.forEach((data) => {
          var eventStart = new Date(data.startdate);
          var eventDate = new Date(data.enddate);
          if (eventDate.getDate() === date && eventDate.getMonth() === month && eventDate.getFullYear() === year) {
            eventsToShow.push({
              title: data.title,
              time: eventDate.getHours() + ':' + ('0' + eventDate.getMinutes()).slice(-2), 
              id: data.id
            });
          }
          if (eventStart.getDate() === date && eventStart.getMonth() === month && eventStart.getFullYear() === year) {
            eventsToShowStart.push({
              title: data.title,
              time: eventStart.getHours() + ':' + ('0' + eventStart.getMinutes()).slice(-2), 
              id: data.id, 
            });
          }
          if(eventStart !== eventDate){
            if (eventStart.getDate() <  date && eventDate.getDate() > date  && eventStart.getMonth() === month && eventDate.getMonth() === month && eventStart.getFullYear() === year){
                eventsMiddle.push({
                    title: data.title,
                    time: eventDate.getHours() + ':' + ('0' + eventDate.getMinutes()).slice(-2), 
                    id: data.id
                  });
            }
          }
        });

        eventsMiddle.forEach((event, index) => {
            // Obtener la clase de color actual y aplicarla al evento
            var colorClass = bootstrapColors[index % bootstrapColors.length];
            event.colorClass = colorClass; // Guardar la clase de color en el objeto del evento
        });
        var eventListHTML = eventsToShow.map(event => '<a data-xtz-source="/account/calendar/edit/'+event.id+'" data-xtz-method="replaceHtml" data-xtz-container="#canvas-end" data-bs-toggle="offcanvas" class="c-event fc-event-draggable fc-event-resizable fc-event-start fc-event-end fc-event-future fc-daygrid-event fc-daygrid-dot-event fc-event-info mb-1"><div class="fc-daygrid-event-dot"></div><div class="fc-event-time">'+event.time+'</div><div class="fc-event-title">'+event.title+'</div></a>').join('');
        var eventListStartHTML = eventsToShowStart.map(event => '<a data-xtz-source="/account/calendar/edit/'+event.id+'" data-xtz-method="replaceHtml" data-xtz-container="#canvas-end" data-bs-toggle="offcanvas" class="c-event fc-event-draggable fc-event-resizable fc-event-start fc-event-end fc-event-future fc-daygrid-event fc-daygrid-dot-event fc-event-info mb-1"><div class="fc-daygrid-event-dot"></div><div class="fc-event-time">'+event.time+'</div><div class="fc-event-title">'+event.title+'</div></a>').join('');
        var eventsMiddleHTML = eventsMiddle.map(event => '<a data-xtz-source="/account/calendar/edit/'+event.id+'" data-xtz-method="replaceHtml" data-xtz-container="#canvas-end" data-bs-toggle="offcanvas" class="c-event fc-event-draggable fc-event-resizable fc-event-start fc-event-end fc-event-future fc-daygrid-event fc-daygrid-dot-event fc-event-info mb-1"><div class="fc-daygrid-event-dot"></div><span class="badge ' + event.colorClass + '">'+event.title+'</span></div></a>').join('');
        cell.innerHTML = '<div class="fc-daygrid-day-frame"><div class="fc-daygrid-day-top"><a title="Go to ' + months[month] + ' ' + date + ', ' + year + '" data-navlink="" tabindex="0" id="fc-dom-' + date + '" class="fc-daygrid-day-number">' + date +  '</a></div><div class="fc-daygrid-day-events">' + eventListStartHTML + eventListHTML +eventsMiddleHTML+ '</div></div>';

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

function previousMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateCalendar(currentMonth, currentYear);
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateCalendar(currentMonth, currentYear);
}


generateCalendar(currentMonth, currentYear);
