import { Database as BunSqlite } from 'bun:sqlite';
import { Database } from './database';
import crypto from 'crypto';

function convertPgSqlToSqlite(sql: string): string {
  let paramIndex = 1;
  // Replace $1, $2, etc with ?
  let sqliteSql = sql.replace(/\$\d+/g, () => '?');
  
  // Replace ILIKE with LIKE (SQLite LIKE is case-insensitive for ASCII)
  sqliteSql = sqliteSql.replace(/\bILIKE\b/gi, 'LIKE');
  
  // Replace NOW() with CURRENT_TIMESTAMP
  sqliteSql = sqliteSql.replace(/\bNOW\(\)/gi, 'CURRENT_TIMESTAMP');
  
  // Replace ON CONFLICT (...) DO NOTHING
  // SQLite supports ON CONFLICT (email) DO NOTHING if email is UNIQUE constraint
  // or INSERT OR IGNORE
  sqliteSql = sqliteSql.replace(/ON CONFLICT \([^)]+\) DO NOTHING/gi, 'OR IGNORE');
  sqliteSql = sqliteSql.replace(/ON CONFLICT DO NOTHING/gi, 'OR IGNORE');

  // Handle RETURNING * if present (SQLite supports RETURNING * in modern versions)
  return sqliteSql;
}

export function createSqliteDatabase(filename: string = ':memory:'): Database {
  const db = new BunSqlite(filename);

  // Enable WAL mode & foreign keys
  db.run('PRAGMA foreign_keys = ON;');

  return {
    async query<T>(text: string, params: any[] = []): Promise<{ rows: T[] }> {
      const sql = convertPgSqlToSqlite(text);
      try {
        // Sanitize parameters for SQLite (e.g. serialize arrays/objects to JSON strings)
        const sanitizedParams = params.map(p => {
          if (Array.isArray(p) || (p && typeof p === 'object' && !(p instanceof Date))) {
            return JSON.stringify(p);
          }
          return p;
        });

        // Check if query returns rows or is a mutation
        const trimmed = sql.trim().toUpperCase();
        if (trimmed.startsWith('SELECT') || trimmed.includes('RETURNING')) {
          const stmt = db.prepare(sql);
          const rows = stmt.all(...sanitizedParams) as T[];
          return { rows };
        } else {
          const stmt = db.prepare(sql);
          const info = stmt.run(...sanitizedParams);
          return { rows: [] };
        }
      } catch (err: any) {
        console.error('SQLite query error:', err.message, 'SQL:', sql, 'Params:', params);
        throw err;
      }
    },

    async queryOne<T>(text: string, params: any[] = []): Promise<T | null> {
      const sql = convertPgSqlToSqlite(text);
      try {
        const sanitizedParams = params.map(p => {
          if (Array.isArray(p) || (p && typeof p === 'object' && !(p instanceof Date))) {
            return JSON.stringify(p);
          }
          return p;
        });

        const trimmed = sql.trim().toUpperCase();
        if (trimmed.startsWith('INSERT') || trimmed.startsWith('UPDATE') || trimmed.startsWith('DELETE')) {
          if (sql.includes('RETURNING')) {
            const stmt = db.prepare(sql);
            const row = stmt.get(...sanitizedParams) as T;
            return row || null;
          } else {
            const stmt = db.prepare(sql);
            stmt.run(...sanitizedParams);
            return null;
          }
        }

        const stmt = db.prepare(sql);
        const row = stmt.get(...sanitizedParams) as T;
        return row || null;
      } catch (err: any) {
        console.error('SQLite queryOne error:', err.message, 'SQL:', sql, 'Params:', params);
        throw err;
      }
    },

    async transaction<T>(fn: (client: any) => Promise<T>): Promise<T> {
      db.run('BEGIN TRANSACTION');
      try {
        const result = await fn(this);
        db.run('COMMIT');
        return result;
      } catch (err) {
        db.run('ROLLBACK');
        throw err;
      }
    },

    close() {
      db.close();
    }
  };
}
