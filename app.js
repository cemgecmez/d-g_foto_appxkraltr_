import React, { useState } from 'react';
import imageCompression from 'browser-image-compression'; // Kütüphaneyi içe aktar

function App() {
  const [name, setName] = useState('');
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); // Birden fazla fotoğraf için
  const [filePreviews, setFilePreviews] = useState([]); // Önizleme URL'leri için

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsNameSubmitted(true);  
  };

  // Dosya seçildiğinde birden fazla dosyayı saklayacak şekilde güncelleme
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Dosyaları diziye çevir
    setSelectedFiles(files);  // Dosyaları sakla

    // Önizleme URL'lerini oluştur
    const previews = files.map(file => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      for (const file of selectedFiles) {
        try {
          // Sıkıştırma seçenekleri
          const options = {
            maxSizeMB: 1, // Maksimum dosya boyutu (MB)
            maxWidthOrHeight: 1920, // Maksimum genişlik veya yükseklik
            useWebWorker: true, 
            initialQuality: 0.6, // Web iş parçacığını kullan
          };

          // Resmi sıkıştır
          const compressedFile = await imageCompression(file, options);
          console.log('Sıkıştırılmış dosya:', compressedFile.name);
          console.log('Sıkıştırılmış dosya boyutu:', compressedFile.size / 1024 / 1024, 'MB');

        } catch (error) {
          console.error('Sıkıştırma hatası:', error);
        }
      }
    }
  };

  return (
    <div className="App">
      <h1>Fotoğraf Yükleme Uygulaması</h1>

      {!isNameSubmitted ? (
        <form onSubmit={handleSubmit}>
          <label>
            İsminizi girin:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <button type="submit">Gönder</button>
        </form>
      ) : (
        <div>
          <p>Hoşgeldin, {name}!</p>

          {/* Birden fazla fotoğraf yükleme */}
          <input type="file" onChange={handleFileChange} multiple />
          <button onClick={handleUpload}>Fotoğrafları Yükle</button>

          {filePreviews.length > 0 && (
            <div>
              {filePreviews.map((preview, index) => (
                <img key={index} src={preview} alt={`Preview ${index}`} style={{ width: '100px', height: '100px', margin: '5px' }} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
