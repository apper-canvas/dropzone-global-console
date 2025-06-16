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
    
    // Calculate speed if uploadedSize is being updated
    if (data.uploadedSize !== undefined) {
      const upload = uploads[index];
      const elapsedTime = (Date.now() - upload.startTime) / 1000; // seconds
      if (elapsedTime > 0) {
        data.averageSpeed = data.uploadedSize / elapsedTime; // bytes per second
      }
    }
    
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
  },

  async getAggregateStats() {
    await delay(200);
    const activeUploads = uploads.filter(u => u.uploadedSize < u.totalSize);
    const completedUploads = uploads.filter(u => u.uploadedSize >= u.totalSize);
    
    const totalFiles = uploads.reduce((sum, u) => sum + u.totalFiles, 0);
    const completedFiles = completedUploads.reduce((sum, u) => sum + u.totalFiles, 0);
    const totalSize = uploads.reduce((sum, u) => sum + u.totalSize, 0);
    const uploadedSize = uploads.reduce((sum, u) => sum + u.uploadedSize, 0);
    const averageSpeed = activeUploads.length > 0 
      ? activeUploads.reduce((sum, u) => sum + u.averageSpeed, 0) / activeUploads.length 
      : 0;

    return {
      totalFiles,
      completedFiles,
      totalSize,
      uploadedSize,
      averageSpeed,
      activeUploads: activeUploads.length,
      completedUploads: completedUploads.length
    };
  }
};

export default uploadService;