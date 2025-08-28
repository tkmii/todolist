import express from 'express';
import db from '../db';
import { authenticateToken } from '../middleware/auth';
import type { AuthenticatedRequest } from '../interfaces/index';

const router = express.Router();

router.use(authenticateToken);

const transformTodo = (todo: any) => ({
  ...todo,
  completed: Boolean(todo.completed)
});

router.get('/', (req: AuthenticatedRequest, res) => {
  db.all(
    'SELECT * FROM todos WHERE userId = ? ORDER BY createdAt DESC',
    [req.user!.userId],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      const transformedTodos = (rows as any[]).map(transformTodo);
      res.json(transformedTodos);
    }
  );
});

router.post('/', (req: AuthenticatedRequest, res) => {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  db.run(
    'INSERT INTO todos (title, userId) VALUES (?, ?)',
    [title, req.user!.userId],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create todo' });
      }
      
      res.json({
        id: this.lastID,
        title,
        completed: false,
        userId: req.user!.userId
      });
    }
  );
});

router.put('/:id', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  if (title === undefined && completed === undefined) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  db.get(
    'SELECT id FROM todos WHERE id = ? AND userId = ?',
    [id, req.user!.userId],
    (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Todo not found or access denied' });
      }

      let query = 'UPDATE todos SET ';
      const params: any[] = [];
      const updates: string[] = [];

      if (title !== undefined) {
        updates.push('title = ?');
        params.push(title);
      }
      
      if (completed !== undefined) {
        updates.push('completed = ?');
        params.push(completed ? 1 : 0); 
      }

      query += updates.join(', ') + ' WHERE id = ?';
      params.push(id);

      db.run(query, params, function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to update todo' });
        }
        
        db.get(
          'SELECT * FROM todos WHERE id = ?',
          [id],
          (err, updatedTodo) => {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Failed to fetch updated todo' });
            }
            
            res.json(transformTodo(updatedTodo)); 
          }
        );
      });
    }
  );
});

router.delete('/:id', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  db.get(
    'SELECT id FROM todos WHERE id = ? AND userId = ?',
    [id, req.user!.userId],
    (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Todo not found or access denied' });
      }

      db.run(
        'DELETE FROM todos WHERE id = ?',
        [id],
        function(err) {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to delete todo' });
          }
          
          res.json({ message: 'Todo deleted successfully' });
        }
      );
    }
  );
});

export default router;