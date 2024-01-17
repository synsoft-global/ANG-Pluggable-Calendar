import { Component, signal, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { createEventId } from './event-utils';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmationModalComponent, AddEventModalComponent } from './modals';  // Update the path accordingly
import { DataService } from './services';
import { EventInput } from '@fullcalendar/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('template') templateRef: TemplateRef<undefined> | undefined;
  @ViewChild('formtemplate') formtemplateRef: TemplateRef<undefined> | undefined;
  initialEvents: EventInput[] = []
  title = 'calendar-angular-project';
  modalRef?: BsModalRef;
  formmodalRef?: BsModalRef;
  confirmResolve?: () => void;
  confirmReject?: () => void;
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    initialEvents: this.dataService.getData(),
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  currentEvents = signal<EventApi[]>([]);
  constructor(private changeDetector: ChangeDetectorRef, private modalService: BsModalService, private dataService: DataService) { }

  ngOnInIt(): void {
    this.initialEvents = this.dataService.getData();
  }

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.mutate((options) => {
      options.weekends = !options.weekends;
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
    this.formmodalRef = this.modalService.show(AddEventModalComponent, {});
    this.formmodalRef.content.onConfirm.subscribe((resp: { status: string, formTitle: string }) => {
      if (resp) {
        selectInfo.view.calendar.addEvent({
          id: createEventId(),
          title: resp.formTitle,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        });
      }
    });

  }

  handleEventClick(clickInfo: EventClickArg) {
    const messageString = `Are you sure you want to delete the event '${clickInfo.event.title}'?`
    this.modalRef = this.modalService.show(ConfirmationModalComponent, {
      initialState: {
        message: messageString
      }
    });

    this.modalRef.content.onConfirm.subscribe((resp: boolean) => {
      if (resp) {
        clickInfo.event.remove();
      }
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }
}