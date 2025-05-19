// Import Firebase
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../firebase/config";

// Khởi tạo Firebase Storage
const storage = getStorage(app);

// Hàm upload một file và trả về URL
// Hàm upload một file và trả về URL
export const uploadFileAndGetURL = async (file, folder = "contracts", fileName = null) => {
  try {
    // Đặt tên file
    const name = fileName || file.name;
    // Tạo reference đến file trong storage với folder động
    const storageRef = ref(storage, `${folder}/${name}`);
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    // Lấy URL download
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Hàm upload nhiều file và trả về mảng URL
export const uploadMultipleFiles = async (files) => {
  try {
    const uploadPromises = files.map(file => uploadFileAndGetURL(file));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    throw error;
  }
}; 