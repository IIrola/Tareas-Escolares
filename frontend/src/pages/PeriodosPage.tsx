import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import type { Periodo } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, Timer } from 'lucide-react';
import { toast } from 'sonner';

export default function PeriodosPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Periodo | null>(null);
  const [form, setForm] = useState({ nombre: '', fecha_inicio: '', fecha_fin: '' });

  const { data: periodos = [], isLoading } = useQuery<Periodo[]>({
    queryKey: ['periodos'],
    queryFn: async () => {
      const res = await apiClient.get('/periodos');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => apiClient.post('/periodos', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periodos'] });
      toast.success('Periodo creado exitosamente');
      closeDialog();
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Error al crear periodo'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: typeof form & { id: number }) =>
      apiClient.put(`/periodos/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periodos'] });
      toast.success('Periodo actualizado');
      closeDialog();
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Error al actualizar'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/periodos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periodos'] });
      toast.success('Periodo eliminado');
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Error al eliminar'),
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ nombre: '', fecha_inicio: '', fecha_fin: '' });
    setDialogOpen(true);
  };

  const openEdit = (p: Periodo) => {
    setEditing(p);
    setForm({
      nombre: p.nombre,
      fecha_inicio: p.fecha_inicio?.split('T')[0] || '',
      fecha_fin: p.fecha_fin?.split('T')[0] || '',
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ ...form, id: editing.id_periodo });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Timer className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Periodos Académicos</h2>
            <p className="text-foreground/40 text-sm">Gestiona tus ciclos escolares</p>
          </div>
        </div>
        <Button onClick={openCreate} className="glass-button text-foreground rounded-xl gap-2">
          <Plus className="w-4 h-4" /> Nuevo Periodo
        </Button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400" />
          </div>
        ) : periodos.length === 0 ? (
          <div className="text-center py-16 text-foreground/40">
            <Timer className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No hay periodos registrados</p>
            <p className="text-sm mt-1">Crea tu primer periodo académico</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-foreground/6 hover:bg-foreground/5">
                <TableHead className="text-foreground/50">Nombre</TableHead>
                <TableHead className="text-foreground/50">Fecha Inicio</TableHead>
                <TableHead className="text-foreground/50">Fecha Fin</TableHead>
                <TableHead className="text-foreground/50 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periodos.map((p) => (
                <TableRow key={p.id_periodo} className="border-foreground/6 hover:bg-foreground/5">
                  <TableCell className="text-foreground font-medium">{p.nombre}</TableCell>
                  <TableCell className="text-foreground/60">
                    {new Date(p.fecha_inicio).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell className="text-foreground/60">
                    {new Date(p.fecha_fin).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 rounded-lg text-foreground/40 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(p.id_periodo)}
                        className="p-2 rounded-lg text-foreground/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-card border-foreground/10 text-foreground sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Periodo' : 'Nuevo Periodo'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground/70">Nombre</Label>
              <Input
                className="glass-input text-foreground border-0"
                placeholder="Ej: Semestre 2026-1"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/70">Fecha Inicio</Label>
                <Input
                  type="date"
                  className="glass-input text-foreground border-0"
                  value={form.fecha_inicio}
                  onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/70">Fecha Fin</Label>
                <Input
                  type="date"
                  className="glass-input text-foreground border-0"
                  value={form.fecha_fin}
                  onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={closeDialog} className="text-foreground/50">
                Cancelar
              </Button>
              <Button type="submit" className="glass-button text-foreground">
                {editing ? 'Guardar Cambios' : 'Crear Periodo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
