import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import type { Tarea, Materia } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, ClipboardList, Check, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

type FilterTab = 'todas' | 'pendientes' | 'completadas' | 'vencidas';

export default function TareasPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<FilterTab>('todas');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Tarea | null>(null);
  const [form, setForm] = useState({
    titulo: '', descripcion: '', fecha_entrega: '', id_materia: 0,
  });

  const queryKey = tab === 'todas' ? ['tareas'] : ['tareas', tab];
  const endpoint = tab === 'todas' ? '/tareas' : `/tareas/estado/${tab}`;

  const { data: tareas = [], isLoading } = useQuery<Tarea[]>({
    queryKey,
    queryFn: async () => (await apiClient.get(endpoint)).data,
  });

  const { data: materias = [] } = useQuery<Materia[]>({
    queryKey: ['materias'],
    queryFn: async () => (await apiClient.get('/materias')).data,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => apiClient.post('/tareas', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      toast.success('Tarea creada exitosamente');
      closeDialog();
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Error al crear tarea'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { titulo: string; descripcion: string; fecha_entrega: string; id: number }) =>
      apiClient.put(`/tareas/${data.id}`, { titulo: data.titulo, descripcion: data.descripcion, fecha_entrega: data.fecha_entrega }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      toast.success('Tarea actualizada');
      closeDialog();
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Error al actualizar'),
  });

  const completeMutation = useMutation({
    mutationFn: (id: number) => apiClient.patch(`/tareas/${id}/completar`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      toast.success('Tarea completada ✓');
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/tareas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      toast.success('Tarea eliminada');
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Error al eliminar'),
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ titulo: '', descripcion: '', fecha_entrega: '', id_materia: materias[0]?.id_materia || 0 });
    setDialogOpen(true);
  };

  const openEdit = (t: Tarea) => {
    setEditing(t);
    setForm({
      titulo: t.titulo,
      descripcion: t.descripcion || '',
      fecha_entrega: t.fecha_entrega?.split('T')[0] || '',
      id_materia: t.id_materia,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => { setDialogOpen(false); setEditing(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ titulo: form.titulo, descripcion: form.descripcion, fecha_entrega: form.fecha_entrega, id: editing.id_tarea });
    } else {
      createMutation.mutate(form);
    }
  };

  const tabs: { key: FilterTab; label: string; icon: typeof ClipboardList }[] = [
    { key: 'todas', label: 'Todas', icon: ClipboardList },
    { key: 'pendientes', label: 'Pendientes', icon: Clock },
    { key: 'completadas', label: 'Completadas', icon: Check },
    { key: 'vencidas', label: 'Vencidas', icon: AlertTriangle },
  ];

  const isOverdue = (t: Tarea) => !t.completada && new Date(t.fecha_entrega) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Tareas</h2>
            <p className="text-white/40 text-sm">Rastrea tus entregas y actividades</p>
          </div>
        </div>
        <Button onClick={openCreate} className="glass-button text-white rounded-xl gap-2">
          <Plus className="w-4 h-4" /> Nueva Tarea
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.key ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60 hover:bg-white/5'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400" />
          </div>
        ) : tareas.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No hay tareas para mostrar</p>
          </div>
        ) : (
          <div className="divide-y divide-white/6">
            {tareas.map((t) => (
              <div key={t.id_tarea} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-all">
                {/* Complete button */}
                <button
                  onClick={() => !t.completada && completeMutation.mutate(t.id_tarea)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    t.completada
                      ? 'border-green-400 bg-green-400/20 text-green-400'
                      : 'border-white/20 hover:border-green-400/50'
                  }`}
                >
                  {t.completada && <Check className="w-3 h-3" />}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${t.completada ? 'text-white/40 line-through' : 'text-white'}`}>
                    {t.titulo}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {t.materia && (
                      <span className="text-xs text-purple-400/80">{t.materia}</span>
                    )}
                    {t.fecha_entrega && (
                      <span className="text-xs text-white/30">
                        {new Date(t.fecha_entrega).toLocaleDateString('es-ES')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status badge */}
                {t.completada ? (
                  <span className="text-xs px-2 py-1 rounded-full font-medium text-green-400 bg-green-400/10">
                    completada
                  </span>
                ) : isOverdue(t) ? (
                  <span className="text-xs px-2 py-1 rounded-full font-medium text-red-400 bg-red-400/10">
                    vencida
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 rounded-full font-medium text-amber-400 bg-amber-400/10">
                    pendiente
                  </span>
                )}

                <div className="flex gap-1">
                  <button onClick={() => openEdit(t)} className="p-2 rounded-lg text-white/30 hover:text-blue-400 hover:bg-blue-400/10 transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteMutation.mutate(t.id_tarea)} className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-card border-white/10 text-white sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Tarea' : 'Nueva Tarea'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/70">Título</Label>
              <Input className="glass-input text-white border-0" placeholder="Ej: Entregar ensayo" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Descripción</Label>
              <Input className="glass-input text-white border-0" placeholder="Detalles opcionales" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Fecha de entrega</Label>
              <Input type="date" className="glass-input text-white border-0" value={form.fecha_entrega} onChange={(e) => setForm({ ...form, fecha_entrega: e.target.value })} required />
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
              <Button type="submit" className="glass-button text-white">{editing ? 'Guardar' : 'Crear Tarea'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
