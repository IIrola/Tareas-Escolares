import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import type { Horario, Materia } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, CalendarClock } from 'lucide-react';
import { toast } from 'sonner';

const DIAS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

const DIA_LABELS: Record<string, string> = {
  'Lun': 'Lunes', 'Mar': 'Martes', 'Mie': 'Miércoles',
  'Jue': 'Jueves', 'Vie': 'Viernes', 'Sab': 'Sábado',
};

export default function HorariosPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Horario | null>(null);
  const [form, setForm] = useState({ dia_semana: '', hora_inicio: '', hora_fin: '', id_materia: 0 });

  const { data: horarios = [], isLoading } = useQuery<Horario[]>({
    queryKey: ['horarios'],
    queryFn: async () => (await apiClient.get('/horarios')).data,
  });

  const { data: materias = [] } = useQuery<Materia[]>({
    queryKey: ['materias'],
    queryFn: async () => (await apiClient.get('/materias')).data,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => apiClient.post('/horarios', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horarios'] });
      toast.success('Horario creado exitosamente');
      closeDialog();
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Error al crear horario'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { dia_semana: string; hora_inicio: string; hora_fin: string; id: number }) =>
      apiClient.put(`/horarios/${data.id}`, { dia_semana: data.dia_semana, hora_inicio: data.hora_inicio, hora_fin: data.hora_fin }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horarios'] });
      toast.success('Horario actualizado');
      closeDialog();
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Error al actualizar'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/horarios/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horarios'] });
      toast.success('Horario eliminado');
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Error al eliminar'),
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ dia_semana: DIAS[0], hora_inicio: '08:00', hora_fin: '09:00', id_materia: materias[0]?.id_materia || 0 });
    setDialogOpen(true);
  };

  const openEdit = (h: Horario) => {
    setEditing(h);
    setForm({ dia_semana: h.dia_semana, hora_inicio: h.hora_inicio, hora_fin: h.hora_fin, id_materia: h.id_materia });
    setDialogOpen(true);
  };

  const closeDialog = () => { setDialogOpen(false); setEditing(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ dia_semana: form.dia_semana, hora_inicio: form.hora_inicio, hora_fin: form.hora_fin, id: editing.id_horario });
    } else {
      createMutation.mutate(form);
    }
  };

  // Group horarios by day
  const grouped = DIAS.reduce((acc, dia) => {
    acc[dia] = horarios.filter((h) => h.dia_semana.trim().toLowerCase() === dia.toLowerCase());
    return acc;
  }, {} as Record<string, Horario[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
            <CalendarClock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Horarios</h2>
            <p className="text-white/40 text-sm">Configura tu horario semanal de clases</p>
          </div>
        </div>
        <Button onClick={openCreate} className="glass-button text-white rounded-xl gap-2">
          <Plus className="w-4 h-4" /> Nuevo Horario
        </Button>
      </div>

      {isLoading ? (
        <div className="glass-card rounded-2xl flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400" />
        </div>
      ) : horarios.length === 0 ? (
        <div className="glass-card rounded-2xl text-center py-16 text-white/40">
          <CalendarClock className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No hay horarios registrados</p>
          <p className="text-sm mt-1">Agrega tus bloques de clase</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/6 hover:bg-white/5">
                <TableHead className="text-white/50">Día</TableHead>
                <TableHead className="text-white/50">Hora Inicio</TableHead>
                <TableHead className="text-white/50">Hora Fin</TableHead>
                <TableHead className="text-white/50">Materia</TableHead>
                <TableHead className="text-white/50 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DIAS.map((dia) =>
                grouped[dia]?.map((h) => (
                  <TableRow key={h.id_horario} className="border-white/6 hover:bg-white/5">
                    <TableCell className="text-white font-medium">{DIA_LABELS[h.dia_semana.trim()] || h.dia_semana}</TableCell>
                    <TableCell className="text-white/60">{h.hora_inicio}</TableCell>
                    <TableCell className="text-white/60">{h.hora_fin}</TableCell>
                    <TableCell className="text-purple-400/80">{h.materia || '—'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(h)} className="p-2 rounded-lg text-white/40 hover:text-blue-400 hover:bg-blue-400/10 transition-all">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteMutation.mutate(h.id_horario)} className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-card border-white/10 text-white sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Horario' : 'Nuevo Horario'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/70">Día de la semana</Label>
              <select className="flex h-10 w-full rounded-md glass-input text-white px-3 py-2 text-sm" value={form.dia_semana} onChange={(e) => setForm({ ...form, dia_semana: e.target.value })} required>
                {DIAS.map((d) => (
                  <option key={d} value={d}>{DIA_LABELS[d] || d}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/70">Hora Inicio</Label>
                <Input type="time" className="glass-input text-white border-0" value={form.hora_inicio} onChange={(e) => setForm({ ...form, hora_inicio: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Hora Fin</Label>
                <Input type="time" className="glass-input text-white border-0" value={form.hora_fin} onChange={(e) => setForm({ ...form, hora_fin: e.target.value })} required />
              </div>
            </div>
            {!editing && (
              <div className="space-y-2">
                <Label className="text-white/70">Materia</Label>
                <select className="flex h-10 w-full rounded-md glass-input text-white px-3 py-2 text-sm" value={form.id_materia} onChange={(e) => setForm({ ...form, id_materia: Number(e.target.value) })} required>
                  <option value={0} disabled>Seleccionar materia</option>
                  {materias.map((m) => (
                    <option key={m.id_materia} value={m.id_materia}>{m.nombre}</option>
                  ))}
                </select>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={closeDialog} className="text-white/50">Cancelar</Button>
              <Button type="submit" className="glass-button text-white">{editing ? 'Guardar' : 'Crear Horario'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
