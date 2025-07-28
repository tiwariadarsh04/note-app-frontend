import React, { useEffect, useState } from 'react';
import axios from 'axios';

const decodeToken = (token: string) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
};

interface Note {
  _id: string;
  content: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const token = localStorage.getItem('token');
  const user = token ? decodeToken(token) : null;

  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !user) {
      window.location.href = '/';
    } else {
      fetchNotes();
    }
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch notes');
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      await axios.post(
        'http://localhost:5000/api/notes',
        { content: newNote },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewNote('');
      fetchNotes();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add note');
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchNotes();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete note');
    }
  };

  return (
    <div style={styles.wrapper}>
      <img src="/bg.jpg" alt="bg" style={styles.bg} />
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Welcome, {user?.name || 'User'} 👋</h2>
          <button
            style={styles.logoutButton}
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
          >
            Logout
          </button>
        </div>

        <div style={styles.inputGroup}>
          <input
            style={styles.input}
            type="text"
            placeholder="Write a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <button style={styles.addButton} onClick={addNote}>
            Add
          </button>
        </div>

        {notes.length === 0 ? (
          <p style={styles.empty}>No notes yet. Start writing something!</p>
        ) : (
          <div style={styles.noteList}>
            {notes.map((note) => (
              <div key={note._id} style={styles.noteCard}>
                <p style={styles.noteText}>{note.content}</p>
                <div style={styles.noteFooter}>
                  <span style={styles.noteDate}>
                    {new Date(note.createdAt).toLocaleString()}
                  </span>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteNote(note._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
    borderRadius: '32px',
  },
  card: {
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    padding: '32px',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '700px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  heading: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#1e40af',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '10px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  inputGroup: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    fontSize: '16px',
    outline: 'none',
  },
  addButton: {
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '16px',
    marginTop: '20px',
  },
  noteList: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  noteCard: {
    backgroundColor: '#f0f9ff',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #c7d2fe',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  },
  noteText: {
    fontSize: '16px',
    fontWeight: 500,
    color: '#374151',
    marginBottom: '8px',
  },
  noteFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    color: '#6b7280',
  },
  noteDate: {
    fontStyle: 'italic',
  },
  deleteBtn: {
    color: '#dc2626',
    fontWeight: 600,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  error: {
    color: '#dc2626',
    textAlign: 'center',
    marginTop: '16px',
    fontWeight: 500,
  },
};

export default Dashboard;
