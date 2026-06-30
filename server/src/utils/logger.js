import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import env from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configure Morgan HTTP request logger.
 * - Development: Colored concise output to console ('dev' format)
 * - Production: Apache-style logs written to file ('combined' format)
 */
export function setupLogger(app) {
  if (env.NODE_ENV === 'production') {
    // Ensure logs directory exists
    const logDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Write combined logs to access.log
    const accessLogStream = fs.createWriteStream(
      path.join(logDir, 'access.log'),
      { flags: 'a' }
    );

    app.use(morgan('combined', { stream: accessLogStream }));
  } else {
    // Dev: concise colored output to console
    app.use(morgan('dev'));
  }
}
