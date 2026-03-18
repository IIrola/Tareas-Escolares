import { useMemo, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, momentLocalizer, type View, type NavigateAction } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import apiClient from '@/api/apiClient';
import type { Horario, Tarea, Materia, Periodo } from '@/types';
import { CalendarDays, ChevronLeft, ChevronRight, BookOpen, ClipboardList, X } from 'lucide-react';

moment.locale('es');
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  tipo: 'horario' | 'tarea';
  meta?: Record<string, any>;
}

const DAY_MAP: Record<string, number> = {
  lun: 1, mar: 2, mie: 3, jue: 4, vie: 5, sab: 6,
  lunes: 1, martes: 2, miercoles: 3, 'miércoles': 3,
  jueves: 4, viernes: 5, sabado: 6, 'sábado': 6, domingo: 0,
};

const DIA_LABELS: Record<string, string> = {
  '1': 'Lunes', '2': 'Martes', '3': 'Miércoles',
  '4': 'Jueves', '5': 'Viernes', '6': 'Sábado', '0': 'Domingo',
};

function getDayInstancesInRange(dayCode: number, rangeStart: Date, rangeEnd: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(rangeStart);
  // Move to the first occurrence of this day in the range
  while (current.getDay() !== dayCode) {
    current.setDate(current.getDate() + 1);
  }
  // Collect all occurrences in range
  while (current <= rangeEnd) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }
  return dates;
}

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('week');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const { data: horarios = [] } = useQuery<Horario[]>({
    queryKey: ['horarios'],
    queryFn: async () => (await apiClient.get('/horarios')).data,
    staleTime: 0, // Always refetch when mounting this page
  });

  const { data: tareas = [] } = useQuery<Tarea[]>({
    queryKey: ['tareas'],
    queryFn: async () => (await apiClient.get('/tareas')).data,
    staleTime: 0,
  });

  const { data: materias = [] } = useQuery<Materia[]>({
    queryKey: ['materias'],
    queryFn: async () => (await apiClient.get('/materias')).data,
  });

  const { data: periodos = [] } = useQuery<Periodo[]>({
    queryKey: ['periodos'],
    queryFn: async () => (await apiClient.get('/periodos')).data,
  });

  // Build lookup: id_materia → periodo dates
  const materiaPeriodoMap = useMemo(() => {
    const periodoMap = new Map(periodos.map((p) => [p.id_periodo, p]));
    const map = new Map<number, { inicio: Date; fin: Date }>();
    for (const m of materias) {
      const p = periodoMap.get(m.id_periodo);
      if (p) {
        map.set(m.id_materia, {
          inicio: new Date(p.fecha_inicio),
          fin: new Date(p.fecha_fin),
        });
      }
    }
    return map;
  }, [materias, periodos]);

  // Compute visible range for recurring horario events
  const visibleRange = useMemo(() => {
    const start = moment(currentDate).startOf(currentView === 'day' ? 'day' : currentView === 'week' ? 'week' : 'month').subtract(7, 'days').toDate();
    const end = moment(currentDate).endOf(currentView === 'day' ? 'day' : currentView === 'week' ? 'week' : 'month').add(7, 'days').toDate();
    return { start, end };
  }, [currentDate, currentView]);

  const events: CalendarEvent[] = useMemo(() => {
    // Horarios recur every week — but only within the periodo date range
    const horarioEvents: CalendarEvent[] = [];
    for (const h of horarios) {
      const dayCode = DAY_MAP[h.dia_semana.trim().toLowerCase()] ?? 1;
      const [sh, sm] = (h.hora_inicio || '08:00').split(':').map(Number);
      const [eh, em] = (h.hora_fin || '09:00').split(':').map(Number);

      // Clamp to periodo date range
      const periodoRange = materiaPeriodoMap.get(h.id_materia);
      const rangeStart = periodoRange
        ? new Date(Math.max(visibleRange.start.getTime(), periodoRange.inicio.getTime()))
        : visibleRange.start;
      const rangeEnd = periodoRange
        ? new Date(Math.min(visibleRange.end.getTime(), periodoRange.fin.getTime()))
        : visibleRange.end;

      // Skip if periodo hasn't started or already ended relative to visible range
      if (rangeStart > rangeEnd) continue;

      const instances = getDayInstancesInRange(dayCode, rangeStart, rangeEnd);

      for (const dayDate of instances) {
        const start = new Date(dayDate);
        start.setHours(sh, sm, 0, 0);
        const end = new Date(dayDate);
        end.setHours(eh, em, 0, 0);
        horarioEvents.push({
          id: `horario-${h.id_horario}-${dayDate.toISOString()}`,
          title: h.materia || 'Clase',
          start,
          end,
          color: '#8b5cf6',
          tipo: 'horario',
          meta: {
            materia: h.materia,
            periodo: periodoRange ? h.periodo : undefined,
            dia: DIA_LABELS[String(dayCode)] || h.dia_semana,
            hora: `${h.hora_inicio} — ${h.hora_fin}`,
          },
        });
      }
    }

    const tareaEvents: CalendarEvent[] = tareas
      .filter((t) => t.fecha_entrega)
      .map((t) => {
        const d = new Date(t.fecha_entrega);
        d.setHours(23, 59, 0, 0);
        return {
          id: `tarea-${t.id_tarea}`,
          title: t.titulo,
          start: new Date(new Date(t.fecha_entrega).setHours(0, 0, 0, 0)),
          end: d,
          color: t.completada ? '#10b981' : '#f59e0b',
          tipo: 'tarea' as const,
          meta: {
            titulo: t.titulo,
            descripcion: t.descripcion,
            materia: t.materia,
            entrega: new Date(t.fecha_entrega).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
            completada: t.completada,
          },
        };
      });

    return [...horarioEvents, ...tareaEvents];
  }, [horarios, tareas, visibleRange]);

  const handleNavigate = useCallback((newDate: Date, _view: View, _action: NavigateAction) => {
    setCurrentDate(newDate);
  }, []);

  const handleViewChange = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  // Custom toolbar
  const CustomToolbar = useCallback(({ label, onNavigate, onView }: any) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 px-1">
      {/* Navigation */}
      <div className="flex items-center gap-3">
        <div className="flex items-center glass rounded-xl overflow-hidden">
          <button onClick={() => onNavigate('PREV')} className="px-3 py-2.5 text-white/50 hover:text-white hover:bg-white/10 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => onNavigate('TODAY')} className="px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-medium border-x border-white/6">
            Hoy
          </button>
          <button onClick={() => onNavigate('NEXT')} className="px-3 py-2.5 text-white/50 hover:text-white hover:bg-white/10 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <h3 className="text-white font-semibold text-lg capitalize">{label}</h3>
      </div>

      {/* View Switcher */}
      <div className="flex items-center glass rounded-xl overflow-hidden">
        {[
          { key: 'month', label: 'Mes' },
          { key: 'week', label: 'Semana' },
          { key: 'day', label: 'Día' },
        ].map((v) => (
          <button
            key={v.key}
            onClick={() => onView(v.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-all ${
              currentView === v.key
                ? 'bg-purple-500/20 text-purple-300'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  ), [currentView]);

  // Event detail panel
  const EventDetail = () => {
    if (!selectedEvent) return null;
    const m = selectedEvent.meta || {};
    const isHorario = selectedEvent.tipo === 'horario';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="glass-card rounded-2xl p-6 w-full max-w-sm relative z-10 animate-fade-in" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors">
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isHorario ? 'bg-purple-500/20' : 'bg-amber-500/20'}`}>
              {isHorario ? <BookOpen className="w-5 h-5 text-purple-400" /> : <ClipboardList className="w-5 h-5 text-amber-400" />}
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider">{isHorario ? 'Clase' : 'Tarea'}</p>
              <h3 className="text-white font-semibold">{selectedEvent.title}</h3>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            {m.materia && (
              <div className="flex justify-between">
                <span className="text-white/40">Materia</span>
                <span className="text-purple-400 font-medium">{m.materia}</span>
              </div>
            )}
            {isHorario && m.dia && (
              <div className="flex justify-between">
                <span className="text-white/40">Día</span>
                <span className="text-white/70">{m.dia}</span>
              </div>
            )}
            {isHorario && m.hora && (
              <div className="flex justify-between">
                <span className="text-white/40">Horario</span>
                <span className="text-white/70">{m.hora}</span>
              </div>
            )}
            {!isHorario && m.entrega && (
              <div className="flex justify-between">
                <span className="text-white/40">Fecha de entrega</span>
                <span className="text-white/70 capitalize">{m.entrega}</span>
              </div>
            )}
            {!isHorario && m.descripcion && (
              <div>
                <span className="text-white/40 block mb-1">Descripción</span>
                <p className="text-white/60 text-xs leading-relaxed">{m.descripcion}</p>
              </div>
            )}
            {!isHorario && (
              <div className="flex justify-between">
                <span className="text-white/40">Estado</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.completada ? 'bg-green-400/10 text-green-400' : 'bg-amber-400/10 text-amber-400'}`}>
                  {m.completada ? 'Completada' : 'Pendiente'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Stats
  const totalHorarios = horarios.length;
  const totalTareas = tareas.length;
  const tareasPendientes = tareas.filter((t) => !t.completada).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
          <CalendarDays className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Calendario</h2>
          <p className="text-white/40 text-sm">Visualiza tus horarios de clase y entregas</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-500/15 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg">{totalHorarios}</p>
            <p className="text-white/30 text-xs">Bloques de clase</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500/15 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg">{totalTareas}</p>
            <p className="text-white/30 text-xs">Tareas totales</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-rose-500/15 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg">{tareasPendientes}</p>
            <p className="text-white/30 text-xs">Pendientes</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 px-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-white/40 text-xs">Clases</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-white/40 text-xs">Tareas pendientes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-white/40 text-xs">Tareas completadas</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="glass-card rounded-2xl p-5 overflow-hidden calendar-dark">
        <style>{`
          .calendar-dark .rbc-calendar { color: rgba(255,255,255,0.8); font-family: 'Inter', system-ui, sans-serif; }
          .calendar-dark .rbc-toolbar { display: none; }
          .calendar-dark .rbc-header { color: rgba(255,255,255,0.5); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 10px 0; font-weight: 500; font-size: 13px; text-transform: capitalize; }
          .calendar-dark .rbc-today { background: rgba(139,92,246,0.06); }
          .calendar-dark .rbc-off-range-bg { background: rgba(0,0,0,0.15); }
          .calendar-dark .rbc-off-range { color: rgba(255,255,255,0.15); }
          .calendar-dark .rbc-day-bg + .rbc-day-bg,
          .calendar-dark .rbc-month-row + .rbc-month-row,
          .calendar-dark .rbc-time-content > * + * > * { border-color: rgba(255,255,255,0.04); }
          .calendar-dark .rbc-timeslot-group { border-color: rgba(255,255,255,0.04); min-height: 50px; }
          .calendar-dark .rbc-time-slot { border-color: rgba(255,255,255,0.02); }
          .calendar-dark .rbc-time-header-content { border-color: rgba(255,255,255,0.06); }
          .calendar-dark .rbc-time-view { border-color: rgba(255,255,255,0.06); border-radius: 12px; overflow: hidden; }
          .calendar-dark .rbc-time-header { border-bottom: 1px solid rgba(255,255,255,0.06); }
          .calendar-dark .rbc-label { color: rgba(255,255,255,0.25); font-size: 11px; padding: 0 8px; }
          .calendar-dark .rbc-event { border-radius: 8px; padding: 3px 8px; font-size: 12px; font-weight: 500; border: none !important; box-shadow: 0 2px 8px rgba(0,0,0,0.3); cursor: pointer; transition: transform 0.15s ease, box-shadow 0.15s ease; }
          .calendar-dark .rbc-event:hover { transform: scale(1.02); box-shadow: 0 4px 16px rgba(0,0,0,0.4); }
          .calendar-dark .rbc-month-view { border-color: rgba(255,255,255,0.06); border-radius: 12px; overflow: hidden; }
          .calendar-dark .rbc-month-view .rbc-header { background: rgba(255,255,255,0.02); }
          .calendar-dark .rbc-date-cell { color: rgba(255,255,255,0.5); padding: 4px 8px; font-size: 13px; }
          .calendar-dark .rbc-date-cell.rbc-now { font-weight: 700; }
          .calendar-dark .rbc-date-cell.rbc-now > a { color: #a78bfa; }
          .calendar-dark .rbc-show-more { color: rgba(167,139,250,0.8); font-size: 11px; font-weight: 500; }
          .calendar-dark .rbc-day-slot .rbc-time-slot { border-top: 1px solid rgba(255,255,255,0.02); }
          .calendar-dark .rbc-current-time-indicator { background: #a78bfa; height: 2px; }
          .calendar-dark .rbc-allday-cell { display: none; }
          .calendar-dark .rbc-time-header-cell .rbc-header { border-left: 1px solid rgba(255,255,255,0.04); }
          .calendar-dark .rbc-time-header-gutter { border-right: 1px solid rgba(255,255,255,0.06); }
          .calendar-dark .rbc-day-slot .rbc-event-label { font-size: 10px; color: rgba(255,255,255,0.7); }
          .calendar-dark .rbc-row-segment { padding: 0 2px 1px 2px; }
        `}</style>

        <CustomToolbar
          label={moment(currentDate).format(
            currentView === 'month' ? 'MMMM YYYY' :
            currentView === 'day' ? 'dddd, D [de] MMMM YYYY' :
            `D MMM — ${moment(currentDate).endOf('week').format('D MMM YYYY')}`
          )}
          onNavigate={(action: string) => {
            const unit = currentView === 'month' ? 'month' : currentView === 'week' ? 'week' : 'day';
            if (action === 'TODAY') setCurrentDate(new Date());
            else if (action === 'PREV') setCurrentDate(moment(currentDate).subtract(1, unit).toDate());
            else if (action === 'NEXT') setCurrentDate(moment(currentDate).add(1, unit).toDate());
          }}
          onView={handleViewChange}
        />

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 620 }}
          view={currentView}
          date={currentDate}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          views={['month', 'week', 'day']}
          toolbar={false}
          min={new Date(2026, 0, 1, 6, 0, 0)}
          max={new Date(2026, 0, 1, 22, 0, 0)}
          step={30}
          timeslots={2}
          onSelectEvent={(event) => setSelectedEvent(event as CalendarEvent)}
          messages={{
            today: 'Hoy', previous: '←', next: '→',
            month: 'Mes', week: 'Semana', day: 'Día',
            noEventsInRange: 'No hay eventos en este rango',
            showMore: (total: number) => `+${total} más`,
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color || '#8b5cf6',
              border: 'none',
              opacity: 0.9,
            },
          })}
          dayPropGetter={(date) => {
            const isToday = moment(date).isSame(moment(), 'day');
            return isToday ? { className: 'rbc-today' } : {};
          }}
        />
      </div>

      {/* Event Detail Modal */}
      <EventDetail />
    </div>
  );
}
