import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import type { Materia, Periodo } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function MateriasPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Materia | null>(null);
  const [form, setForm] = useState({ nombre: '', profesor: '', id_periodo: 0 });

  const { data: materias = [], isLoading } = useQuery<Materia[]>({
    queryKey: ['materias'],
    queryFn: async () => (await apiClient.get('/materias')).data,
  });

  const { data: periodos = [] } = useQuery<Periodo[]>({
    queryKey: ['periodos'],
    queryFn: async () => (await apiClient.get('/periodos')).data,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => apiClient.post('/materias', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materias'] });
      toast.success('Materia creada exitosamente');
      closeDialog();
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Error al crear materia'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { nombre: string; profesor: string; id: number }) =>
      apiClient.put(`/materias/${data.id}`, { nombre: data.nombre, profesor: data.profesor }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materias'] });
      toast.success('Materia actualizada');
      closeDialog();
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Error al actualizar'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/materias/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materias'] });
      toast.success('Materia eliminada');
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Error al eliminar'),
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ nombre: '', profesor: '', id_periodo: periodos[0]?.id_periodo || 0 });
    setDialogOpen(true);
  };

  const openEdit = (m: Materia) => {
    setEditing(m);
    setForm({ nombre: m.nombre, profesor: m.profesor, id_periodo: m.id_periodo });
    setDialogOpen(true);
  };

  const closeDialog = () => { setDialogOpen(false); setEditing(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ nombre: form.nombre, profesor: form.profesor, id: editing.id_materia });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Materias</h2>
            <p className="text-foreground/40 text-sm">Gestiona tus asignaturas</p>
          </div>
        </div>
        <Button onClick={openCreate} className="glass-button text-foreground rounded-xl gap-2">
          <Plus className="w-4 h-4" /> Nueva Materia
        </Button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400" />
          </div>
        ) : materias.length === 0 ? (
          <div className="text-center py-16 text-foreground/40">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No hay materias registradas</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-foreground/6 hover:bg-foreground/5">
                <TableHead className="text-foreground/50">Nombre</TableHead>
                <TableHead className="text-foreground/50">Profesor</TableHead>
                <TableHead className="text-foreground/50">Periodo</TableHead>
                <TableHead className="text-foreground/50 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materias.map((m) => (
                <TableRow key={m.id_materia} className="border-foreground/6 hover:bg-foreground/5">
                  <TableCell className="text-foreground font-medium">{m.nombre}</TableCell>
                  <TableCell className="text-foreground/60">{m.profesor}</TableCell>
                  <TableCell className="text-foreground/40 text-sm">{m.periodo || '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(m)} className="p-2 rounded-lg text-foreground/40 hover:text-blue-400 hover:bg-blue-400/10 transition-all">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteMutation.mutate(m.id_materia)} className="p-2 rounded-lg text-foreground/40 hover:text-red-400 hover:bg-red-400/10 transition-all">
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-card border-foreground/10 text-foreground sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Materia' : 'Nueva Materia'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground/70">Nombre</Label>
              <Input className="glass-input text-foreground border-0" placeholder="Ej: Matemáticas" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/70">Profesor</Label>
              <Input className="glass-input text-foreground border-0" placeholder="Nombre del profesor" value={form.profesor} onChange={(e) => setForm({ ...form, profesor: e.target.value })} />
            </div>
            {!editing && (
              <div className="space-y-2">
                <Label className="text-foreground/70">Periodo</Label>
                <select
                  className="flex h-10 w-full rounded-md glass-input text-foreground px-3 py-2 text-sm"
                  value={form.id_periodo}
                  onChange={(e) => setForm({ ...form, id_periodo: Number(e.target.value) })}
                  required
                >
                  <option value={0} disabled>Seleccionar periodo</option>
                  {periodos.map((p) => (
                    <option key={p.id_periodo} value={p.id_periodo}>{p.nombre}</option>
                  ))}
                </select>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={closeDialog} className="text-foreground/50">Cancelar</Button>
              <Button type="submit" className="glass-button text-foreground">{editing ? 'Guardar' : 'Crear Materia'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
