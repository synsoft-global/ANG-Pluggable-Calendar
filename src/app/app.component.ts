import { Component, signal, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('template') templateRef: TemplateRef<undefined> | undefined;
  @ViewChild('formtemplate') formtemplateRef: TemplateRef<undefined> | undefined;
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
    initialEvents: INITIAL_EVENTS,
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
  closeResult: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public clickInfo?: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public selectInfo?: any = null;
  public messageString = "";
  public formTitle = "";
  constructor(private changeDetector: ChangeDetectorRef, private modalService: BsModalService) { }

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.mutate((options) => {
      options.weekends = !options.weekends;
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.selectInfo = selectInfo;
    this.formmodalRef = this.modalService.show(this.formtemplateRef as TemplateRef<void>);
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.clickInfo = clickInfo;
    this.messageString = `Are you sure you want to delete the event '${clickInfo.event.title}'?`
    this.modalRef = this.modalService.show(this.templateRef as TemplateRef<void>);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  openModal(template: TemplateRef<void>) {
    this.formmodalRef = this.modalService.show(template);
  }

  confirm(): void {
    if (this.confirmResolve) {
      this.confirmResolve();
    }
    this.clickInfo.event.remove();
    this.clickInfo = null;
    this.modalRef?.hide();
  }

  decline(): void {
    if (this.confirmReject) {
      this.confirmReject();
    }
    this.modalRef?.hide();
  }

  submit(): void {
    if (this.confirmResolve) {
      this.confirmResolve();
    }
    if (this.formTitle) {
      this.selectInfo.view.calendar.addEvent({
        id: createEventId(),
        title: this.formTitle,
        start: this.selectInfo.startStr,
        end: this.selectInfo.endStr,
        allDay: this.selectInfo.allDay
      });
    }
    this.selectInfo = null;
    this.formTitle = "";
    this.formmodalRef?.hide();
  }

  close(): void {
    this.formmodalRef?.hide();
  }
}