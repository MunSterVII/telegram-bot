const fs = require('node:fs/promises');
const path = require('node:path');

const SESSIONS_DIR = 'sessions';

dirPath = path.join(__dirname, SESSIONS_DIR);

fs.mkdir(dirPath, { recursive: true })
  .then(() => console.log('Sessions directory created or already exists:', dirPath))
  .catch((err) => console.error('Error creating directory:', err));

class SessionFileHandler {
  constructor(name) {
    this.fileName = name.trim() + '.json';
    this.filePath = path.join(__dirname, SESSIONS_DIR, this.fileName);
  }

  async read() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      const jsonData = JSON.parse(data);
      console.log('File read successfully')
      return jsonData;
    } catch (err) {
      console.error("Can't read the file:", err);
    }
  }

  async write(data) {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      await fs.writeFile(this.filePath, jsonString, 'utf-8');
      console.log('File written successfully')
    } catch (err) {
      console.error("File couldn't be written:", err);
    }
  }
};

module.exports = SessionFileHandler;
