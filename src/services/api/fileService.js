import fileData from '../mockData/files.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let files = [...fileData];
let nextId = Math.max(...files.map(f => f.Id)) + 1;

const fileService = {
  async getAll() {
    await delay(300);
    return [...files];
  },

  async getById(id) {
    await delay(200);
    const file = files.find(f => f.Id === parseInt(id, 10));
    return file ? { ...file } : null;
  },

  async create(fileData) {
    await delay(400);
    const newFile = {
      ...fileData,
      Id: nextId++,
      uploadProgress: 0,
      status: 'pending'
    };
    files.push(newFile);
    return { ...newFile };
  },

  async update(id, data) {
    await delay(300);
    const index = files.findIndex(f => f.Id === parseInt(id, 10));
    if (index === -1) throw new Error('File not found');
    
    files[index] = { ...files[index], ...data };
    return { ...files[index] };
  },

  async delete(id) {
    await delay(200);
    const index = files.findIndex(f => f.Id === parseInt(id, 10));
    if (index === -1) throw new Error('File not found');
    
    const deletedFile = files[index];
    files.splice(index, 1);
    return { ...deletedFile };
  },

  async uploadFile(file, onProgress) {
    await delay(100);
    
    // Simulate upload progress
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve({
            success: true,
            url: `https://example.com/files/${file.name}`,
            uploadedAt: Date.now()
          });
        }
        onProgress(progress);
      }, 200);
    });
  }
};

export default fileService;