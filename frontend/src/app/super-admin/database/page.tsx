'use client';
import { useState, useEffect } from 'react';
import { FiDatabase, FiDownload, FiRefreshCw, FiTrash2, FiAlertCircle, FiCheckCircle, FiClock, FiHardDrive } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface Backup {
  filename: string;
  size: number;
  created_at: string;
}

export default function DatabasePage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  const fetchBackups = async () => {
    try {
      const res = await fetch('/api/super_admin/database.php');
      const data = await res.json();
      if (data.success) {
        setBackups(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch backups', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/super_admin/database.php', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Backup created successfully');
        fetchBackups();
      } else {
        toast.error(data.message || 'Backup failed');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async (filename: string) => {
    if (!confirm(`Are you sure you want to restore "${filename}"? Current data will be overwritten!`)) return;
    setRestoring(filename);
    try {
      const res = await fetch('/api/super_admin/database.php', {
        method: 'PUT',
        body: JSON.stringify({ filename })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Database restored successfully');
      } else {
        toast.error(data.message || 'Restore failed');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setRestoring(null);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm('Permanently delete this backup file?')) return;
    try {
      const res = await fetch(`/api/super_admin/database.php?filename=${filename}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Backup deleted');
        fetchBackups();
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
            <FiDatabase className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" /> Database Management
          </h1>
          <p className="text-white/60 text-sm mt-1 font-medium">Backup and restore your system data securely.</p>
        </div>
        <button
          onClick={handleCreateBackup}
          disabled={creating}
          className="px-6 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 welaund-btn"
        >
          {creating ? <FiRefreshCw className="animate-spin" /> : <FiDatabase />}
          {creating ? 'Creating Backup...' : 'Create Backup Now'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INFO CARD */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 welaund-card space-y-4">
            <div className="flex items-center gap-3 text-cyan-400 font-bold uppercase tracking-widest text-[10px]">
              <FiAlertCircle size={14} /> Critical Info
            </div>
            <h3 className="text-white font-bold text-lg">Safe Restoration</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Restoring a backup will <span className="text-rose-400 font-black uppercase">overwrite</span> all current data including users, shops, and orders. We recommend taking a new backup before restoring an old one.
            </p>
          </div>

          <div className="p-6 welaund-card space-y-4">
            <div className="flex items-center gap-3 text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
              <FiCheckCircle size={14} /> Storage Usage
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-sm font-semibold">Total Backups</span>
              <span className="text-white font-black text-xl">{backups.length}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-1/3 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.4)]" />
            </div>
          </div>
        </div>

        {/* LIST CARD */}
        <div className="lg:col-span-2">
          <div className="welaund-card overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="text-white font-bold flex items-center gap-2">
                <FiHardDrive className="text-indigo-400" /> Backup History
              </h3>
              <button onClick={fetchBackups} className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all">
                <FiRefreshCw size={16} />
              </button>
            </div>

            <div className="divide-y divide-white/5">
              {loading ? (
                <div className="p-20 text-center text-white/20 font-medium italic">Loading backup history...</div>
              ) : backups.length === 0 ? (
                <div className="p-20 text-center text-white/20 font-medium italic">No backups found yet. Create your first one!</div>
              ) : (
                backups.map((b) => (
                  <div key={b.filename} className="p-6 flex flex-wrap items-center justify-between gap-4 hover:bg-white/5 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-cyan-400 group-hover:bg-cyan-400/10 transition-all duration-300 border border-white/5 group-hover:border-cyan-400/20">
                        <FiDatabase size={22} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-base tracking-tight">{b.filename}</p>
                        <div className="flex items-center gap-4 mt-1.5">
                          <span className="text-[11px] text-white/40 font-semibold flex items-center gap-1.5"><FiClock className="text-indigo-400/50" /> {b.created_at}</span>
                          <span className="text-[11px] text-white/40 font-semibold flex items-center gap-1.5"><FiHardDrive className="text-cyan-400/50" /> {formatSize(b.size)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2.5">
                      <a
                        href={`/api/super_admin/database.php?action=download&filename=${b.filename}`}
                        className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/20 transition-all active:scale-90"
                        title="Download SQL"
                      >
                        <FiDownload size={20} />
                      </a>
                      <button
                        onClick={() => handleRestore(b.filename)}
                        disabled={!!restoring}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-90 shadow-lg ${
                          restoring === b.filename 
                            ? 'bg-amber-400/20 text-amber-400 animate-pulse' 
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white hover:shadow-indigo-500/25'
                        }`}
                      >
                        {restoring === b.filename ? 'Restoring...' : 'Restore'}
                      </button>
                      <button
                        onClick={() => handleDelete(b.filename)}
                        className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-rose-400 hover:bg-rose-400/10 border border-transparent hover:border-rose-400/20 transition-all active:scale-90"
                        title="Delete Permanently"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
