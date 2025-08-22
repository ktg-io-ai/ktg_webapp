// File Upload Helper Functions
class UploadHelper {
  static async uploadImage(fileInput, type = 'general') {
    if (!fileInput.files || !fileInput.files[0]) {
      throw new Error('No file selected');
    }

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    
    try {
      const response = await fetch(`/api/upload/${type}`, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      if (result.success) {
        return result.imageUrl;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  static previewImage(fileInput, previewElement) {
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewElement.src = e.target.result;
        previewElement.style.display = 'block';
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  static validateImageFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, GIF, and WebP images are allowed');
    }
    
    return true;
  }
}