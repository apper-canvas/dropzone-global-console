import uploadData from '../mockData/uploads.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let uploads = [...uploadData];
let nextId = Math.max(...uploads.map(u => u.Id)) + 1;

const uploadService = {
  async getAll() {
    await delay(300);
    return [...uploads];
  },

  async getById(id) {
    await delay(200);
    const upload = uploads.find(u => u.Id === parseInt(id, 10));
    return upload ? { ...upload } : null;
  },

  async create(uploadData) {
    await delay(300);
    const newUpload = {
      ...uploadData,
      Id: nextId++,
      startTime: Date.now(),
      uploadedSize: 0,
      averageSpeed: 0
    };
    uploads.push(newUpload);
    return { ...newUpload };
  },

  async update(id, data) {
    await delay(200);
    const index = uploads.findIndex(u => u.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Upload session not found');
    
    uploads[index] = { ...uploads[index], ...data };
    return { ...uploads[index] };
  },

  async delete(id) {
    await delay(200);
    const index = uploads.findIndex(u => u.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Upload session not found');
    
    const deletedUpload = uploads[index];
    uploads.splice(index, 1);
    return { ...deletedUpload };
  }
};

export default uploadService;